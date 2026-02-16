FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install additional required packages for the telemetry simulator
RUN pip install requests

# Copy simulator code
COPY . .

# Make the Python script executable
RUN chmod +x smartfleet_simulator.py

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python3 -c "import requests; requests.get('http://backend:8080/actuator/health', timeout=5)" || exit 1

# Run the simulator
CMD ["python3", "smartfleet_simulator.py"]
