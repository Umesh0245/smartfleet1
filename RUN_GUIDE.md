# SmartFleet2 Complete Startup Guide

## Prerequisites
- Docker Desktop installed and running
- Java 17+ installed
- Node.js 18+ installed
- Python 3.9+ installed
- Maven installed

## Option 1: Docker Infrastructure + Native Applications (Recommended for Development)

### Step 1: Start Infrastructure Services with Docker

```bash
# Navigate to project root
cd /Users/umeshreddy/Downloads/smartfleet2

# Start all infrastructure services (PostgreSQL, Kafka, Redis, Grafana)
docker-compose -f docker-compose-services.yml up -d

# Wait 30 seconds for services to initialize
sleep 30

# Verify all services are running
docker ps
```

Expected output: You should see containers for:
- smartfleet-postgres
- smartfleet-kafka  
- smartfleet-zookeeper
- smartfleet-redis
- smartfleet-grafana
- smartfleet-kafka-ui

### Step 2: Create Kafka Topics

```bash
# Create vehicle telemetry topic
docker exec smartfleet-kafka kafka-topics --create \
  --topic vehicle-telemetry \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1

# Create fleet analytics topic
docker exec smartfleet-kafka kafka-topics --create \
  --topic fleet-analytics \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1

# Verify topics created
docker exec smartfleet-kafka kafka-topics --list --bootstrap-server localhost:9092
```

### Step 3: Verify Infrastructure Services

Open these URLs in your browser:
- **Kafka UI**: http://localhost:8080 (Kafka management)
- **Grafana**: http://localhost:3000 (admin/admin123)
- **PostgreSQL**: localhost:5432 (fleet_user/fleet_pass/fleetdb)
- **Redis**: localhost:6379

### Step 4: Start Backend Application

```bash
# Terminal 1: Backend
cd /Users/umeshreddy/Downloads/smartfleet2/backend

# Clean and build the project
mvn clean package -DskipTests

# Start the Spring Boot application
mvn spring-boot:run
```

**Expected output**: Backend should start on port 8080
```
Started SpringBackendApplication in X.XXX seconds
```

### Step 5: Start Frontend Application

```bash
# Terminal 2: Frontend (open new terminal)
cd /Users/umeshreddy/Downloads/smartfleet2/frontend

# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

**Expected output**: Frontend should start on port 5173
```
Local:   http://localhost:5173/
Network: use --host to expose
```

### Step 6: Start Telemetry Simulator

```bash
# Terminal 3: Simulator (open new terminal)
cd /Users/umeshreddy/Downloads/smartfleet2/simulator

# Start the telemetry simulator
python3 smartfleet_simulator.py
```

**Expected output**: Simulator should start sending data
```
Starting SmartFleet Telemetry Simulator...
Backend health check: OK
Sending telemetry data for 5 vehicles...
```

## Option 2: Full Docker Deployment (Production-like)

### Complete System Startup

```bash
# Navigate to project root
cd /Users/umeshreddy/Downloads/smartfleet2

# Start entire system
docker-compose up -d

# Check all services
docker-compose ps

# View logs
docker-compose logs -f backend
```

## Verification Steps

### 1. Check Service Health

```bash
# Check Docker services
docker ps

# Check backend health
curl http://localhost:8080/actuator/health

# Check frontend
curl http://localhost:5173

# Check Kafka topics
docker exec smartfleet-kafka kafka-topics --list --bootstrap-server localhost:9092

# Check Redis
docker exec smartfleet-redis redis-cli ping
```

### 2. Test Data Flow

```bash
# Check if simulator is sending data
curl http://localhost:8080/api/telemetry

# Check Kafka messages
docker exec smartfleet-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic vehicle-telemetry \
  --from-beginning \
  --max-messages 5
```

### 3. Access Web Interfaces

1. **Frontend Dashboard**: http://localhost:5173
2. **Backend API**: http://localhost:8080/api/telemetry
3. **Kafka UI**: http://localhost:8080 (if using Kafka UI)
4. **Grafana**: http://localhost:3000 (admin/admin123)

## Troubleshooting Commands

### Stop All Services

```bash
# Stop Docker services
docker-compose -f docker-compose-services.yml down

# Or stop everything
docker-compose down

# Stop native applications: Ctrl+C in their terminals
```

### Reset Everything

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Clean up Docker system
docker system prune -f

# Restart fresh
docker-compose -f docker-compose-services.yml up -d
```

### Check Logs

```bash
# Docker service logs
docker-compose logs kafka
docker-compose logs postgres
docker-compose logs redis

# Application logs - check the terminal windows where you started them
```

### Port Conflicts

If you get port conflicts, check what's using the ports:
```bash
# Check port usage
lsof -i :8080  # Backend
lsof -i :5173  # Frontend
lsof -i :9092  # Kafka
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :3000  # Grafana

# Kill processes if needed
kill -9 <PID>
```

## Expected System Architecture After Startup

```
┌─────────────────────────────────────────────────────────┐
│                 Docker Infrastructure                    │
├─────────────────────────────────────────────────────────┤
│ PostgreSQL (5432) │ Redis (6379) │ Grafana (3000)      │
│ Kafka (9092)      │ Zookeeper    │ Kafka-UI (8080)     │
└─────────────────────────────────────────────────────────┘
           ↑                    ↑                ↑
┌──────────────┐    ┌──────────────────┐    ┌─────────────┐
│   Backend    │    │    Frontend      │    │  Simulator  │
│ Spring Boot  │    │   React+Vite     │    │   Python    │
│  (Port 8080) │    │  (Port 5173)     │    │    HTTP     │
└──────────────┘    └──────────────────┘    └─────────────┘
```

## Quick Status Check Commands

```bash
# All-in-one status check
echo "=== Docker Services ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n=== Service Health ==="
curl -s http://localhost:8080/actuator/health | jq '.' 2>/dev/null || echo "Backend not ready"
curl -s http://localhost:5173 >/dev/null && echo "Frontend: OK" || echo "Frontend: Not ready"

echo -e "\n=== Database Connection ==="
docker exec smartfleet-postgres pg_isready -U fleet_user -d fleetdb

echo -e "\n=== Redis Connection ==="
docker exec smartfleet-redis redis-cli ping

echo -e "\n=== Kafka Topics ==="
docker exec smartfleet-kafka kafka-topics --list --bootstrap-server localhost:9092
```

Save this as a script and run it to check everything at once!