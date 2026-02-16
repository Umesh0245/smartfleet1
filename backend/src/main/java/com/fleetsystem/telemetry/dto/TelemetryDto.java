package com.fleetsystem.telemetry.dto;

import java.util.Map;

public class TelemetryDto {
    private String vehicleId;
    private String timestamp;
    private Map<String, Object> specs;
    private Map<String, Object> signals;
    private Map<String, Object> status;

    public TelemetryDto() {}

    public TelemetryDto(String vehicleId, String timestamp, Map<String, Object> specs, 
                       Map<String, Object> signals, Map<String, Object> status) {
        this.vehicleId = vehicleId;
        this.timestamp = timestamp;
        this.specs = specs;
        this.signals = signals;
        this.status = status;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, Object> getSpecs() {
        return specs;
    }

    public void setSpecs(Map<String, Object> specs) {
        this.specs = specs;
    }

    public Map<String, Object> getSignals() {
        return signals;
    }

    public void setSignals(Map<String, Object> signals) {
        this.signals = signals;
    }

    public Map<String, Object> getStatus() {
        return status;
    }

    public void setStatus(Map<String, Object> status) {
        this.status = status;
    }
}