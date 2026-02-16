package com.fleetsystem.telemetry.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fleetsystem.telemetry.dto.TelemetryDto;
import com.fleetsystem.telemetry.entity.VehicleTelemetryEntity;
import com.fleetsystem.telemetry.repository.VehicleTelemetryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TelemetryService {

    private static final Logger log = LoggerFactory.getLogger(TelemetryService.class);
    private final VehicleTelemetryRepository repository;

    public TelemetryService(VehicleTelemetryRepository repository) {
        this.repository = repository;
    }

    public void processTelemetryUpdate(TelemetryDto dto) {
        log.info("Processing telemetry update for vehicle: {}", dto.getVehicleId());

        VehicleTelemetryEntity v = repository.findByVehicleId(dto.getVehicleId());

        if (v == null) {
            v = new VehicleTelemetryEntity();
        }

        v.setVehicleId(dto.getVehicleId());
        v.setTimestamp(dto.getTimestamp());
        v.setSpecs(dto.getSpecs());
        v.setSignals(dto.getSignals());
        v.setStatus(dto.getStatus());

        repository.save(v);
        log.info("Telemetry data saved for vehicle: {}", dto.getVehicleId());
    }

    // New method for telemetry controller
    public void processTelemetryData(TelemetryDto dto) {
        processTelemetryUpdate(dto);
    }
    
    // Method to process JSON telemetry messages (used by HTTP endpoint and Kafka consumer)
    public void processTelemetryMessage(String telemetryJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            TelemetryDto dto = objectMapper.readValue(telemetryJson, TelemetryDto.class);
            processTelemetryUpdate(dto);
        } catch (Exception e) {
            log.error("Error parsing telemetry JSON: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to parse telemetry data", e);
        }
    }

    public List<TelemetryDto> getAllTelemetryData() {
        List<VehicleTelemetryEntity> entities = repository.findAll();
        return entities.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TelemetryDto> getTelemetryByVehicleId(String vehicleId) {
        VehicleTelemetryEntity entity = repository.findByVehicleId(vehicleId);
        if (entity != null) {
            return List.of(convertToDto(entity));
        }
        return List.of();
    }

    public List<TelemetryDto> getLatestTelemetryData() {
        // For now, return all data. In production, this would be optimized to get latest per vehicle
        return getAllTelemetryData();
    }

    private TelemetryDto convertToDto(VehicleTelemetryEntity entity) {
        TelemetryDto dto = new TelemetryDto();
        dto.setVehicleId(entity.getVehicleId());
        dto.setTimestamp(entity.getTimestamp());
        dto.setSpecs(entity.getSpecs());
        dto.setSignals(entity.getSignals());
        dto.setStatus(entity.getStatus());
        return dto;
    }
}