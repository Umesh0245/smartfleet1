package com.fleetsystem.telemetry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fleetsystem.telemetry.entity.VehicleTelemetryEntity;

@Repository
public interface VehicleTelemetryRepository extends JpaRepository<VehicleTelemetryEntity, String> {
    VehicleTelemetryEntity findByVehicleId(String vehicleId);
}