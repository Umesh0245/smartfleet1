package com.fleetsystem.telemetry.consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(value = "kafka.enabled", havingValue = "true", matchIfMissing = false)
public class TelemetryConsumer {

    private static final Logger log = LoggerFactory.getLogger(TelemetryConsumer.class);

    @KafkaListener(topics = "scania-telemetry", groupId = "smartfleet-group")
    public void consumeTelemetry(String message) {
        log.info("Received telemetry message: {}", message);
        // TODO: Parse message and process telemetry data
    }
    
    // Manual method to simulate telemetry processing for testing
    public void simulateTelemetryProcessing() {
        log.info("Simulating telemetry processing - Kafka consumer is disabled");
    }
}