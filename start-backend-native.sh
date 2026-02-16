#!/bin/bash

# Native Backend Startup Script
cd /Users/umeshreddy/Downloads/smartfleet2/backend

echo "🔧 Starting SmartFleet2 Backend (Native Mode)..."
echo "================================================"

# Check if PostgreSQL is running
echo "⏳ Checking PostgreSQL..."
if ! ps aux | grep -v grep | grep postgres > /dev/null; then
    echo "❌ PostgreSQL not running. Please start PostgreSQL first."
    echo "   You can start it with Postgres.app or:"
    echo "   eval \"\$(/Users/umeshreddy/anaconda3/bin/conda shell.zsh hook)\" && conda activate base && postgres -D /var/postgres"
    exit 1
fi
echo "✅ PostgreSQL is running!"

# Check if Redis is running
echo "⏳ Checking Redis..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis not running. Starting Redis..."
    eval "$(/opt/homebrew/bin/brew shellenv)" && brew services start redis
    sleep 2
fi
echo "✅ Redis is running!"

# Check if Kafka is running
echo "⏳ Checking Kafka..."
if ! /opt/homebrew/bin/kafka-topics --list --bootstrap-server localhost:9092 > /dev/null 2>&1; then
    echo "❌ Kafka not running. Please start Kafka services first:"
    echo "   eval \"\$(/opt/homebrew/bin/brew shellenv)\" && brew services start zookeeper && brew services start kafka"
    exit 1
fi
echo "✅ Kafka is running!"

# Clean and build
echo "🏗️  Building backend..."
mvn clean package -DskipTests

# Start the application
echo "🚀 Starting Spring Boot application..."
echo "   Backend will be available at: http://localhost:8080"
echo "   API endpoint: http://localhost:8080/api/telemetry"
echo "   Health check: http://localhost:8080/actuator/health"
echo ""
echo "✅ All services ready! Starting backend..."
echo ""

mvn spring-boot:run