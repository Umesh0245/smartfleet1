#!/bin/bash

# Stop All SmartFleet Services
echo "🛑 Stopping All SmartFleet Services..."

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   SmartFleet Complete System Shutdown${NC}"
echo -e "${BLUE}========================================${NC}"

# Stop Frontend
echo -e "${YELLOW}🛑 Stopping Frontend...${NC}"
pkill -f "vite" 2>/dev/null && echo -e "${GREEN}✅ Frontend stopped${NC}" || echo -e "${YELLOW}⚠️  Frontend was not running${NC}"

# Stop Backend
echo -e "${YELLOW}🛑 Stopping Backend...${NC}"
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "spring-backend" 2>/dev/null || true
pkill -f "maven" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✅ Backend stopped${NC}"

# Stop Simulator
echo -e "${YELLOW}🛑 Stopping Simulator...${NC}"
pkill -f "simulator.py" 2>/dev/null && echo -e "${GREEN}✅ Simulator stopped${NC}" || echo -e "${YELLOW}⚠️  Simulator was not running${NC}"

# Stop Docker Services
echo -e "${YELLOW}🛑 Stopping Docker services...${NC}"
if command -v docker >/dev/null 2>&1; then
    if docker ps >/dev/null 2>&1; then
        docker-compose -f docker-compose-services.yml down 2>/dev/null && echo -e "${GREEN}✅ Docker services stopped${NC}" || echo -e "${YELLOW}⚠️  No Docker services to stop${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker not running${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker not found${NC}"
fi

# Clean up log files
echo -e "${YELLOW}🧹 Cleaning up logs...${NC}"
mkdir -p logs
rm -f logs/*.log 2>/dev/null
echo -e "${GREEN}✅ Logs cleaned${NC}"

echo ""
echo -e "${GREEN}🎉 All SmartFleet services have been stopped!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}💡 To start services again: ./start-complete.sh${NC}"