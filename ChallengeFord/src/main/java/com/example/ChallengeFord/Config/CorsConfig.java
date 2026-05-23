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
                .allowedOriginPatterns(
                    "http://10.0.2.2:*", // Android emulator (qualquer porta)
                    "http://localhost:*", // Web dev / iOS simulator (qualquer porta)
                    "http://127.0.0.1:*" // Local development (qualquer porta)
                )
                .allowedMethods("GET", "POST")
                .allowedHeaders("Authorization", "Content-Type")
                .maxAge(3600);
    }
}
