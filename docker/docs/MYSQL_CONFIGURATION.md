# MySQL Configuration Guide for GearUp Backend

## Overview
This project is configured to use **MySQL 8.0** as the primary database. All configurations have been optimized for MySQL performance and compatibility.

## Database Configuration

### Database Details
- **Database Name**: `gearup`
- **Default Port**: `3306`
- **Character Set**: `utf8mb4` (supports emojis and special characters)
- **Collation**: `utf8mb4_unicode_ci`
- **Authentication**: `mysql_native_password`

### Connection URLs

**Local Development:**
```
jdbc:mysql://localhost:3306/gearup?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

**Docker Environment:**
```
jdbc:mysql://db:3306/gearup?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=utf8&useUnicode=true
```

## MySQL-Specific Optimizations

### 1. Connection Pool (HikariCP)
```yaml
hikari:
  maximum-pool-size: 10        # Max connections
  minimum-idle: 5              # Min idle connections
  connection-timeout: 20000    # 20 seconds
  idle-timeout: 300000         # 5 minutes
  max-lifetime: 1200000        # 20 minutes
```

### 2. Hibernate Settings
```yaml
hibernate:
  dialect: org.hibernate.dialect.MySQLDialect
  format_sql: true             # Pretty print SQL
  use_sql_comments: true       # Add comments to SQL
  jdbc:
    batch_size: 20            # Batch insert optimization
  order_inserts: true          # Order inserts for batching
  order_updates: true          # Order updates for batching
```

### 3. MySQL Container Configuration
```yaml
environment:
  MYSQL_CHARACTER_SET_SERVER: utf8mb4
  MYSQL_COLLATION_SERVER: utf8mb4_unicode_ci
  MYSQL_INIT_CONNECT: 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci'

command:
  --default-authentication-plugin=mysql_native_password
  --character-set-server=utf8mb4
  --collation-server=utf8mb4_unicode_ci
```

## Removed Components
✅ **PostgreSQL dependency removed** from `pom.xml` to reduce image size and avoid conflicts.

## Local Development Setup

### 1. Install MySQL 8.0
**Windows:**
```powershell
# Using Chocolatey
choco install mysql

# Or download from: https://dev.mysql.com/downloads/installer/
```

### 2. Create Database
```sql
mysql -u root -p

CREATE DATABASE gearup CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
USE gearup;
```

### 3. Configure Environment Variables
Update your `backend/.env` file:
```properties
DATABASE_URL=jdbc:mysql://localhost:3306/gearup
DATABASE_USERNAME=root
DATABASE_PASSWORD=Anu@2001
```

### 4. Run Application
```powershell
cd backend
./mvnw spring-boot:run
```

## Docker Setup

### 1. Start MySQL Container
```powershell
cd docker
docker-compose up -d db
```

### 2. Verify Database
```powershell
# Connect to MySQL container
docker-compose exec db mysql -u root -pAnu@2001

# Check database
SHOW DATABASES;
USE gearup;
SHOW TABLES;
```

### 3. Start All Services
```powershell
docker-compose up -d
```

## Common MySQL Commands

### Database Management
```sql
-- Show all databases
SHOW DATABASES;

-- Select database
USE gearup;

-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;

-- Show table creation SQL
SHOW CREATE TABLE users;
```

### User Management
```sql
-- Create new user
CREATE USER 'gearup_user'@'%' IDENTIFIED BY 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON gearup.* TO 'gearup_user'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show grants
SHOW GRANTS FOR 'gearup_user'@'%';
```

### Performance Monitoring
```sql
-- Show current connections
SHOW PROCESSLIST;

-- Show table status
SHOW TABLE STATUS;

-- Show server status
SHOW STATUS LIKE '%connection%';

