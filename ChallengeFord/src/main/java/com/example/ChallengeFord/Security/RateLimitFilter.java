package com.example.ChallengeFord.Security;

import com.example.ChallengeFord.Service.AuditLogService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);

    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private static final int MAX_UNIQUE_IDS_PER_MINUTE = 30;
    private static final long ENTRY_TTL_MS = 300_000;        // remove entradas inativas por 5 min
    private static final long CLEANUP_INTERVAL_MS = 120_000; // verifica limpeza a cada 2 min

    private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Long> windowStart = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Set<String>> idTracker = new ConcurrentHashMap<>();
    private final AtomicLong lastCleanup = new AtomicLong(System.currentTimeMillis());

    private final AuditLogService audit;

    public RateLimitFilter(AuditLogService audit) {
        this.audit = audit;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String ip = request.getRemoteAddr();
        long now = System.currentTimeMillis();

        periodicCleanup(now);

        windowStart.putIfAbsent(ip, now);
        requestCounts.putIfAbsent(ip, new AtomicInteger(0));

        if (now - windowStart.get(ip) > 60_000) {
            windowStart.put(ip, now);
            requestCounts.put(ip, new AtomicInteger(0));
            idTracker.remove(ip);
        }

        int count = requestCounts.get(ip).incrementAndGet();

        if (count > MAX_REQUESTS_PER_MINUTE) {
            log.warn("Rate limit exceeded | ip={} count={}", ip, count);
            audit.logEvent("RATE_LIMIT_EXCEEDED", ip, "count=" + count);
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests\"}");
            return;
        }

        detectSequentialScan(request.getRequestURI(), ip);

        chain.doFilter(request, response);
    }

    private void detectSequentialScan(String uri, String ip) {
        if (!uri.matches("/cars/[0-9]+")) return;
        String id = uri.substring(uri.lastIndexOf('/') + 1);
        Set<String> accessed = idTracker.computeIfAbsent(ip, k -> ConcurrentHashMap.newKeySet());
        accessed.add(id);
        // Log once when threshold is crossed, not on every subsequent request
        if (accessed.size() == MAX_UNIQUE_IDS_PER_MINUTE + 1) {
            log.warn("Anomaly: sequential ID scan | ip={} uniqueIds={}", ip, accessed.size());
            audit.logEvent("SEQUENTIAL_SCAN_DETECTED", ip, "uniqueIds=" + accessed.size());
        }
    }

    private void periodicCleanup(long now) {
        long last = lastCleanup.get();
        if (now - last > CLEANUP_INTERVAL_MS && lastCleanup.compareAndSet(last, now)) {
            windowStart.entrySet().removeIf(e -> now - e.getValue() > ENTRY_TTL_MS);
            requestCounts.keySet().retainAll(windowStart.keySet());
            idTracker.keySet().retainAll(windowStart.keySet());
            log.debug("Rate limiter cleanup | active entries={}", windowStart.size());
        }
    }
}
