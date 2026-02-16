package com.fleetsystem.springbackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fleetsystem.springbackend.entity.VehicleEntity;

@Repository
public interface VehicleRepository extends JpaRepository<VehicleEntity, String> {
    
    Optional<VehicleEntity> findByVehicleId(String vehicleId);
    
    List<VehicleEntity> findByStatus(String status);
    
    boolean existsByVehicleId(String vehicleId);
    
    boolean existsByGpsId(String gpsId);
    
    boolean existsByIotDeviceId(String iotDeviceId);
    
    boolean existsByRegistrationNumber(String registrationNumber);
    
    @Query("SELECT v FROM VehicleEntity v WHERE v.status = 'active'")
    List<VehicleEntity> findActiveVehicles();
    
    @Query("SELECT COUNT(v) FROM VehicleEntity v WHERE v.status = 'active'")
    long countActiveVehicles();
    
    @Query("SELECT v FROM VehicleEntity v WHERE v.driverName LIKE %?1%")
    List<VehicleEntity> findByDriverNameContaining(String driverName);
}