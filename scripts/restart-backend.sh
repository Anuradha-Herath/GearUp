#!/bin/bash

echo "🔄 Forcing Backend Restart..."
echo ""

# Kill any existing Spring Boot process on port 8080
echo "1. Killing any process on port 8080..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || echo "   No process found on port 8080"

# Wait a moment
sleep 2

# Clean and rebuild
echo ""
echo "2. Cleaning and rebuilding..."
cd backend

export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"

# Clean build
mvn clean -q

echo ""
echo "3. Starting backend..."
echo "   Look for: ✅ Vector database initialized successfully"
echo ""

# Start
mvn spring-boot:run -DskipTests
