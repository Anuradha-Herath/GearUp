#!/bin/bash

echo "🚀 Starting AutoServe Backend with Chatbot..."
echo ""

cd backend

export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"

echo "Java Home: $JAVA_HOME"
echo ""
echo "Starting Spring Boot application..."
echo "Look for: ✅ Vector database initialized successfully"
echo ""

mvn clean spring-boot:run -DskipTests
