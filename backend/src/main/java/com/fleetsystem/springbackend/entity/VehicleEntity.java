package com.fleetsystem.springbackend.entity;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicles")
public class VehicleEntity {
    
    @Id
    private String vehicleId;
    
    @Column(nullable = false, unique = true)
    private String gpsId;
    
    @Column(nullable = false, unique = true)
    private String iotDeviceId;
    
    @Column(nullable = false)
    private String driverName;
    
    @Column(nullable = false, unique = true)
    private String registrationNumber;
    
    @Column(nullable = false)
    private String make;
    
    @Column(nullable = false)
    private String model;
    
    @Column(nullable = false)
    private Integer year;
    
    @Column(nullable = false)
    private String status = "active"; // active, inactive, maintenance
    
    @Column(name = "created_at")
    private Instant createdAt;
    
    @Column(name = "updated_at")
    private Instant updatedAt;
    
    // Additional telemetry fields for enrichment
    private Double fuelLevel;
    private String engineHealth;
    private String location;
    private Double speed;
    private Double tirePressure;
    private Double engineTemp;
    private Integer rpm;
    
    // Constructors
    public VehicleEntity() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }
    
    public VehicleEntity(String vehicleId, String gpsId, String iotDeviceId, String driverName, 
                        String registrationNumber, String make, String model, Integer year) {
        this();
        this.vehicleId = vehicleId;
        this.gpsId = gpsId;
        this.iotDeviceId = iotDeviceId;
        this.driverName = driverName;
        this.registrationNumber = registrationNumber;
        this.make = make;
        this.model = model;
        this.year = year;
    }
    
    // Getters and Setters
    public String getVehicleId() {
        return vehicleId;
    }
    
    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }
    
    public String getGpsId() {
        return gpsId;
    }
    
    public void setGpsId(String gpsId) {
        this.gpsId = gpsId;
    }
    
    public String getIotDeviceId() {
        return iotDeviceId;
    }
    
    public void setIotDeviceId(String iotDeviceId) {
        this.iotDeviceId = iotDeviceId;
    }
    
    public String getDriverName() {
        return driverName;
    }
    
    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }
    
    public String getRegistrationNumber() {
        return registrationNumber;
    }
    
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
    
    public String getMake() {
        return make;
    }
    
    public void setMake(String make) {
        this.make = make;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Instant getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    
    public Instant getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Double getFuelLevel() {
        return fuelLevel;
    }
    
    public void setFuelLevel(Double fuelLevel) {
        this.fuelLevel = fuelLevel;
    }
    
    public String getEngineHealth() {
        return engineHealth;
    }
    
    public void setEngineHealth(String engineHealth) {
        this.engineHealth = engineHealth;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public Double getSpeed() {
        return speed;
    }
    
    public void setSpeed(Double speed) {
        this.speed = speed;
    }
    
    public Double getTirePressure() {
        return tirePressure;
    }
    
    public void setTirePressure(Double tirePressure) {
        this.tirePressure = tirePressure;
    }
    
    public Double getEngineTemp() {
        return engineTemp;
    }
    
    public void setEngineTemp(Double engineTemp) {
        this.engineTemp = engineTemp;
    }
    
    public Integer getRpm() {
        return rpm;
    }
    
    public void setRpm(Integer rpm) {
        this.rpm = rpm;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}