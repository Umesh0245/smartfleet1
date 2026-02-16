#!/bin/bash

# SmartFleet Services Stop Script
echo "🛑 Stopping SmartFleet Services..."

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   SmartFleet System Shutdown${NC}"
echo -e "${BLUE}========================================${NC}"

# Stop Frontend
echo -e "${YELLOW}🛑 Stopping Frontend...${NC}"
pkill -f "vite" 2>/dev/null && echo -e "${GREEN}✅ Frontend stopped${NC}" || echo -e "${YELLOW}⚠️  Frontend was not running${NC}"

# Stop Backend
echo -e "${YELLOW}🛑 Stopping Backend...${NC}"
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "spring-backend" 2>/dev/null || true
sleep 2
echo -e "${GREEN}✅ Backend stopped${NC}"

# Stop Simulator
echo -e "${YELLOW}🛑 Stopping Simulator...${NC}"
pkill -f "simulator.py" 2>/dev/null && echo -e "${GREEN}✅ Simulator stopped${NC}" || echo -e "${YELLOW}⚠️  Simulator was not running${NC}"

# Stop Kafka
echo -e "${YELLOW}🛑 Stopping Kafka...${NC}"
pkill -f "kafka" 2>/dev/null && echo -e "${GREEN}✅ Kafka stopped${NC}" || echo -e "${YELLOW}⚠️  Kafka was not running${NC}"

# Stop Zookeeper
echo -e "${YELLOW}🛑 Stopping Zookeeper...${NC}"
pkill -f "zookeeper" 2>/dev/null && echo -e "${GREEN}✅ Zookeeper stopped${NC}" || echo -e "${YELLOW}⚠️  Zookeeper was not running${NC}"

# Stop Redis (if started by script)
echo -e "${YELLOW}🛑 Stopping Redis...${NC}"
redis-cli shutdown 2>/dev/null && echo -e "${GREEN}✅ Redis stopped${NC}" || echo -e "${YELLOW}⚠️  Redis was not running or managed externally${NC}"

# Clean up log files
echo -e "${YELLOW}🧹 Cleaning up log files...${NC}"
rm -f /tmp/backend.log /tmp/frontend.log /tmp/simulator.log /tmp/kafka.log /tmp/zookeeper.log 2>/dev/null
echo -e "${GREEN}✅ Log files cleaned${NC}"

echo ""
echo -e "${GREEN}🎉 All SmartFleet services have been stopped successfully!${NC}"
echo -e "${BLUE}========================================${NC}"