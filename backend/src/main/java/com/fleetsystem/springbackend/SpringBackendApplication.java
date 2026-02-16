package com.fleetsystem.springbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
    "com.fleetsystem.springbackend",
    "com.fleetsystem.telemetry"
})
@EntityScan(basePackages = {
    "com.fleetsystem.telemetry.entity",
    "com.fleetsystem.springbackend.entity"
})
@EnableJpaRepositories(basePackages = {
    "com.fleetsystem.telemetry.repository",
    "com.fleetsystem.springbackend.repository"
})
public class SpringBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBackendApplication.class, args);
    }
}