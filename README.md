# 🚢 Smart Fleet System - Cross-Platform Fullstack

A comprehensive fleet monitoring system with real-time telemetry, advanced analytics, and futuristic UI design.

## 📁 **Project Structure**
```
smartfleet2/
├── backend/          # Spring Boot API (Java 17)
├── frontend/         # React + Vite + TypeScript
├── simulator/        # Python telemetry generator
├── grafana/          # Monitoring dashboards
├── postgres/         # Database initialization
└── docker-compose-services.yml  # Infrastructure services
```

---

## 🖥️ **SUPPORTED PLATFORMS**

✅ **macOS** (Intel & Apple Silicon)  
✅ **Windows 10/11** (x64)  
✅ **Linux** (Ubuntu, Debian, CentOS)

---

## ⚡ **QUICK START (Any Platform)**

### **Option 1: Automated Setup (Recommended)**
```bash
# Run the cross-platform setup script
node setup-cross-platform.js

# Follow the prompts and instructions
```

### **Option 2: Platform-Specific Quick Start**

#### **🍎 macOS Users:**
```bash
# 1. Install prerequisites (if not already installed)
# - Java 17: https://adoptium.net/temurin/releases/?version=17
# - Node.js: https://nodejs.org/en/download/
# - Docker Desktop: https://desktop.docker.com/mac/main/amd64/Docker.dmg
# - Python 3: https://www.python.org/downloads/mac-osx/

# 2. Start the system
./start-all-services-mac.sh

# 3. Open http://localhost:5173
```

#### **🪟 Windows Users:**
```batch
REM 1. Install prerequisites (if not already installed)
REM - Java 17: https://adoptium.net/temurin/releases/?version=17
REM - Node.js: https://nodejs.org/en/download/
REM - Docker Desktop: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
REM - Python 3: https://www.python.org/downloads/windows/

REM 2. Run setup (as Administrator)
setup-windows.bat

REM 3. Start all services
start-all-services-windows.bat

REM 4. Open http://localhost:5173
```

---

## 📋 **DETAILED SETUP GUIDES**

### **For Windows Users:**
📖 **[Complete Windows Setup Guide](WINDOWS_SETUP.md)** - Step-by-step instructions

### **For macOS Users:**
📖 **[Complete macOS Setup Guide](.vscode/README.md)** - Detailed terminal commands

---

## 🔧 **SYSTEM ARCHITECTURE**

### **Services & Ports:**
| Service | Port | Description |
|---------|------|-------------|
| Frontend (React) | 5173 | User interface & dashboard |
| Backend (Spring Boot) | 8081 | REST API & WebSocket |
| PostgreSQL | 5432/5434 | Primary database |
| Kafka | 9092 | Message streaming |
| Kafka UI | 8080 | Kafka management |
| Redis | 6379 | Caching & sessions |
| Grafana | 3000 | Monitoring & metrics |
| Zookeeper | 2181 | Kafka coordination |

### **Technology Stack:**
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Spring Boot 3.2, Java 17, JPA, WebSocket
- **Database:** PostgreSQL 15, Redis 7
- **Messaging:** Apache Kafka 3.x
- **Monitoring:** Grafana, Spring Actuator
- **Containerization:** Docker, Docker Compose
- **Simulation:** Python 3.8+, HTTP requests

---

## 🚀 **RUNNING THE SYSTEM**

### **Development Mode (All Platforms):**
```bash
# Terminal 1: Infrastructure
docker compose -f docker-compose-services.yml up -d

# Terminal 2: Backend
cd backend
./mvnw spring-boot:run  # macOS/Linux
# OR
mvnw.cmd spring-boot:run  # Windows

# Terminal 3: Frontend
cd frontend
npm run dev

# Terminal 4: Simulator
cd simulator
python3 http_simulator.py  # macOS/Linux
# OR
python http_simulator.py  # Windows
```

### **Production Mode:**
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && ./mvnw clean package

# Start with Docker
docker compose up --build
```

---

## 🔍 **VERIFICATION & TESTING**

### **Health Checks:**
```bash
# Backend API
curl http://localhost:8081/api/health

# Frontend
curl http://localhost:5173

# Database
psql -h localhost -p 5432 -d fleetdb -U postgres -c "SELECT 1;"
```

### **Service URLs:**
- **🎯 Main Application:** http://localhost:5173
- **📊 Kafka UI:** http://localhost:8080
- **📈 Grafana:** http://localhost:3000
- **🔧 Backend API:** http://localhost:8081/api

---

## 🛑 **STOPPING SERVICES**

### **Automated Stop:**
```bash
# macOS/Linux
./stop-all-services-mac.sh

# Windows  
stop-all-services-windows.bat
```

### **Manual Stop:**
```bash
# Stop Docker services
docker compose -f docker-compose-services.yml down

# Stop other services: Ctrl+C in respective terminals
```

---

## 🐛 **TROUBLESHOOTING**

### **Common Issues:**

#### **Port Conflicts:**
```bash
# macOS/Linux
lsof -i :[PORT] | grep LISTEN
kill -9 [PID]

# Windows
netstat -ano | findstr :[PORT]
taskkill /PID [PID] /F
```

#### **Docker Issues:**
```bash
# Clean Docker state
docker compose down
docker system prune -f
docker volume prune -f

# Restart Docker Desktop
```

#### **Database Connection:**
```bash
# Check PostgreSQL status
docker ps | grep postgres

# Manual connection test
psql -h localhost -p 5432 -U postgres -d fleetdb
```

---

## 📚 **ADDITIONAL DOCUMENTATION**

- **🔧 Backend API:** `backend/README.md`
- **🎨 Frontend Guide:** `frontend/README.md`
- **🐍 Simulator:** `simulator/README.md`
- **📊 Grafana Setup:** `grafana/README.md`
- **🪟 Windows Guide:** `WINDOWS_SETUP.md`
- **🍎 macOS Guide:** `.vscode/README.md`

---

## 🤝 **DEVELOPMENT**

### **Prerequisites:**
- Java 17+ (OpenJDK recommended)
- Node.js 18+ with npm
- Docker Desktop
- Python 3.8+ with pip
- Git

### **IDE Recommendations:**
- **Backend:** IntelliJ IDEA, Eclipse, VS Code
- **Frontend:** VS Code, WebStorm
- **Database:** DBeaver, pgAdmin

---

## 📄 **LICENSE**

MIT License - See `LICENSE` file for details.

---

## 🆘 **SUPPORT**

If you encounter issues:
1. Check the platform-specific setup guides
2. Verify all prerequisites are installed
3. Ensure Docker Desktop is running
4. Check firewall/antivirus settings
5. Review logs in the `logs/` directory

**Happy Fleet Monitoring! 🚢✨**
