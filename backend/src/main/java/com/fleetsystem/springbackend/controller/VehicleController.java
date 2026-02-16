package com.fleetsystem.springbackend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fleetsystem.springbackend.entity.VehicleEntity;
import com.fleetsystem.springbackend.service.VehicleService;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VehicleController {
    
    private static final Logger log = LoggerFactory.getLogger(VehicleController.class);
    
    @Autowired
    private VehicleService vehicleService;
    
    @GetMapping
    public ResponseEntity<List<VehicleEntity>> getAllVehicles() {
        try {
            List<VehicleEntity> vehicles = vehicleService.getAllVehicles();
            log.info("Returning {} vehicles", vehicles.size());
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            log.error("Error retrieving all vehicles: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<VehicleEntity>> getActiveVehicles() {
        try {
            List<VehicleEntity> vehicles = vehicleService.getActiveVehicles();
            log.info("Returning {} active vehicles", vehicles.size());
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            log.error("Error retrieving active vehicles: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleEntity> getVehicleById(@PathVariable String vehicleId) {
        try {
            Optional<VehicleEntity> vehicle = vehicleService.getVehicleById(vehicleId);
            if (vehicle.isPresent()) {
                log.info("Returning vehicle: {}", vehicleId);
                return ResponseEntity.ok(vehicle.get());
            } else {
                log.warn("Vehicle not found: {}", vehicleId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error retrieving vehicle {}: {}", vehicleId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<VehicleEntity>> getVehiclesByStatus(@PathVariable String status) {
        try {
            List<VehicleEntity> vehicles = vehicleService.getVehiclesByStatus(status);
            log.info("Returning {} vehicles with status: {}", vehicles.size(), status);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            log.error("Error retrieving vehicles by status {}: {}", status, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<VehicleEntity>> searchVehiclesByDriver(@RequestParam String driverName) {
        try {
            List<VehicleEntity> vehicles = vehicleService.searchVehiclesByDriver(driverName);
            log.info("Returning {} vehicles for driver search: {}", vehicles.size(), driverName);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            log.error("Error searching vehicles by driver {}: {}", driverName, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createVehicle(@RequestBody CreateVehicleRequest request) {
        try {
            log.info("Creating vehicle with ID: {}", request.getVehicleId());
            
            VehicleEntity vehicle = vehicleService.createVehicle(
                request.getVehicleId(),
                request.getGpsId(),
                request.getIotDeviceId(),
                request.getDriverName(),
                request.getRegistrationNumber(),
                request.getMake(),
                request.getModel(),
                request.getYear()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehicle created successfully");
            response.put("vehicle", vehicle);
            
            log.info("Vehicle created successfully: {}", request.getVehicleId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (RuntimeException e) {
            log.error("Vehicle creation failed: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } catch (Exception e) {
            log.error("Vehicle creation error: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Vehicle creation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @PutMapping("/{vehicleId}")
    public ResponseEntity<Map<String, Object>> updateVehicle(@PathVariable String vehicleId, 
                                                           @RequestBody VehicleEntity updatedVehicle) {
        try {
            log.info("Updating vehicle: {}", vehicleId);
            
            VehicleEntity vehicle = vehicleService.updateVehicle(vehicleId, updatedVehicle);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehicle updated successfully");
            response.put("vehicle", vehicle);
            
            log.info("Vehicle updated successfully: {}", vehicleId);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("Vehicle update failed: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            log.error("Vehicle update error: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Vehicle update failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<Map<String, Object>> deleteVehicle(@PathVariable String vehicleId) {
        try {
            log.info("Deleting vehicle: {}", vehicleId);
            
            vehicleService.deleteVehicle(vehicleId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehicle deleted successfully");
            
            log.info("Vehicle deleted successfully: {}", vehicleId);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("Vehicle deletion failed: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            log.error("Vehicle deletion error: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Vehicle deletion failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/analytics/count/active")
    public ResponseEntity<Map<String, Object>> getActiveVehicleCount() {
        try {
            long count = vehicleService.getActiveVehicleCount();
            Map<String, Object> response = new HashMap<>();
            response.put("activeVehicleCount", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting active vehicle count: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Request DTOs
    public static class CreateVehicleRequest {
        private String vehicleId;
        private String gpsId;
        private String iotDeviceId;
        private String driverName;
        private String registrationNumber;
        private String make;
        private String model;
        private Integer year;
        
        // Getters and Setters
        public String getVehicleId() { return vehicleId; }
        public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
        
        public String getGpsId() { return gpsId; }
        public void setGpsId(String gpsId) { this.gpsId = gpsId; }
        
        public String getIotDeviceId() { return iotDeviceId; }
        public void setIotDeviceId(String iotDeviceId) { this.iotDeviceId = iotDeviceId; }
        
        public String getDriverName() { return driverName; }
        public void setDriverName(String driverName) { this.driverName = driverName; }
        
        public String getRegistrationNumber() { return registrationNumber; }
        public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
        
        public String getMake() { return make; }
        public void setMake(String make) { this.make = make; }
        
        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
        
        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }
    }
}