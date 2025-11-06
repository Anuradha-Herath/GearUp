# Backend Docker Image - Build & Usage Guide

## ✅ Docker Image Successfully Built!

**Image Name:** `gearup-backend:latest`  
**Image Size:** ~540MB  
**Base Images:** Maven 3.9.9 + Eclipse Temurin 17 JRE Alpine

## 🎯 Image Features

### Security
- ✅ Multi-stage build (minimal runtime image)
- ✅ Non-root user (`spring:spring`)
- ✅ Alpine Linux base (minimal attack surface)
- ✅ No unnecessary tools or packages
- ✅ dumb-init for proper signal handling

### Performance
- ✅ JVM optimized for containers
- ✅ G1 Garbage Collector
- ✅ String deduplication enabled
- ✅ Layer caching for dependencies

### Monitoring
- ✅ Health check endpoint configured
- ✅ Spring Boot Actuator enabled
- ✅ Automatic health monitoring

## 📦 Build the Image

### Build Command
```powershell
# From project root directory
cd "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp"

# Build the image
docker build -f docker/backend.Dockerfile -t gearup-backend:latest .
```

### Build with Custom Tag
```powershell
# Build with version tag
docker build -f docker/backend.Dockerfile -t gearup-backend:v1.0.0 .

# Build with multiple tags
docker build -f docker/backend.Dockerfile `
    -t gearup-backend:latest `
    -t gearup-backend:v1.0.0 .
```

### No-Cache Build
```powershell
# Force rebuild without cache (if dependencies changed)
docker build --no-cache -f docker/backend.Dockerfile -t gearup-backend:latest .
```

## 🚀 Run the Container

### Option 1: Standalone Container (Development)

**Prerequisites:** MySQL must be running on your host machine or accessible.

```powershell
docker run -d \
    --name gearup-backend \
    -p 8080:8080 \
    -e SPRING_PROFILES_ACTIVE=dev \
    -e DATABASE_URL="jdbc:mysql://host.docker.internal:3306/gearup?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" \
    -e DATABASE_USERNAME=root \
    -e DATABASE_PASSWORD="Anu@2001" \
    -e JWT_SECRET="devSecretKeyForJwtTokenGenerationThatShouldBeAtLeast256BitsLongForDevelopment" \
    -e JWT_EXPIRATION=86400000 \
    -e SENDGRID_API_KEY="your-sendgrid-api-key" \
    -e SENDGRID_FROM_EMAIL="noreply@gearup.com" \
    gearup-backend:latest
```

**Note:** `host.docker.internal` is a special DNS name that resolves to the host machine from within Docker containers.

### Option 2: With Docker Compose (Recommended)

```powershell
# Navigate to docker directory
cd docker

# Start all services (backend + database)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### Option 3: With External Network

If you have a MySQL container running in a custom network:

```powershell
# Create network (if not exists)
docker network create gearup-network

# Run backend connecting to db container
docker run -d \
    --name gearup-backend \
    --network gearup-network \
    -p 8080:8080 \
    -e SPRING_PROFILES_ACTIVE=prod \
    -e DATABASE_URL="jdbc:mysql://mysql-container:3306/gearup?useSSL=false&allowPublicKeyRetrieval=true" \
    -e DATABASE_USERNAME=root \
    -e DATABASE_PASSWORD="Anu@2001" \
    -e JWT_SECRET="your-production-jwt-secret" \
    -e JWT_EXPIRATION=86400000 \
    -e SENDGRID_API_KEY="your-sendgrid-api-key" \
    -e SENDGRID_FROM_EMAIL="noreply@gearup.com" \
    gearup-backend:latest
```

## 🔍 Verify the Container

### Check Container Status
```powershell
# List running containers
docker ps

# Check specific container
docker ps -f "name=gearup-backend"
```

### View Logs
```powershell
# Follow logs in real-time
docker logs -f gearup-backend

# View last 50 lines
docker logs --tail 50 gearup-backend

# View logs with timestamps
docker logs -t gearup-backend
```

### Health Check
```powershell
# Check health status
docker inspect gearup-backend --format='{{.State.Health.Status}}'

# Test health endpoint directly
curl http://localhost:8080/actuator/health

# Or in PowerShell
Invoke-WebRequest -Uri http://localhost:8080/actuator/health
```

### Container Stats
```powershell
# View resource usage
docker stats gearup-backend

# Single snapshot
docker stats --no-stream gearup-backend
```

## 🛠️ Container Management

### Start/Stop/Restart
```powershell
# Stop container
docker stop gearup-backend

# Start container
docker start gearup-backend

# Restart container
docker restart gearup-backend

# Remove container
docker rm -f gearup-backend
```

### Execute Commands Inside Container
```powershell
# Open shell in container
docker exec -it gearup-backend sh

# Check Java version
docker exec gearup-backend java -version

# Check environment variables
docker exec gearup-backend env | grep DATABASE

# Check running processes
docker exec gearup-backend ps aux
```

### View Container Details
```powershell
# Full inspection
docker inspect gearup-backend

# Specific fields
docker inspect gearup-backend --format='{{.Config.Env}}'
docker inspect gearup-backend --format='{{.NetworkSettings.IPAddress}}'
```

## 📊 Image Management

### List Images
```powershell
# List all gearup images
docker images gearup-backend

