#!/bin/bash

# SmartFleet Services Startup Script
echo "🚀 Starting SmartFleet Services..."

# Set Maven path
export PATH=/tmp/apache-maven-3.9.4/bin:$PATH

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Waiting for $service_name to start on port $port...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z localhost $port 2>/dev/null; then
            echo -e "${GREEN}✅ $service_name is running on port $port${NC}"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $service_name failed to start on port $port${NC}"
    return 1
}

# Function to start PostgreSQL
start_postgresql() {
    echo -e "${BLUE}🐘 Starting PostgreSQL...${NC}"
    
    # Check if PostgreSQL is already running on port 5434
    if nc -z localhost 5434 2>/dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is already running on port 5434${NC}"
    else
        # Try to start PostgreSQL
        if command -v brew >/dev/null 2>&1; then
            brew services start postgresql@14 || brew services start postgresql
        else
            sudo systemctl start postgresql || sudo service postgresql start
        fi
        
        # Wait for PostgreSQL to start
        sleep 5
        
        if nc -z localhost 5434 2>/dev/null; then
            echo -e "${GREEN}✅ PostgreSQL started successfully on port 5434${NC}"
        else
            echo -e "${RED}❌ Failed to start PostgreSQL on port 5434${NC}"
            echo "Please start Postgres.app on port 5434 and run this script again"
            exit 1
        fi
    fi
}

# Function to setup database
setup_database() {
    echo -e "${BLUE}🗄️  Setting up database...${NC}"
    
    # Set PostgreSQL path for Postgres.app
    export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
    
    # Create database if it doesn't exist
    psql -h localhost -p 5434 -U umeshreddy -tc "SELECT 1 FROM pg_database WHERE datname = 'fleetdb'" | grep -q 1 || {
        echo "Creating fleetdb database..."
        createdb -h localhost -p 5434 -U umeshreddy fleetdb
    }
    
    echo -e "${GREEN}✅ Database setup complete${NC}"
}

# Function to start Kafka and Zookeeper
start_kafka() {
    echo -e "${BLUE}📨 Starting Kafka and Zookeeper...${NC}"
    
    # Check if Kafka is already running
    if nc -z localhost 9092 2>/dev/null; then
        echo -e "${GREEN}✅ Kafka is already running${NC}"
        return 0
    fi
    
    # Start Zookeeper in background
    if command -v kafka-server-start >/dev/null 2>&1; then
        echo "Starting Zookeeper..."
        zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties > /tmp/zookeeper.log 2>&1 &
        sleep 10
        
        echo "Starting Kafka..."
        kafka-server-start /usr/local/etc/kafka/server.properties > /tmp/kafka.log 2>&1 &
        sleep 10
        
        if check_service "Kafka" 9092; then
            return 0
        fi
    fi
    
    echo -e "${YELLOW}⚠️  Kafka not found or failed to start. Services will run without Kafka.${NC}"
}

# Function to start Redis
start_redis() {
    echo -e "${BLUE}🔴 Starting Redis...${NC}"
    
    # Check if Redis is already running
    if nc -z localhost 6379 2>/dev/null; then
        echo -e "${GREEN}✅ Redis is already running${NC}"
        return 0
    fi
    
    # Try to start Redis
    if command -v redis-server >/dev/null 2>&1; then
        redis-server --daemonize yes
        sleep 3
        
        if check_service "Redis" 6379; then
            return 0
        fi
    fi
    
    echo -e "${YELLOW}⚠️  Redis not found or failed to start. Services will run without Redis.${NC}"
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}🌐 Starting Backend Service...${NC}"
    
    cd /Users/umeshreddy/Downloads/smartfleet2/backend
    
    # Kill any existing backend processes
    pkill -f "spring-boot:run" 2>/dev/null || true
    pkill -f "spring-backend" 2>/dev/null || true
    
    # Start the backend
    echo "Compiling and starting Spring Boot backend..."
    mvn spring-boot:run > /tmp/backend.log 2>&1 &
    
    # Wait for backend to start
    if check_service "Backend API" 8081; then
        echo -e "${GREEN}✅ Backend is running at http://localhost:8081${NC}"
        return 0
    else
        echo -e "${RED}❌ Backend failed to start. Check logs at /tmp/backend.log${NC}"
        return 1
    fi
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}⚛️  Starting Frontend Service...${NC}"
    
    cd /Users/umeshreddy/Downloads/smartfleet2/frontend
    
    # Kill any existing frontend processes
    pkill -f "vite" 2>/dev/null || true
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    
    # Start the frontend
    echo "Starting React frontend..."
    npm run dev > /tmp/frontend.log 2>&1 &
    
    # Wait for frontend to start
    if check_service "Frontend" 5173; then
        echo -e "${GREEN}✅ Frontend is running at http://localhost:5173${NC}"
        return 0
    else
        echo -e "${RED}❌ Frontend failed to start. Check logs at /tmp/frontend.log${NC}"
        return 1
    fi
}

# Function to start simulator
start_simulator() {
    echo -e "${BLUE}🚗 Starting Telemetry Simulator...${NC}"
    
    cd /Users/umeshreddy/Downloads/smartfleet2/simulator
    
    # Kill any existing simulator processes
    pkill -f "simulator.py" 2>/dev/null || true
    
    # Install dependencies if needed
    if [ ! -f "/tmp/simulator_deps_installed" ]; then
        echo "Installing simulator dependencies..."
        pip3 install -r requirements.txt
        touch /tmp/simulator_deps_installed
    fi
    
    # Start simulator
    echo "Starting telemetry simulator..."
    python3 simulator.py > /tmp/simulator.log 2>&1 &
    
    sleep 5
    echo -e "${GREEN}✅ Telemetry Simulator started${NC}"
}

# Main execution
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   SmartFleet System Startup${NC}"
echo -e "${BLUE}========================================${NC}"

# Start all services
start_postgresql
setup_database
start_redis
start_kafka
start_backend

if [ $? -eq 0 ]; then
    start_frontend
    start_simulator
    
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}🎉 SmartFleet System Started Successfully!${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo -e "${GREEN}📊 Access your SmartFleet Dashboard:${NC}"
    echo -e "   Frontend: ${YELLOW}http://localhost:5173${NC}"
    echo -e "   Backend API: ${YELLOW}http://localhost:8081${NC}"
    echo ""
    echo -e "${GREEN}📋 Service Status:${NC}"
    echo -e "   PostgreSQL: Running (Database)"
    echo -e "   Backend: Running on port 8081"
    echo -e "   Frontend: Running on port 5173"
    echo -e "   Simulator: Running (Generating telemetry data)"
    echo ""
    echo -e "${GREEN}🔧 Log Files:${NC}"
    echo -e "   Backend: /tmp/backend.log"
    echo -e "   Frontend: /tmp/frontend.log"
    echo -e "   Simulator: /tmp/simulator.log"
    echo ""
    echo -e "${YELLOW}💡 To stop all services, run: ./stop-services.sh${NC}"
    echo ""
else
    echo -e "${RED}❌ Failed to start backend service${NC}"
    exit 1
fi