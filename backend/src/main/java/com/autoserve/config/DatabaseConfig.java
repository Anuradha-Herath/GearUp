package com.autoserve.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.autoserve.repository")
public class DatabaseConfig {
    // Additional database configuration if needed
}