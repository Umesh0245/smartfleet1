package com.fleetsystem.springbackend.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true", matchIfMissing = false)
public class CacheService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void cacheVehicleData(String vehicleId, Object data) {
        try {
            String key = "vehicle:" + vehicleId;
            redisTemplate.opsForValue().set(key, data, 5, TimeUnit.MINUTES);
        } catch (Exception e) {
            // Log error but don't fail the operation
            System.err.println("Failed to cache data for vehicle " + vehicleId + ": " + e.getMessage());
        }
    }

    public Object getCachedVehicleData(String vehicleId) {
        try {
            String key = "vehicle:" + vehicleId;
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            System.err.println("Failed to retrieve cached data for vehicle " + vehicleId + ": " + e.getMessage());
            return null;
        }
    }

    public void cacheFleetMetrics(Object metrics) {
        try {
            redisTemplate.opsForValue().set("fleet:metrics", metrics, 2, TimeUnit.MINUTES);
        } catch (Exception e) {
            System.err.println("Failed to cache fleet metrics: " + e.getMessage());
        }
    }

    public Object getCachedFleetMetrics() {
        try {
            return redisTemplate.opsForValue().get("fleet:metrics");
        } catch (Exception e) {
            System.err.println("Failed to retrieve cached fleet metrics: " + e.getMessage());
            return null;
        }
    }

    public void invalidateVehicleCache(String vehicleId) {
        try {
            String key = "vehicle:" + vehicleId;
            redisTemplate.delete(key);
        } catch (Exception e) {
            System.err.println("Failed to invalidate cache for vehicle " + vehicleId + ": " + e.getMessage());
        }
    }
}