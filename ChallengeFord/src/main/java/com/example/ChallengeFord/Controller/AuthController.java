package com.example.ChallengeFord.Controller;

import com.example.ChallengeFord.Service.AuditLogService;
import com.example.ChallengeFord.Service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final JwtService jwtService;
    private final AuditLogService audit;

    @Value("${jwt.app-key}")
    private String appKey;

    public AuthController(JwtService jwtService, AuditLogService audit) {
        this.jwtService = jwtService;
        this.audit = audit;
    }

    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> getToken(
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {

        if (body == null || !appKey.equals(body.get("appKey"))) {
            log.warn("Auth failed | ip={}", request.getRemoteAddr());
            audit.logEvent("AUTH_FAILED", request.getRemoteAddr(), "invalid app key");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtService.generateToken("ford-app-client");
        log.info("Token issued | ip={}", request.getRemoteAddr());
        audit.logEvent("AUTH_SUCCESS", request.getRemoteAddr(), "token issued");
        return ResponseEntity.ok(Map.of("token", token));
    }
}
