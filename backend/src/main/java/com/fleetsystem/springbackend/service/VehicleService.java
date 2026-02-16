package com.fleetsystem.springbackend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fleetsystem.springbackend.entity.VehicleEntity;
import com.fleetsystem.springbackend.repository.VehicleRepository;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public VehicleEntity createVehicle(String vehicleId, String gpsId, String iotDeviceId, 
                                     String driverName, String registrationNumber, 
                                     String make, String model, Integer year) {
        // Check if vehicle already exists
        if (vehicleRepository.existsByVehicleId(vehicleId)) {
            throw new RuntimeException("Vehicle with ID " + vehicleId + " already exists");
        }
        
        if (vehicleRepository.existsByGpsId(gpsId)) {
            throw new RuntimeException("Vehicle with GPS ID " + gpsId + " already exists");
        }
        
        if (vehicleRepository.existsByIotDeviceId(iotDeviceId)) {
            throw new RuntimeException("Vehicle with IoT Device ID " + iotDeviceId + " already exists");
        }
        
        if (vehicleRepository.existsByRegistrationNumber(registrationNumber)) {
            throw new RuntimeException("Vehicle with Registration Number " + registrationNumber + " already exists");
        }

        // Create new vehicle
        VehicleEntity vehicle = new VehicleEntity();
        vehicle.setVehicleId(vehicleId);
        vehicle.setGpsId(gpsId);
        vehicle.setIotDeviceId(iotDeviceId);
        vehicle.setDriverName(driverName);
        vehicle.setRegistrationNumber(registrationNumber);
        vehicle.setMake(make);
        vehicle.setModel(model);
        vehicle.setYear(year);
        vehicle.setStatus("active");

        return vehicleRepository.save(vehicle);
    }
    
    public VehicleEntity updateVehicle(String vehicleId, VehicleEntity updatedVehicle) {
        Optional<VehicleEntity> existingVehicle = vehicleRepository.findByVehicleId(vehicleId);
        
        if (existingVehicle.isPresent()) {
            VehicleEntity vehicle = existingVehicle.get();
            
            // Update fields if provided
            if (updatedVehicle.getDriverName() != null) {
                vehicle.setDriverName(updatedVehicle.getDriverName());
            }
            if (updatedVehicle.getStatus() != null) {
                vehicle.setStatus(updatedVehicle.getStatus());
            }
            if (updatedVehicle.getFuelLevel() != null) {
                vehicle.setFuelLevel(updatedVehicle.getFuelLevel());
            }
            if (updatedVehicle.getEngineHealth() != null) {
                vehicle.setEngineHealth(updatedVehicle.getEngineHealth());
            }
            if (updatedVehicle.getLocation() != null) {
                vehicle.setLocation(updatedVehicle.getLocation());
            }
            if (updatedVehicle.getSpeed() != null) {
                vehicle.setSpeed(updatedVehicle.getSpeed());
            }
            if (updatedVehicle.getTirePressure() != null) {
                vehicle.setTirePressure(updatedVehicle.getTirePressure());
            }
            if (updatedVehicle.getEngineTemp() != null) {
                vehicle.setEngineTemp(updatedVehicle.getEngineTemp());
            }
            if (updatedVehicle.getRpm() != null) {
                vehicle.setRpm(updatedVehicle.getRpm());
            }
            
            return vehicleRepository.save(vehicle);
        } else {
            throw new RuntimeException("Vehicle with ID " + vehicleId + " not found");
        }
    }

    public void deleteVehicle(String vehicleId) {
        if (vehicleRepository.existsByVehicleId(vehicleId)) {
            vehicleRepository.deleteById(vehicleId);
        } else {
            throw new RuntimeException("Vehicle with ID " + vehicleId + " not found");
        }
    }

    public List<VehicleEntity> getAllVehicles() {
        return vehicleRepository.findAll();
    }
    
    public List<VehicleEntity> getActiveVehicles() {
        return vehicleRepository.findActiveVehicles();
    }

    public Optional<VehicleEntity> getVehicleById(String vehicleId) {
        return vehicleRepository.findByVehicleId(vehicleId);
    }

    public List<VehicleEntity> getVehiclesByStatus(String status) {
        return vehicleRepository.findByStatus(status);
    }
    
    public List<VehicleEntity> searchVehiclesByDriver(String driverName) {
        return vehicleRepository.findByDriverNameContaining(driverName);
    }
    
    public long getActiveVehicleCount() {
        return vehicleRepository.countActiveVehicles();
    }
}