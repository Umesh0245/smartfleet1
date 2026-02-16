package com.fleetsystem.springbackend.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fleetsystem.telemetry.entity.VehicleTelemetryEntity;
import com.fleetsystem.telemetry.repository.VehicleTelemetryRepository;
import com.fleetsystem.telemetry.service.TelemetryService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api")
public class FleetAnalyticsController {
    
    private static final Logger log = LoggerFactory.getLogger(FleetAnalyticsController.class);
    private final VehicleTelemetryRepository repository;
    private final TelemetryService telemetryService;
    
    @Autowired(required = false)
    private KafkaTemplate<String, String> kafkaTemplate;

    public FleetAnalyticsController(VehicleTelemetryRepository repository, TelemetryService telemetryService) {
        this.repository = repository;
        this.telemetryService = telemetryService;
    }

    @GetMapping("/vehicle-telemetry/{vehicleId}")
    public ResponseEntity<VehicleTelemetryEntity> getVehicleTelemetry(@PathVariable String vehicleId) {
        try {
            Optional<VehicleTelemetryEntity> vehicle = repository.findById(vehicleId);
            if (vehicle.isPresent()) {
                log.info("Returning telemetry for vehicle: {}", vehicleId);
                return ResponseEntity.ok(vehicle.get());
            } else {
                log.warn("Vehicle not found: {}", vehicleId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving vehicle {}: {}", vehicleId, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/vehicle-telemetry")
    public List<VehicleTelemetryEntity> getAllVehicleTelemetry() {
        List<VehicleTelemetryEntity> vehicles = repository.findAll();
        log.info("Returning telemetry for all vehicles, count: {}", vehicles.size());
        return vehicles;
    }
    
    @PostMapping("/telemetry/ingest")
    public ResponseEntity<String> ingestTelemetry(@RequestBody String telemetryJson) {
        try {
            log.info("Received telemetry data via HTTP: {}", telemetryJson.substring(0, Math.min(100, telemetryJson.length())) + "...");
            
            // Process the telemetry data using the existing service
            telemetryService.processTelemetryMessage(telemetryJson);
            
            return ResponseEntity.ok("{\"status\":\"success\",\"message\":\"Telemetry data ingested successfully\"}");
        } catch (Exception e) {
            log.error("Error processing telemetry data: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                .body("{\"status\":\"error\",\"message\":\"Failed to process telemetry data: " + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/test/kafka")
    public ResponseEntity<String> testKafka() {
        if (kafkaTemplate != null) {
            String testMessage = "{\"vehicleId\": 12345, \"timestamp\": " + System.currentTimeMillis() + ", \"status\": \"active\"}";
            kafkaTemplate.send("scania-telemetry", testMessage);
            log.info("Sent test message to Kafka: {}", testMessage);
            return ResponseEntity.ok("Test message sent to Kafka successfully!");
        } else {
            return ResponseEntity.ok("Kafka is disabled. Enable with kafka.enabled=true");
        }
    }
}