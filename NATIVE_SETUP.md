# SmartFleet2 Native Setup Guide (Without Docker)

Since Docker is having issues, let's run everything natively on your Mac.

## Prerequisites Check
```bash
# Check if these are installed
java --version        # Should be 17+
mvn --version         # Maven
node --version        # Node.js 18+
npm --version         # npm
python3 --version     # Python 3.9+
```

## Step 1: Start PostgreSQL (Native)
```bash
# Start PostgreSQL service
eval "$(/Users/umeshreddy/anaconda3/bin/conda shell.zsh hook)"
conda activate base
postgres -D /Users/umeshreddy/anaconda3/var/postgres &

# Or if already running, check:
ps aux | grep postgres
```

## Step 2: Install and Start Redis (Native)
```bash
# Install Redis with Homebrew
eval "$(/opt/homebrew/bin/brew shellenv)"
brew install redis

# Start Redis
brew services start redis

# Or run in foreground:
redis-server &
```

## Step 3: Install and Start Kafka (Native)
```bash
# Install Kafka with Homebrew (if not already done)
eval "$(/opt/homebrew/bin/brew shellenv)"
brew install kafka

# Start Zookeeper first
brew services start zookeeper

# Start Kafka
brew services start kafka

# Create topics
sleep 10
/opt/homebrew/bin/kafka-topics --create --topic vehicle-telemetry --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
/opt/homebrew/bin/kafka-topics --create --topic fleet-analytics --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
```

## Step 4: Start Backend
```bash
cd /Users/umeshreddy/Downloads/smartfleet2/backend
mvn clean package -DskipTests
mvn spring-boot:run
```

## Step 5: Start Frontend
```bash
cd /Users/umeshreddy/Downloads/smartfleet2/frontend
npm install
npm run dev
```

## Step 6: Start Simulator
```bash
cd /Users/umeshreddy/Downloads/smartfleet2/simulator
python3 smartfleet_simulator.py
```

## Quick Service Status Check
```bash
# Check PostgreSQL
psql -U fleet_user -d fleetdb -h localhost -c "SELECT 1;"

# Check Redis
redis-cli ping

# Check Kafka
/opt/homebrew/bin/kafka-topics --list --bootstrap-server localhost:9092

# Check if ports are open
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :9092  # Kafka
lsof -i :8080  # Backend
lsof -i :5173  # Frontend
```