-- Show variables
SHOW VARIABLES LIKE '%max_connections%';
```

## Migration Scripts

Your SQL migration scripts in `database/migrations/` will be automatically executed when the MySQL container starts for the first time.

### Migrations Location
```
database/migrations/
├── V1__Create_users_table.sql
├── V2__Create_services_table.sql
├── V3__Create_vehicles_and_appointments_tables.sql
├── V4__Create_time_logs_table.sql
└── V5__Fix_time_logs_foreign_key.sql
```

### Manual Migration
```powershell
# Copy SQL file to container
docker cp database/migrations/V6__new_migration.sql autoserve-db:/tmp/

# Execute migration
docker-compose exec db mysql -u root -pAnu@2001 gearup < /tmp/V6__new_migration.sql
```

## Backup and Restore

### Backup Database
```powershell
# Backup to file
docker-compose exec db mysqldump -u root -pAnu@2001 gearup > backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql

# Backup with compression
docker-compose exec db mysqldump -u root -pAnu@2001 gearup | gzip > backup.sql.gz
```

### Restore Database
```powershell
# Restore from file
Get-Content backup.sql | docker-compose exec -T db mysql -u root -pAnu@2001 gearup

# Restore from compressed file
gunzip < backup.sql.gz | docker-compose exec -T db mysql -u root -pAnu@2001 gearup
```

## Troubleshooting

### Connection Issues

**Problem:** Cannot connect to MySQL
```
Solution:
1. Check if MySQL is running:
   docker-compose ps

2. Check MySQL logs:
   docker-compose logs db

3. Test connection:
   docker-compose exec db mysql -u root -pAnu@2001 -e "SELECT 1"
```

**Problem:** Authentication plugin error
```
Error: Authentication plugin 'caching_sha2_password' cannot be loaded

Solution: Use mysql_native_password (already configured in docker-compose.yml)
```

### Character Encoding Issues

**Problem:** Emoji or special characters not displaying correctly
```
Solution: Ensure utf8mb4 is used (already configured)
- Database: utf8mb4
- Tables: utf8mb4_unicode_ci
- Connection URL includes: characterEncoding=utf8&useUnicode=true
```

### Performance Issues

**Problem:** Slow queries
```
Solution:
1. Enable slow query log:
   docker-compose exec db mysql -u root -pAnu@2001 -e "SET GLOBAL slow_query_log = 'ON';"

2. Check slow queries:
   docker-compose exec db mysql -u root -pAnu@2001 -e "SHOW VARIABLES LIKE 'slow_query_log%';"

3. Analyze queries:
   EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

## Best Practices

1. ✅ **Use Connection Pooling**: HikariCP is configured and optimized
2. ✅ **Character Encoding**: utf8mb4 for full Unicode support
3. ✅ **Batch Operations**: Enabled for better performance
4. ✅ **Health Checks**: MySQL health check configured in Docker
5. ✅ **Persistent Storage**: Data stored in Docker volumes
6. ✅ **Regular Backups**: Use automated backup scripts
7. ✅ **Index Optimization**: Add indexes for frequently queried columns
8. ✅ **Connection Limits**: Configured to prevent resource exhaustion

## Production Considerations

### Security
- [ ] Use strong passwords (change default)
- [ ] Limit database user privileges
- [ ] Enable SSL/TLS for connections
- [ ] Regular security updates
- [ ] Network isolation (Docker networks)

### Performance
- [ ] Monitor query performance
- [ ] Optimize slow queries
- [ ] Regular table optimization
- [ ] Proper indexing strategy
- [ ] Connection pool tuning based on load

### Reliability
- [ ] Automated backups
- [ ] Replication setup (master-slave)
- [ ] Monitoring and alerting
- [ ] Regular maintenance windows
- [ ] Disaster recovery plan

## Additional Resources

- [MySQL 8.0 Documentation](https://dev.mysql.com/doc/refman/8.0/en/)
- [Spring Boot with MySQL](https://spring.io/guides/gs/accessing-data-mysql/)
- [HikariCP Configuration](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)
