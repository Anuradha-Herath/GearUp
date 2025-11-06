# Docker Deployment Guide

This directory contains the Docker configuration for the AutoServe application.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB of available RAM

## Quick Start

1. **Set up environment variables**

   Create a `.env` file in the `docker` directory:

   ```bash
   # Copy from example
   cp ../backend/.env.example .env
   ```

   Update the values in `.env`:
   ```env
   # JWT Configuration
   JWT_SECRET=your-secure-jwt-secret-key-at-least-256-bits
   JWT_EXPIRATION=86400000

   # SendGrid Configuration
   SENDGRID_API_KEY=your-sendgrid-api-key
   SENDGRID_FROM_EMAIL=noreply@autoserve.com

   # Database Configuration
   DATABASE_PASSWORD=your-secure-database-password

   # Spring Profile (dev, prod, test)
   SPRING_PROFILES_ACTIVE=prod
   ```

2. **Build and start all services**

   ```bash
   docker-compose up -d
   ```

3. **Check service status**

   ```bash
   docker-compose ps
   ```

4. **View logs**

   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f backend
   ```

## Service Details

### Backend Service
- **Port**: 8080
- **Health Check**: http://localhost:8080/actuator/health
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Base Image**: Eclipse Temurin 17 JRE Alpine
- **Memory Limits**: 1GB max, 512MB reserved

### Database Service
- **Port**: 3306
- **Type**: MySQL 8.0
- **Database Name**: autoserve
- **Health Check**: MySQL ping
- **Volume**: Persistent data storage

### Frontend Service
- **Port**: 3000
- **Framework**: React + Vite

## Docker Commands

### Build Services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend

# Build with no cache
docker-compose build --no-cache
```

### Start/Stop Services
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Monitoring
```bash
# View logs
docker-compose logs -f backend

# Check resource usage
docker stats

# Inspect service
docker-compose exec backend sh
```

### Database Operations
```bash
# Connect to database
docker-compose exec db mysql -u root -p autoserve

# Backup database
docker-compose exec db mysqldump -u root -p autoserve > backup.sql

# Restore database
docker-compose exec -T db mysql -u root -p autoserve < backup.sql
```

## Dockerfile Details

### Backend Dockerfile Features

1. **Multi-stage Build**
   - Stage 1: Build the application using Maven
   - Stage 2: Create minimal runtime image

2. **Security Best Practices**
   - Non-root user execution
   - Minimal base image (Alpine)
   - dumb-init for proper signal handling

3. **Performance Optimizations**
   - Layer caching for dependencies
   - G1GC garbage collector
   - Container-aware JVM settings
   - Memory percentage limits

4. **Health Checks**
   - Built-in health check endpoint
   - Configurable intervals and retries

5. **JVM Tuning**
   - `MaxRAMPercentage=75.0` - Use up to 75% of container memory
   - `UseContainerSupport` - Respect container limits
   - `UseG1GC` - Modern garbage collector
   - String optimization flags

## Environment Profiles

### Development Profile
```bash
SPRING_PROFILES_ACTIVE=dev
```
- Uses local configuration
- More verbose logging
- H2 in-memory database option

### Production Profile
```bash
SPRING_PROFILES_ACTIVE=prod
```
- Strict validation
- Minimal logging
- External database required
- Security hardened

## Troubleshooting

### Backend won't start
1. Check database connectivity:
   ```bash
   docker-compose logs db
   ```

2. Verify environment variables:
   ```bash
   docker-compose config
   ```

3. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

### Database connection issues
1. Ensure database is healthy:
   ```bash
   docker-compose ps
   ```

2. Test database connection:
   ```bash
   docker-compose exec db mysql -u root -p -e "SELECT 1"
   ```

### Out of Memory errors
1. Increase Docker memory limits
2. Adjust JVM settings in Dockerfile:
   ```dockerfile
   ENV JAVA_OPTS="-XX:MaxRAMPercentage=60.0"
   ```

### Port already in use
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Stop conflicting service or change port in docker-compose.yml
```

## Production Deployment

### Security Checklist
- [ ] Use strong JWT secret (at least 256 bits)
- [ ] Use strong database password
- [ ] Configure HTTPS/TLS
- [ ] Set up firewall rules
- [ ] Enable Docker content trust
- [ ] Regular security updates
- [ ] Use secrets management (Docker Secrets, Vault)

### Performance Tuning
- [ ] Adjust JVM heap size based on workload
- [ ] Configure connection pool sizes
- [ ] Enable monitoring (Prometheus/Grafana)
- [ ] Set up log aggregation
- [ ] Configure backups

### Monitoring
```bash
# Add monitoring stack
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push
        run: |
          docker-compose build
          docker-compose push
```

## Additional Resources

- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [MySQL Docker Documentation](https://hub.docker.com/_/mysql)
