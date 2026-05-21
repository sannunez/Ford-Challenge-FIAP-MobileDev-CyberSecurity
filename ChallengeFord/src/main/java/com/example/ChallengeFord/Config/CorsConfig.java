package com.example.ChallengeFord.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // Permite explicitamente apenas origens conhecidas — bloqueia requisições de domínios não autorizados
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://10.0.2.2",   // Android emulator
                    "http://localhost",   // iOS simulator / web dev
                    "http://127.0.0.1"   // Local development
                )
                .allowedMethods("GET")
                .maxAge(3600);
    }
}
