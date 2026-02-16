# SmartFleet2 Infrastructure Setup

## Phase 1: Docker Infrastructure

### 1. Start Infrastructure Services
```bash
# Start only infrastructure services
docker-compose -f docker-compose-services.yml up -d

# Verify services are running
docker ps

# Check logs if needed
docker-compose -f docker-compose-services.yml logs kafka
```

### 2. Create Kafka Topics
```bash
# Wait for Kafka to be ready, then create topics
docker exec smartfleet-kafka kafka-topics --create \
  --topic vehicle-telemetry \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1

docker exec smartfleet-kafka kafka-topics --create \
  --topic fleet-analytics \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1
```

### 3. Verify Infrastructure
- Kafka UI: http://localhost:8080
- Grafana: http://localhost:3000 (admin/admin123)
- Redis: localhost:6379
- PostgreSQL: localhost:5432

## Phase 2: Application Services

### 1. Update Backend Configuration
Update application.yml to use Docker service names:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fleetdb
  data:
    redis:
      host: localhost
      port: 6379
  kafka:
    bootstrap-servers: localhost:9092
```

### 2. Build and Run Backend
```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Run Telemetry Simulator
```bash
cd simulator
python3 smartfleet_simulator.py
```

## Phase 3: Full Docker Deployment

Once everything works locally, containerize all services:
```bash
docker-compose up -d
```