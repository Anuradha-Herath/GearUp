# Docker Compose Quick Start

## ⚡ Quick Setup (5 minutes)

### 1. Setup Environment
```bash
cd docker
cp .env.example .env
```

### 2. Edit `.env` with your values
```env
DB_ROOT_PASSWORD=MySecurePassword123!
DB_PASSWORD=DbUserPassword456!
JWT_SECRET=YourVeryLongJWTSecretKeyAtLeast256BitsLongChangeMe
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### 3. Start Services
```bash
# Development (with logs)
docker-compose up --build

# Production (background)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### 4. Verify Services
```bash
# Check status
docker-compose ps

# Test endpoints
curl http://localhost:80              # Frontend
curl http://localhost:8080/actuator/health  # Backend
```

---

## 🎮 Essential Commands

| Command | Purpose |
|---------|---------|
| `docker-compose up -d` | Start all services in background |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View live logs |
| `docker-compose ps` | Show service status |
| `docker-compose restart backend` | Restart specific service |
| `docker-compose exec db mysql -u root -p` | Access database |

---

## 📍 Service Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `http://localhost` | React application |
| **Backend** | `http://localhost:8080` | Spring Boot API |
| **Health Check** | `http://localhost:8080/actuator/health` | Application health |
| **Database** | `localhost:3306` (internal only) | MySQL database |

---

## 🔑 Environment Variables

### Database
- `DB_ROOT_PASSWORD` - MySQL root password
- `DB_USER` - Application database user (default: gearup_user)
- `DB_PASSWORD` - Application database password
- `DB_NAME` - Database name (default: gearup)

### Backend
- `SPRING_PROFILE` - Environment profile (dev, prod, test)
- `JWT_SECRET` - JWT signing secret (MUST be 256+ bits)
- `JWT_EXPIRATION` - Token expiration in milliseconds
- `SENDGRID_API_KEY` - Email service API key
- `SENDGRID_FROM_EMAIL` - Default from email address

### Frontend
- `FRONTEND_PORT` - Port to expose frontend (default: 80)
- `NGINX_HOST` - Nginx hostname (default: localhost)

---

## 🚨 Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs [service-name]

# Verify .env file exists and is valid
cat .env

# Check ports aren't in use
netstat -tuln | grep :80
netstat -tuln | grep :3306
netstat -tuln | grep :8080
```

### Can't connect to database
```bash
# Test connectivity from backend
docker-compose exec backend ping db

# Check MySQL is running
docker-compose exec db mysqladmin ping -u root -p
```

### Frontend shows blank page
```bash
# Check frontend logs
docker-compose logs frontend

# Verify backend is healthy
curl http://localhost:8080/actuator/health

# Check browser console for errors
# Open DevTools (F12) and check console and network tabs
```

---

## 🔧 Configuration Hierarchy

Settings are applied in this order (later overrides earlier):

1. **Default values** in docker-compose.yml
2. **.env file** environment variables
3. **docker-compose.prod.yml** overrides (when used)
4. **Runtime environment** variables

Example:
```bash
# Override at runtime
SPRING_PROFILE=dev docker-compose up
```

---

## 💾 Data Persistence

Data is stored in `./mysql_data/` volume:

```bash
# Backup database
docker-compose exec db mysqldump -u root -p$DB_ROOT_PASSWORD --all-databases > backup.sql

# Restore database
docker-compose exec -T db mysql -u root -p$DB_ROOT_PASSWORD < backup.sql

# Delete all data (⚠️ careful!)
docker-compose down -v
```

---

## 📊 Resource Usage

Check resource consumption:
```bash
docker stats

# Or specific service
docker stats autoserve-backend autoserve-db autoserve-frontend
```

---

## 🚀 Performance Tips

1. **Use production override** for better performance:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Increase memory limit** if needed:
   ```yaml
   deploy:
     resources:
       limits:
         memory: 2G
   ```

3. **Monitor logs** to catch issues early:
   ```bash
   docker-compose logs -f --tail 100
   ```

---

## 🛡️ Security Reminders

⚠️ **IMPORTANT:**
- ❌ Never commit `.env` to Git
- ❌ Never use default passwords in production
- ✅ Use strong, random passwords (20+ characters)
- ✅ Rotate secrets regularly
- ✅ Use HTTPS in production
- ✅ Keep database backups
- ✅ Review logs regularly

---

## 📞 Useful Links

- [Docker Compose Docs](https://docs.docker.com/compose/reference/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)

---

**Last Updated**: November 2024  
**Project**: AutoServe  
**Version**: 3.8
