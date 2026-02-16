#!/bin/bash

# Frontend Startup Script
cd /Users/umeshreddy/Downloads/smartfleet2/frontend

echo "🎨 Starting SmartFleet2 Frontend..."
echo "=================================="

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🚀 Starting Vite development server..."
echo "   Frontend will be available at: http://localhost:5173"
echo ""

npm run dev