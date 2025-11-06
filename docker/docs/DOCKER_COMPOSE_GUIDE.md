# Docker Compose Best Practices Implementation

This document explains the improvements made to the `docker-compose.yml` file and how to use them effectively.

## 🎯 Key Improvements

### 1. **Configuration Management**
- Moved all hardcoded values to environment variables
- Created `.env.example` as a template for required variables
- Support for different environments (dev, staging, production)
- Production override file (`docker-compose.prod.yml`)

### 2. **Security Enhancements**
```yaml
security_opt:
  - no-new-privileges:true    # Prevent privilege escalation
```
- Non-root user execution in all services
- Read-only filesystem mounts where applicable
- Sensitive data in environment variables, not in code

### 3. **Network Optimization**
- Internal communication only (no unnecessary port exposure)
- Database uses `expose` instead of `ports` (only accessible from other containers)
- Backend uses `expose` with proper reverse proxy configuration
- Defined subnet for predictable internal IPs

### 4. **Health Checks**
- **Database**: Validates MySQL connectivity every 10 seconds
- **Backend**: Checks Spring Boot Actuator readiness endpoint
- **Frontend**: Validates HTTP health endpoint
- Proper startup periods to avoid false failures

### 5. **Resource Management**
```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 1.5G
    reservations:
      cpus: '1'
      memory: 768M
```
- CPU and memory limits to prevent resource exhaustion
- Reservations to guarantee minimum resources
- Right-sized for each service

### 6. **Logging**
- JSON-file driver for log rotation
- Log size limits: 10MB per file, 3-5 files retention
- Structured logging with service labels
- Prevents log files from consuming all disk space

### 7. **Database Configuration**
- Alpine image for smaller footprint (mysql:8.0.36-alpine)
- Character set enforced (UTF-8)
- Connection pool optimization
- InnoDB buffer pool configuration

## 📋 Setup Instructions

### 1. **Create Environment File**
```bash
cd docker
cp .env.example .env
# Edit .env with your actual values
```

**Required variables:**
```env
DB_ROOT_PASSWORD=secure_password_here
DB_PASSWORD=secure_db_password_here
JWT_SECRET=very_long_random_string_at_least_256_bits
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_email@domain.com
```

### 2. **Development Deployment**
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d --build

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f db
```

### 3. **Production Deployment**
```bash
# Use production override configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Set production environment
export SPRING_PROFILE=prod
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. **Common Operations**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ Deletes data!)
docker-compose down -v

# Stop and remove everything
docker-compose down -v --rmi all

# View service status
docker-compose ps

# Restart a specific service
docker-compose restart backend

# Rebuild a specific service
docker-compose build --no-cache backend

# Execute command in container
docker-compose exec backend sh
docker-compose exec db mysql -u root -p
```

## 🔍 Monitoring

### Health Status
```bash
# Check service health
docker-compose ps

# Check logs for errors
docker-compose logs --tail 100
```

### Database Monitoring
```bash
# Access MySQL CLI
docker-compose exec db mysql -u root -p$DB_ROOT_PASSWORD -e "SHOW PROCESSLIST;"

# Check database size
docker-compose exec db mysql -u root -p$DB_ROOT_PASSWORD -e "SELECT table_schema, ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) FROM information_schema.TABLES GROUP BY table_schema;"
```

### Application Monitoring
```bash
# Check Spring Boot actuator
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/info
curl http://localhost:8080/actuator/metrics
```

## 🚀 Performance Tuning

### Database Optimization
The following MySQL settings are optimized for the application:

| Setting | Value | Purpose |
|---------|-------|---------|
| `max_connections` | 200 | Allow concurrent connections |
| `max_allowed_packet` | 256M | Support large data transfers |
| `innodb_buffer_pool_size` | 1G | Cache frequently accessed data |
| `innodb_log_file_size` | 512M | Improve write performance |

### JVM Configuration
```env
JAVA_OPTS=-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0 -XX:+UseG1GC
```

### Memory Allocation
| Service | Limit | Reservation |
|---------|-------|-------------|
| Database | 2G | 1G |
| Backend | 1.5G | 768M |
| Frontend | 256M | 128M |

## 🔐 Security Considerations

### 1. Environment Variables
- Store sensitive data in `.env` file
- **Never** commit `.env` to Git
- Use `.env.example` for documentation

### 2. Database Access
- Database only accessible from backend container
- No direct host access in production
- Root credentials should be strong

### 3. JWT Secrets
- Must be at least 256 bits
- Should be random and unique
- Regenerate for each environment

### 4. Network Isolation
- Services communicate via named network
- Private subnet configured (172.28.0.0/16)
- No services unnecessarily exposed

## 📊 Resource Requirements

### Minimum (Development)
- CPU: 2 cores
- Memory: 4GB
- Disk: 10GB

### Recommended (Production)
- CPU: 4+ cores
- Memory: 8GB+
- Disk: 50GB+ (depends on data volume)

## 🐛 Troubleshooting

### "Container exits with error"
```bash
docker-compose logs [service-name]
```

### "Backend can't connect to database"
```bash
# Check service connectivity
docker-compose exec backend ping db

# Check MySQL is running
docker-compose exec db mysqladmin ping -u root -p$DB_ROOT_PASSWORD
```

### "Port already in use"
```bash
# Find process using port
lsof -i :80
lsof -i :3306
lsof -i :8080

# Use different port in .env
FRONTEND_PORT=8000
```

### "Database migration fails"
```bash
# Check migration files
ls -la ../database/migrations/

# Check database logs
docker-compose logs db
```

## 📝 Best Practices Applied

✅ **Configuration Management**: Environment-based configuration  
✅ **Health Checks**: All services have meaningful health checks  
✅ **Resource Limits**: Memory and CPU limits to prevent resource exhaustion  
✅ **Logging**: Structured logging with rotation  
✅ **Security**: Non-root users, read-only mounts, no privilege escalation  
✅ **Networking**: Proper network isolation and exposure  
✅ **Documentation**: Comprehensive comments and examples  
✅ **Scalability**: Support for multiple environments  

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [MySQL 8.0 Configuration](https://dev.mysql.com/doc/refman/8.0/en/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
