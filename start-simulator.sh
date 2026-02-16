#!/bin/bash

# Simulator Startup Script
cd /Users/umeshreddy/Downloads/smartfleet2/simulator

echo "🚗 Starting SmartFleet2 Telemetry Simulator..."
echo "============================================="

# Check if backend is available
echo "⏳ Checking if backend is available..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Backend not available after $max_attempts attempts"
        echo "   Please start the backend first: ./start-backend.sh"
        exit 1
    fi
    echo "   Attempt $attempt/$max_attempts - waiting for backend..."
    sleep 2
    attempt=$((attempt + 1))
done

# Start the simulator
echo "🚀 Starting telemetry data generation..."
echo "   Generating data for 5 vehicles"
echo "   Sending to: http://localhost:8080/api/telemetry"
echo ""

python3 smartfleet_simulator.py