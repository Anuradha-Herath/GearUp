# Multi-stage build for Spring Boot application
# Stage 1: Build stage
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

# Set working directory
WORKDIR /build

# Copy only pom.xml first to leverage Docker cache for dependencies
COPY backend/pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
# This includes dependencies for: Chatbot (OkHttp, Gson), Image Upload (SendGrid), JWT, and other services
RUN mvn dependency:go-offline -B

# Copy source code
COPY backend/src ./src

# Build the application (skip tests for faster builds, run tests in CI/CD)
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Install dumb-init and wget for proper signal handling and health checks
RUN apk add --no-cache dumb-init wget

# Create a non-root user for running the application
RUN addgroup -S spring && adduser -S spring -G spring

# Set working directory
WORKDIR /app

# Copy the JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring:spring

# Expose the application port
EXPOSE 8080

# Configure JVM for containerized environment
ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -XX:+UseG1GC \
    -XX:+OptimizeStringConcat \
    -XX:+UseStringDeduplication \
    -Djava.security.egd=file:/dev/./urandom"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run the application with JVM optimizations
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]