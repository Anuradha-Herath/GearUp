# Frontend Docker Quick Reference

## 🚀 Quick Commands

### Build
```bash
# Build from project root
docker build -f docker/frontend.Dockerfile -t gearup-frontend:latest .

# Build with docker-compose
docker-compose -f docker/docker-compose.yml build frontend
```

### Run
```bash
# Run standalone
docker run -d -p 80:80 --name gearup-frontend gearup-frontend:latest

# Run with docker-compose
docker-compose -f docker/docker-compose.yml up frontend
```

### Stop & Remove
```bash
# Stop container
docker stop gearup-frontend

# Remove container
docker rm gearup-frontend

# Remove image
docker rmi gearup-frontend:latest
```

### Logs
```bash
# View logs
docker logs gearup-frontend

# Follow logs
docker logs -f gearup-frontend

# Last 100 lines
docker logs --tail 100 gearup-frontend
```

### Health Check
```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' gearup-frontend

# Manual health check
curl http://localhost/health
```

### Debug
```bash
# Access container shell
docker exec -it gearup-frontend sh

# Check Nginx config
docker exec gearup-frontend nginx -t

# View Nginx config
docker exec gearup-frontend cat /etc/nginx/conf.d/default.conf

# Test nginx reload
docker exec gearup-frontend nginx -s reload
```

## 📝 Common Tasks

### Update Environment Variables
```bash
# Edit .env file
cd frontend
notepad .env

# Rebuild (environment variables are baked in at build time)
docker-compose -f docker/docker-compose.yml build frontend
docker-compose -f docker/docker-compose.yml up -d frontend
```

### View Container Stats
```bash
# Real-time stats
docker stats gearup-frontend

# One-time stats
docker stats --no-stream gearup-frontend
```

### Inspect Container
```bash
# Full inspection
docker inspect gearup-frontend

# Specific info
docker inspect --format='{{.NetworkSettings.IPAddress}}' gearup-frontend
```

## 🔧 Troubleshooting

### Container won't start
```bash
# Check logs
docker logs gearup-frontend

# Inspect container
docker inspect gearup-frontend

# Check port conflicts
netstat -ano | findstr :80
```

### Changes not reflected
```bash
# Clean build (no cache)
docker build --no-cache -f docker/frontend.Dockerfile -t gearup-frontend:latest .

# Or with docker-compose
docker-compose -f docker/docker-compose.yml build --no-cache frontend
```

### Port already in use
```bash
# Find what's using port 80
netstat -ano | findstr :80

# Use different port
docker run -d -p 8080:80 --name gearup-frontend gearup-frontend:latest
```

### Check Nginx errors
```bash
# View error log
docker exec gearup-frontend cat /var/log/nginx/error.log

# View access log
docker exec gearup-frontend cat /var/log/nginx/access.log
```

## 📊 Performance Testing

### Test Gzip Compression
```bash
# Check if gzip is working
curl -H "Accept-Encoding: gzip" -I http://localhost/
# Look for: Content-Encoding: gzip
```

### Test Caching
```bash
# Check cache headers for JS files
curl -I http://localhost/assets/index-[hash].js
# Look for: Cache-Control: public, immutable
```

### Load Test (basic)
```bash
# Using Apache Bench (if installed)
ab -n 1000 -c 10 http://localhost/

# Or using curl (simple test)
for i in {1..100}; do curl -s http://localhost/ > /dev/null; done
```

## 🐳 Docker Compose Commands

### Start Services
```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# Start only frontend
docker-compose -f docker/docker-compose.yml up -d frontend

# View logs for all services
docker-compose -f docker/docker-compose.yml logs -f
```

### Stop Services
```bash
# Stop all services
docker-compose -f docker/docker-compose.yml down

# Stop and remove volumes
docker-compose -f docker/docker-compose.yml down -v
```

### Scale Services
```bash
# Scale frontend to 3 instances
docker-compose -f docker/docker-compose.yml up -d --scale frontend=3
```

## 🔍 Monitoring

### Check Container Health
```bash
# Health status
docker ps --filter name=gearup-frontend --format "table {{.Names}}\t{{.Status}}"

# Detailed health
docker inspect --format='{{json .State.Health}}' gearup-frontend | jq
```

### Resource Usage
```bash
# CPU and Memory
docker stats gearup-frontend --no-stream

# Disk usage
docker system df
```

## 📦 Cleanup

### Remove Unused Resources
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything unused
docker system prune -a

# Remove specific frontend images
docker images | grep gearup-frontend | awk '{print $3}' | xargs docker rmi
```

## 🌐 Production Deployment

### Tag for Registry
```bash
# Tag for Docker Hub
docker tag gearup-frontend:latest yourusername/gearup-frontend:latest
docker tag gearup-frontend:latest yourusername/gearup-frontend:v1.0.0

# Push to registry
docker push yourusername/gearup-frontend:latest
docker push yourusername/gearup-frontend:v1.0.0
```

### Pull and Run in Production
```bash
# Pull from registry
docker pull yourusername/gearup-frontend:latest

# Run in production
docker run -d \
  --name gearup-frontend \
  --restart unless-stopped \
  -p 80:80 \
  yourusername/gearup-frontend:latest
```

## 🔐 Security Scanning

### Scan for Vulnerabilities
```bash
# Using Docker scan (if available)
docker scan gearup-frontend:latest

# Using Trivy (if installed)
trivy image gearup-frontend:latest
```

## 📚 Useful Links

- Full Documentation: [FRONTEND_DOCKER_GUIDE.md](./FRONTEND_DOCKER_GUIDE.md)
- Improvements Summary: [FRONTEND_IMPROVEMENTS.md](./FRONTEND_IMPROVEMENTS.md)
- Docker Compose: [docker-compose.yml](./docker-compose.yml)
- Dockerfile: [frontend.Dockerfile](./frontend.Dockerfile)

---

**Quick Access URLs:**
- Application: http://localhost
- Health Check: http://localhost/health
- Backend API: http://localhost:8080