# List with digests
docker images --digests gearup-backend
```

### Tag Images
```powershell
# Add additional tag
docker tag gearup-backend:latest gearup-backend:v1.0.0

# Tag for registry
docker tag gearup-backend:latest myregistry.com/gearup-backend:latest
```

### Remove Images
```powershell
# Remove specific tag
docker rmi gearup-backend:v1.0.0

# Remove all versions
docker rmi $(docker images gearup-backend -q)

# Force remove
docker rmi -f gearup-backend:latest
```

## 🐛 Troubleshooting

### Container Won't Start

**Check logs first:**
```powershell
docker logs gearup-backend
```

**Common Issues:**

1. **Port already in use:**
   ```powershell
   # Find process using port 8080
   netstat -ano | findstr :8080
   
   # Kill the process or use different port
   docker run -p 8081:8080 ...
   ```

2. **Database connection failed:**
   - Verify MySQL is running
   - Check connection string
   - Verify credentials
   - Ensure `allowPublicKeyRetrieval=true` in URL

3. **Out of memory:**
   ```powershell
   # Run with memory limits
   docker run -m 1g --memory-reservation=512m ...
   ```

### Container Exits Immediately

```powershell
# Check exit code
docker inspect gearup-backend --format='{{.State.ExitCode}}'

# View logs
docker logs gearup-backend

# Run in foreground to see errors
docker run --rm -it gearup-backend:latest
```

### Health Check Failing

```powershell
# Check health check details
docker inspect gearup-backend --format='{{json .State.Health}}' | ConvertFrom-Json

# Test health endpoint manually
docker exec gearup-backend wget -qO- http://localhost:8080/actuator/health
```

### Database Connection Issues

```powershell
# Test MySQL connectivity from container
docker exec gearup-backend sh -c "apk add mysql-client && mysql -h host.docker.internal -u root -p"

# Verify environment variables
docker exec gearup-backend env | grep DATABASE
```

## 🔒 Security Best Practices

### Do Not:
- ❌ Hardcode passwords in Dockerfile or docker run commands
- ❌ Use `root` user
- ❌ Expose unnecessary ports
- ❌ Run with `--privileged` flag
- ❌ Mount sensitive host directories

### Do:
- ✅ Use environment variables for secrets
- ✅ Use Docker secrets in production
- ✅ Scan images for vulnerabilities
- ✅ Keep base images updated
- ✅ Use specific version tags (not `latest` in production)

### Scan for Vulnerabilities
```powershell
# Using Docker Scout (if available)
docker scout cves gearup-backend:latest

# Using Trivy
trivy image gearup-backend:latest
```

## 📤 Push to Registry

### Docker Hub
```powershell
# Login
docker login

# Tag for Docker Hub
docker tag gearup-backend:latest yourusername/gearup-backend:latest

# Push
docker push yourusername/gearup-backend:latest
```

### Private Registry
```powershell
# Login to private registry
docker login myregistry.com

# Tag
docker tag gearup-backend:latest myregistry.com/gearup-backend:latest

# Push
docker push myregistry.com/gearup-backend:latest
```

### Azure Container Registry (ACR)
```powershell
# Login to ACR
az acr login --name myregistry

# Tag
docker tag gearup-backend:latest myregistry.azurecr.io/gearup-backend:latest

# Push
docker push myregistry.azurecr.io/gearup-backend:latest
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: |
          docker build -f docker/backend.Dockerfile -t gearup-backend:${{ github.sha }} .
          
      - name: Run tests
        run: |
          docker run --rm gearup-backend:${{ github.sha }} mvn test
          
      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker tag gearup-backend:${{ github.sha }} yourusername/gearup-backend:latest
          docker push yourusername/gearup-backend:latest
```

## 📈 Performance Tuning

### Adjust JVM Memory
```powershell
# Set custom JVM options
docker run -d \
    -e JAVA_OPTS="-XX:MaxRAMPercentage=80.0 -XX:InitialRAMPercentage=60.0" \
    gearup-backend:latest
```

### Resource Limits
```powershell
# Set CPU and memory limits
docker run -d \
    --cpus="2.0" \
    --memory="1g" \
    --memory-reservation="512m" \
    gearup-backend:latest
```

## 📚 Useful Commands Reference

```powershell
# Build
docker build -f docker/backend.Dockerfile -t gearup-backend:latest .

# Run
docker run -d --name gearup-backend -p 8080:8080 -e ... gearup-backend:latest

# Logs
docker logs -f gearup-backend

# Stop/Start
docker stop gearup-backend
docker start gearup-backend

# Remove
docker rm -f gearup-backend

# Shell access
docker exec -it gearup-backend sh

# Health check
curl http://localhost:8080/actuator/health

# Stats
docker stats gearup-backend

# Clean up
docker system prune -a
```

## 🎉 Success!

Your backend Docker image is now ready for:
- ✅ Local development
- ✅ Testing
- ✅ Staging deployment
- ✅ Production deployment

For production deployment, remember to:
1. Use proper secrets management
2. Set appropriate resource limits
3. Configure monitoring and logging
4. Set up automated backups
5. Use health checks and auto-restart policies
