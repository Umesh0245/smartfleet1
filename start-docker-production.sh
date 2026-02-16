#!/bin/bash

# SmartFleet2 Production Startup Script (Docker)
echo "🚀 Starting SmartFleet2 in Production Mode (Docker)..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed or not in PATH.${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file.${NC}"
    else
        echo -e "${RED}❌ .env.example not found. Cannot configure environment.${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}📋 Step 1: Building and Starting Docker Containers${NC}"
echo -e "${YELLOW}☕ This may take a while as it builds the backend and frontend...${NC}"

# Run docker-compose
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker containers started successfully!${NC}"
else
    echo -e "${RED}❌ Failed to start Docker containers.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Step 2: Verifying Services${NC}"
echo -e "${YELLOW}⏳ Waiting for services to initialize...${NC}"

# Simple wait loop (could be improved with health checks via docker inspect)
sleep 10

echo ""
echo -e "${GREEN}🎉 SmartFleet2 Production System is Running!${NC}"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo -e "- Frontend: http://localhost:3000"
echo -e "- Backend API: http://localhost:8080"
echo -e "- ML Service: http://localhost:8001"
echo ""
echo -e "${BLUE}📝 Management:${NC}"
echo -e "To view logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "To stop: ${YELLOW}docker-compose down${NC}"
