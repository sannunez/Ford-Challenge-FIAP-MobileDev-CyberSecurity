package com.example.ChallengeFord.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {

    // Dedicated logger name allows routing audit events to a separate file/SIEM via Logback config
    private static final Logger auditLog = LoggerFactory.getLogger("AUDIT");

    public void logEvent(String event, String ip, String details) {
        auditLog.info("event={} ip={} details=\"{}\" cid={}", event, ip, details, MDC.get("cid"));
    }
}
