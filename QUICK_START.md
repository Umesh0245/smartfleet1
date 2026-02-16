# 🚀 SmartFleet2 Quick Start Guide

## Quick Commands (Use these!)

### Option 1: Easy Startup (4 Terminal Windows)

```bash
# Terminal 1: Infrastructure (Docker)
cd /Users/umeshreddy/Downloads/smartfleet2
./start-infrastructure.sh

# Terminal 2: Backend (wait for infrastructure to be ready)
cd /Users/umeshreddy/Downloads/smartfleet2
./start-backend.sh

# Terminal 3: Frontend 
cd /Users/umeshreddy/Downloads/smartfleet2
./start-frontend.sh

# Terminal 4: Simulator (wait for backend to be ready)
cd /Users/umeshreddy/Downloads/smartfleet2
./start-simulator.sh
```

### Option 2: Manual Commands

#### 1. Start Infrastructure (Docker)
```bash
cd /Users/umeshreddy/Downloads/smartfleet2
docker-compose -f docker-compose-services.yml up -d

# Wait 30 seconds, then create Kafka topics
docker exec smartfleet-kafka kafka-topics --create --topic vehicle-telemetry --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
docker exec smartfleet-kafka kafka-topics --create --topic fleet-analytics --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
```

#### 2. Start Backend
```bash
cd /Users/umeshreddy/Downloads/smartfleet2/backend
mvn clean package -DskipTests
mvn spring-boot:run
```

#### 3. Start Frontend
```bash
cd /Users/umeshreddy/Downloads/smartfleet2/frontend
npm install  # (only first time)
npm run dev
```

#### 4. Start Simulator
```bash
cd /Users/umeshreddy/Downloads/smartfleet2/simulator
python3 smartfleet_simulator.py
```

## 🌐 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend Dashboard** | http://localhost:5173 | - |
| **Backend API** | http://localhost:8080/api/telemetry | - |
| **Grafana** | http://localhost:3000 | admin/admin123 |
| **Kafka UI** | http://localhost:8080 | - |
| **Backend Health** | http://localhost:8080/actuator/health | - |

## 🔧 Infrastructure Services (Docker)

| Service | Port | Status Check |
|---------|------|--------------|
| PostgreSQL | 5432 | `docker exec smartfleet-postgres pg_isready -U fleet_user -d fleetdb` |
| Redis | 6379 | `docker exec smartfleet-redis redis-cli ping` |
| Kafka | 9092 | `docker exec smartfleet-kafka kafka-topics --list --bootstrap-server localhost:9092` |
| Zookeeper | 2181 | Managed by Kafka |
| Grafana | 3000 | http://localhost:3000 |

## 🚨 Troubleshooting

### Check if Everything is Running
```bash
# Check Docker services
docker ps

# Check backend
curl http://localhost:8080/actuator/health

# Check frontend
curl -I http://localhost:5173

# Check if simulator is sending data
curl http://localhost:8080/api/telemetry
```

### Stop Everything
```bash
# Stop applications: Ctrl+C in their terminal windows

# Stop Docker infrastructure
cd /Users/umeshreddy/Downloads/smartfleet2
docker-compose -f docker-compose-services.yml down
```

### Reset Everything (if things go wrong)
```bash
cd /Users/umeshreddy/Downloads/smartfleet2
docker-compose -f docker-compose-services.yml down -v
docker system prune -f
./start-infrastructure.sh
```

### Port Conflicts
```bash
# Check what's using ports
lsof -i :5173  # Frontend
lsof -i :8080  # Backend  
lsof -i :9092  # Kafka
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :3000  # Grafana

# Kill processes if needed
kill -9 <PID>
```

## 📊 Data Flow Verification

### 1. Check Simulator is Sending Data
```bash
# View recent telemetry data
curl http://localhost:8080/api/telemetry | jq '.'
```

### 2. Check Kafka Messages
```bash
# View messages in Kafka topic
docker exec smartfleet-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic vehicle-telemetry \
  --from-beginning \
  --max-messages 5
```

### 3. Check Database
```bash
# Connect to database
docker exec -it smartfleet-postgres psql -U fleet_user -d fleetdb

# In postgres shell:
# SELECT COUNT(*) FROM vehicle_telemetry_entity;
# SELECT * FROM vehicle_telemetry_entity LIMIT 5;
# \q
```

## 🎯 Success Criteria

When everything is working, you should see:

✅ Docker containers running (5 containers)  
✅ Backend starts without errors  
✅ Frontend loads at http://localhost:5173  
✅ Simulator sends data every 5 seconds  
✅ Data appears in API: http://localhost:8080/api/telemetry  
✅ Grafana accessible at http://localhost:3000  

## 🔄 Typical Startup Sequence

1. **Infrastructure First** (30 seconds to initialize)
2. **Backend Second** (30 seconds to build and start)
3. **Frontend Third** (10 seconds to start)
4. **Simulator Last** (starts immediately)

**Total startup time: ~1-2 minutes**

## 💡 Pro Tips

- Always start infrastructure first and wait for it to be ready
- Use separate terminal windows for each component
- Check the status URLs to verify everything is working
- Use Ctrl+C to stop individual components
- Use `docker-compose down` to stop all infrastructure

---
🎉 **Your SmartFleet2 system is now ready for development!**