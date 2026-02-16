#!/bin/bash

# Simple Kafka setup script for macOS
echo "Setting up Kafka for SmartFleet2..."

# Create kafka directory
mkdir -p /Users/umeshreddy/kafka

# Download Kafka using a working mirror
echo "Downloading Kafka..."
cd /Users/umeshreddy/kafka

# Try multiple mirrors
curl -L -o kafka.tgz "https://archive.apache.org/dist/kafka/2.13-3.5.0/kafka_2.13-3.5.0.tgz" || 
curl -L -o kafka.tgz "https://downloads.apache.org/kafka/2.13-3.5.0/kafka_2.13-3.5.0.tgz" ||
curl -L -o kafka.tgz "https://dlcdn.apache.org/kafka/2.13-3.5.0/kafka_2.13-3.5.0.tgz"

# Check if download was successful
if [ -f "kafka.tgz" ] && [ -s "kafka.tgz" ]; then
    echo "Download successful, extracting..."
    tar -xzf kafka.tgz
    mv kafka_2.13-3.5.0/* .
    rmdir kafka_2.13-3.5.0
    rm kafka.tgz
    echo "Kafka setup complete!"
    echo "To start Kafka:"
    echo "1. Start Zookeeper: /Users/umeshreddy/kafka/bin/zookeeper-server-start.sh /Users/umeshreddy/kafka/config/zookeeper.properties"
    echo "2. Start Kafka: /Users/umeshreddy/kafka/bin/kafka-server-start.sh /Users/umeshreddy/kafka/config/server.properties"
else
    echo "Download failed. Let's use a simpler approach with embedded Kafka."
fi