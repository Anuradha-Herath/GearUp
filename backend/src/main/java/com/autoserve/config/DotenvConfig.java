package com.autoserve.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class DotenvConfig {

    @PostConstruct
    public void loadEnv() {
        try {
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();

            // Set system properties so Spring can access them
            dotenv.entries().forEach(entry -> 
                System.setProperty(entry.getKey(), entry.getValue())
            );
            
            System.out.println("✅ Environment variables loaded from .env file");
            System.out.println("📧 SendGrid configured with email: " + System.getProperty("SENDGRID_FROM_EMAIL"));
        } catch (Exception e) {
            System.err.println("⚠️ Could not load .env file: " + e.getMessage());
            // Fallback - try to load from system environment
            System.out.println("🔄 Trying to load from system environment variables...");
        }
    }
}