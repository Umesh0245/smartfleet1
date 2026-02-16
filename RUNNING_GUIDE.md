# SmartFleet System - Complete Setup & Running Guide

## 🚀 Quick Start (Recommended)

### Prerequisites
1. **PostgreSQL** - Make sure PostgreSQL is installed and running
2. **Node.js** - For the React frontend
3. **Java 17** - For the Spring Boot backend
4. **Python 3** - For the telemetry simulator

### Step 1: Start PostgreSQL
```bash
# macOS (with Homebrew)
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Or manually
pg_ctl -D /usr/local/var/postgres start
```

### Step 2: Run the SmartFleet System

#### Option A: Full Production Setup (Recommended)
```bash
cd /Users/umeshreddy/Downloads/smartfleet2
./start-services.sh
```

#### Option B: Development Mode (Simpler)
```bash
cd /Users/umeshreddy/Downloads/smartfleet2
./start-dev.sh
```

### Step 3: Access the Application
- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:8081

---

## 📋 Detailed Step-by-Step Instructions

### Method 1: Using Startup Scripts (Easiest)

1. **Open Terminal**
2. **Navigate to project directory:**
   ```bash
   cd /Users/umeshreddy/Downloads/smartfleet2
   ```

3. **Choose your startup method:**

   **For Full System (with all services):**
   ```bash
   ./start-services.sh
   ```
   This will start:
   - PostgreSQL database
   - Spring Boot backend (port 8081)
   - React frontend (port 5173)
   - Telemetry simulator
   - Redis (if available)
   - Kafka (if available)

   **For Development Mode (minimal setup):**
   ```bash
   ./start-dev.sh
   ```
   This will start only:
   - Spring Boot backend (port 8081)
   - React frontend (port 5173)

4. **Wait for services to start** (about 30-60 seconds)

5. **Open your browser** and go to: http://localhost:5173

6. **To stop all services:**
   ```bash
   ./stop-services.sh
   ```

### Method 2: Manual Startup (For Learning/Debugging)

#### Step 1: Start PostgreSQL
```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it
brew services start postgresql  # macOS
# OR
sudo systemctl start postgresql  # Linux
```

#### Step 2: Start Backend Service
```bash
# Navigate to backend
cd /Users/umeshreddy/Downloads/smartfleet2/backend

# Set Maven path (if needed)
export PATH=/tmp/apache-maven-3.9.4/bin:$PATH

# Start Spring Boot application
mvn spring-boot:run
```
**Wait for message**: "Started SpringBackendApplication"
Backend will be available at: http://localhost:8081

#### Step 3: Start Frontend Service (New Terminal)
```bash
# Open new terminal
cd /Users/umeshreddy/Downloads/smartfleet2/frontend

# Install dependencies (first time only)
npm install

# Start React development server
npm run dev
```
Frontend will be available at: http://localhost:5173

#### Step 4: Start Telemetry Simulator (Optional - New Terminal)
```bash
# Open new terminal
cd /Users/umeshreddy/Downloads/smartfleet2/simulator

# Install dependencies (first time only)
pip3 install -r requirements.txt

# Start simulator
python3 simulator.py
```

---

## 🎯 What You Should See

### 1. First Time Setup
- The system will automatically create the database tables
- User authentication system will be ready

### 2. Application Flow
1. **Splash Screen** (3 seconds) - SmartFleet logo animation
2. **Authentication Page**:
   - **Sign Up**: Create a new account with name, email, company, password
   - **Login**: Use your created credentials
3. **Dashboard**: Real-time fleet telemetry data visualization

### 3. Data Visualization Location
After successful login, you'll see the **Fleet Dashboard** with:
- **Real-time vehicle data** (speed, fuel, location, engine status)
- **Live telemetry updates** every few seconds
- **Fleet analytics** and monitoring charts
- **Vehicle status indicators**

---

## 🔧 Service Ports & Endpoints

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Frontend | 5173 | http://localhost:5173 | React Dashboard |
| Backend API | 8081 | http://localhost:8081 | Spring Boot API |
| PostgreSQL | 5432 | localhost:5432 | Database |
| Redis | 6379 | localhost:6379 | Caching (optional) |
| Kafka | 9092 | localhost:9092 | Messaging (optional) |

### Key API Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/telemetry/latest` - Get latest telemetry data
- `GET /api/fleet/analytics` - Get fleet analytics

---

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 1. "PostgreSQL not running"
```bash
# Start PostgreSQL
brew services start postgresql
# OR
sudo systemctl start postgresql
```

#### 2. "Port 8081 already in use"
```bash
# Kill existing Java processes
pkill -f "spring-boot:run"
pkill -f "java"
```

#### 3. "Port 5173 already in use"
```bash
# Kill existing Node processes
pkill -f "vite"
pkill -f "node"
```

#### 4. "Maven not found"
The startup script automatically sets up Maven. If issues persist:
```bash
export PATH=/tmp/apache-maven-3.9.4/bin:$PATH
```

#### 5. Frontend shows "Failed to fetch"
- Ensure backend is running on port 8081
- Check CORS configuration
- Verify API endpoints

#### 6. Authentication not working
- Check database connection
- Verify user table is created
- Check backend logs for errors

### Log Files (when using scripts)
- Backend: `/tmp/backend.log`
- Frontend: `/tmp/frontend.log`
- Simulator: `/tmp/simulator.log`

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Spring Boot    │    │   PostgreSQL    │
│   (Port 5173)   │◄──►│   Backend       │◄──►│   Database      │
│                 │    │   (Port 8081)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲
         │                       │
         │              ┌─────────────────┐
         │              │   Telemetry     │
         └──────────────┤   Simulator     │
                        │   (Python)      │
                        └─────────────────┘
```

---

## 🎉 Success Indicators

✅ **All services started successfully** when you see:
- Backend: "Started SpringBackendApplication in X seconds"
- Frontend: "Local: http://localhost:5173/"
- Database: Tables created automatically
- Authentication: Sign up and login working
- Dashboard: Real-time data updates

✅ **You should be able to**:
1. Create a new user account (signup)
2. Login with those credentials
3. See the fleet dashboard with real-time data
4. View vehicle telemetry updates every few seconds

---

## 📞 Need Help?

If you encounter any issues:
1. Check the log files mentioned above
2. Ensure all prerequisites are installed
3. Verify all ports are free before starting
4. Try the development mode first (`./start-dev.sh`)

The system is now properly configured with **real database authentication** - your signup credentials are stored in PostgreSQL and login verification works against the stored data!