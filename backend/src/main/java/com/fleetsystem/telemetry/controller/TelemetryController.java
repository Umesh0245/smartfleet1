package com.fleetsystem.telemetry.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fleetsystem.telemetry.dto.TelemetryDto;
import com.fleetsystem.telemetry.service.TelemetryService;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TelemetryController {

    @Autowired
    private TelemetryService telemetryService;

    @PostMapping
    public ResponseEntity<?> receiveTelemetry(@RequestBody TelemetryDto telemetryDto) {
        try {
            System.out.println("Received telemetry data for vehicle: " + telemetryDto.getVehicleId());
            
            // Save telemetry data
            telemetryService.processTelemetryData(telemetryDto);
            
            return ResponseEntity.ok().body("{\"status\":\"success\",\"message\":\"Telemetry data received\"}");
        } catch (Exception e) {
            System.err.println("Error processing telemetry: " + e.getMessage());
            return ResponseEntity.internalServerError()
                .body("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping
    public ResponseEntity<List<TelemetryDto>> getAllTelemetry() {
        try {
            List<TelemetryDto> telemetryData = telemetryService.getAllTelemetryData();
            return ResponseEntity.ok(telemetryData);
        } catch (Exception e) {
            System.err.println("Error retrieving telemetry: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<TelemetryDto>> getTelemetryByVehicle(@PathVariable String vehicleId) {
        try {
            List<TelemetryDto> telemetryData = telemetryService.getTelemetryByVehicleId(vehicleId);
            return ResponseEntity.ok(telemetryData);
        } catch (Exception e) {
            System.err.println("Error retrieving telemetry for vehicle " + vehicleId + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<List<TelemetryDto>> getLatestTelemetry() {
        try {
            List<TelemetryDto> latestTelemetry = telemetryService.getLatestTelemetryData();
            return ResponseEntity.ok(latestTelemetry);
        } catch (Exception e) {
            System.err.println("Error retrieving latest telemetry: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}