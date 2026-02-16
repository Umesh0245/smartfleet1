package com.fleetsystem.telemetry.Event;

import java.io.Serializable;
import java.time.Instant;
import java.util.Map;

import org.hibernate.annotations.Type;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "telemetry_event")
public class TelemetryEvent implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "vehicle_id")
    private String vehicleId;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> specs;
    
    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> signals;
    
    @Column(name = "telemetry_timestamp")
    private Instant telemetryTimestamp;
    
    private String status;

    public TelemetryEvent() {}

    public TelemetryEvent(Long id, String vehicleId, Map<String, Object> specs, 
                         Map<String, Object> signals, String status, 
                         Instant telemetryTimestamp) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.specs = specs;
        this.signals = signals;
        this.status = status;
        this.telemetryTimestamp = telemetryTimestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
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

    public Instant getTelemetryTimestamp() {
        return telemetryTimestamp;
    }

    public void setTelemetryTimestamp(Instant telemetryTimestamp) {
        this.telemetryTimestamp = telemetryTimestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}