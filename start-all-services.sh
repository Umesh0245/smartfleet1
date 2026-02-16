#!/bin/bash

# SmartFleet2 Complete System Startup Script
echo "🚀 Starting SmartFleet2 Complete System..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a service is running on a port
check_port() {
    local port=$1
    local service_name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✅ $service_name is running on port $port${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not running on port $port${NC}"
        return 1
    fi
}

# Function to wait for service to start
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=0
    
    echo -e "${YELLOW}⏳ Waiting for $service_name to start on port $port...${NC}"
    while [ $attempt -lt $max_attempts ]; do
        if check_port $port "$service_name"; then
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    echo -e "${RED}❌ $service_name failed to start after $max_attempts attempts${NC}"
    return 1
}

echo -e "${BLUE}📋 Step 1: Starting Infrastructure Services${NC}"

# Start Redis
echo -e "${YELLOW}🗄️  Starting Redis...${NC}"
brew services start redis
sleep 2

# Start Zookeeper
echo -e "${YELLOW}🐘 Starting Zookeeper...${NC}"
brew services start zookeeper
sleep 3

# Start Kafka
echo -e "${YELLOW}📡 Starting Kafka...${NC}"
brew services start kafka
sleep 5

# Check infrastructure services
echo -e "${BLUE}📋 Step 2: Verifying Infrastructure Services${NC}"
redis-cli ping
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Redis is responding${NC}"
else
    echo -e "${RED}❌ Redis is not responding${NC}"
fi

# Create Kafka topics if they don't exist
echo -e "${YELLOW}📝 Creating Kafka topics...${NC}"
/opt/homebrew/bin/kafka-topics --create --topic scania-telemetry --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 --if-not-exists
/opt/homebrew/bin/kafka-topics --create --topic vehicle-telemetry --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 --if-not-exists

# List topics to verify
echo -e "${BLUE}📋 Available Kafka topics:${NC}"
/opt/homebrew/bin/kafka-topics --list --bootstrap-server localhost:9092

echo -e "${BLUE}📋 Step 3: Starting Backend Service${NC}"

# Kill any existing Java processes on port 8081
echo -e "${YELLOW}🧹 Cleaning up existing backend processes...${NC}"
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
sleep 2

# Start backend in background
echo -e "${YELLOW}🚀 Starting Spring Boot Backend...${NC}"
cd /Users/umeshreddy/smartfleet/backend
export PATH="/Users/umeshreddy/anaconda3/bin:$PATH"
nohup mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
if wait_for_service 8081 "Backend"; then
    echo -e "${GREEN}✅ Backend is ready!${NC}"
    
    # Test backend API
    echo -e "${YELLOW}🧪 Testing backend API...${NC}"
    sleep 2
    curl -s http://localhost:8081/actuator/health | jq . || echo "Backend health check completed"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo "Backend logs:"
    tail -20 backend.log
    exit 1
fi

echo -e "${BLUE}📋 Step 4: Starting Frontend Service${NC}"

# Kill any existing processes on port 5173
echo -e "${YELLOW}🧹 Cleaning up existing frontend processes...${NC}"
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 2

# Start frontend in background
echo -e "${YELLOW}🎨 Starting React Frontend...${NC}"
cd /Users/umeshreddy/smartfleet/frontend
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
if wait_for_service 5173 "Frontend"; then
    echo -e "${GREEN}✅ Frontend is ready!${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    echo "Frontend logs:"
    tail -20 frontend.log
fi

echo -e "${BLUE}📋 Step 5: Starting Telemetry Simulator${NC}"

# Start simulator in background
echo -e "${YELLOW}🚛 Starting Vehicle Telemetry Simulator...${NC}"
cd /Users/umeshreddy/smartfleet
nohup python3 smartfleet_simulator.py > simulator.log 2>&1 &
SIMULATOR_PID=$!
echo "Simulator PID: $SIMULATOR_PID"

echo -e "${GREEN}🎉 SmartFleet2 System Startup Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
echo "- Redis: $(redis-cli ping 2>/dev/null || echo 'Not responding')"
echo "- Zookeeper: $(brew services list | grep zookeeper | awk '{print $2}')"
echo "- Kafka: $(brew services list | grep kafka | awk '{print $2}')"
check_port 8081 "Backend API"
check_port 5173 "Frontend"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:8081"
echo "- Backend Health: http://localhost:8081/actuator/health"
echo "- Telemetry Endpoint: http://localhost:8081/api/telemetry"
echo ""
echo -e "${BLUE}📝 Log Files:${NC}"
echo "- Backend: /Users/umeshreddy/smartfleet/backend/backend.log"
echo "- Frontend: /Users/umeshreddy/smartfleet/frontend/frontend.log"
echo "- Simulator: /Users/umeshreddy/smartfleet/simulator.log"
echo ""
echo -e "${BLUE}🛑 To stop all services:${NC}"
echo "kill $BACKEND_PID $FRONTEND_PID $SIMULATOR_PID"
echo "brew services stop redis zookeeper kafka"
echo ""
echo -e "${GREEN}✨ Your SmartFleet2 system is now running!${NC}"