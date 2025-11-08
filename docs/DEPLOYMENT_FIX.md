# 🔧 Deployment Fix Summary

## Problem Identification

**Symptoms**:
- Backend pod in `CrashLoopBackOff` status
- Restarting continuously (17+ restart attempts)
- Error: `HibernateException: Unable to determine Dialect without JDBC metadata`
- Frontend showing: "Cannot connect to server"

**Root Cause**:
The backend deployment was pointing to the wrong database URL:
```yaml
# ❌ WRONG (before fix)
DATABASE_URL: jdbc:mysql://mysql:3306/gearup?...
```

This was trying to connect to a Kubernetes service named `mysql` on port 3306, but:
1. MySQL was running OUTSIDE Kubernetes (in Docker Compose)
2. MySQL was actually on `192.168.65.254:3307` (Docker Desktop gateway)
3. No `mysql` service existed in Kubernetes
4. Connection failed → Hibernate couldn't initialize → Pod crashed

---

## Solution Applied

### Step 1: Fix DATABASE_URL in Deployment

**File**: `k8s/7-backend-deployment.yaml`

```yaml
# ✅ CORRECT (after fix)
env:
- name: DATABASE_URL
  value: "jdbc:mysql://host.docker.internal:3307/gearup?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=utf8&useUnicode=true&autoReconnect=true&failOverReadOnly=false"
```

**Why `host.docker.internal`?**
- From Docker container's perspective, `host.docker.internal` resolves to the Docker host machine (192.168.65.254 in Docker Desktop)
- This allows pods to connect to services running on the host (MySQL in Docker Compose)
- Kubernetes networking handles the translation automatically

### Step 2: Redeploy Backend

```bash
kubectl apply -f k8s/7-backend-deployment.yaml -n gearup
```

This triggered:
- Old pod termination
- New pod creation with corrected DATABASE_URL
- Spring Boot restart with proper database connection

### Step 3: Run Database Migrations

**File**: `run_migrations.ps1` (created)

Executed all 15 database migration files:
```sql
✅ V1__Create_users_table.sql
✅ V2__Create_services_table.sql
✅ V3__Create_vehicles_and_appointments_tables.sql
✅ V3a__Create_projects_table.sql
✅ V4__Create_time_logs_table.sql
✅ V4__seed_services.sql
✅ V5__Fix_time_logs_foreign_key.sql
✅ V5__seed_domain_data.sql
✅ V6__Add_missing_user_columns.sql
✅ V6__seed_domain_data_fix.sql
✅ V7__Add_created_at_to_appointments.sql
✅ V7__seed_users_and_domain.sql
✅ V8__fix_owners_and_insert_remaining.sql
✅ V9__insert_time_logs_and_appointments.sql
✅ V10__Create_feedbacks_table.sql
```

Result:
- 8 tables created (users, services, vehicles, appointments, time_logs, projects, feedbacks, etc.)
- Seed data populated
- Foreign keys configured
- Database ready for application

---

## Verification

### Backend Startup - Now Successful ✅

```log
2025-11-08 10:11:13 - Tomcat started on port 8080 (http) with context path ''
2025-11-08 10:11:13 - Started AutoServeApplication in 20.599 seconds
```

Before fix:
```log
❌ org.hibernate.HibernateException: Unable to determine Dialect without JDBC metadata
```

After fix:
```log
✅ HikariPool-1 - Added connection com.mysql.cj.jdbc.ConnectionImpl@eebc0db
✅ HikariPool-1 - Start completed
✅ Initialized JPA EntityManagerFactory for persistence unit 'default'
```

### Pod Status - Now Ready ✅

```bash
# Before
NAME                       READY   STATUS              RESTARTS
backend-5f57b595bd-l5q4q   0/1     CrashLoopBackOff   17

# After
NAME                       READY   STATUS              RESTARTS  
backend-778567ffd6-plj7z   1/1     Running             0
```

### Health Check - Now Responding ✅

```bash
$ kubectl run -it --rm test --image=curlimages/curl --restart=Never -n gearup -- \
  curl http://backend:8080/actuator/health
{"status":"UP"}
```

---

## Technical Details

### Network Flow (Fixed)

```
Frontend Pod (10.1.0.61)
    │
    ├─ Internal Service: backend:8080
    │       └─ Backend Pod (10.1.0.68)
    │
    └─ Backend Pod connects to:
           DATABASE_URL: host.docker.internal:3307
           
              (resolves to) 192.168.65.254:3307
              
              (Docker Desktop Gateway)
              
                  ↓
              
              MySQL Container
              (gearup-mysql-dev)
              (Port 3307 published)
```

### Database Connection URL

```
jdbc:mysql://host.docker.internal:3307/gearup
  ├─ Protocol: jdbc:mysql (MySQL Connector/J)
  ├─ Host: host.docker.internal (Docker hostname from container perspective)
  ├─ Port: 3307 (Published port on Docker host)
  ├─ Database: gearup (Application database name)
  └─ Options: useSSL=false, allowPublicKeyRetrieval=true, etc.
```

### Environment Variables Used

```yaml
DATABASE_URL: jdbc:mysql://host.docker.internal:3307/gearup?...
DATABASE_USERNAME: gearup_user         # From: gearup-secrets
DATABASE_PASSWORD: Anu@2001            # From: gearup-secrets
SPRING_PROFILES_ACTIVE: prod           # From: gearup-config
JWT_SECRET: <secret>                   # From: gearup-secrets
(+ 8 more environment variables from ConfigMap and Secrets)
```

---

## Files Modified

| File | Changes |
|------|---------|
| `k8s/7-backend-deployment.yaml` | Updated DATABASE_URL to `host.docker.internal:3307` |
| `run_migrations.ps1` | Created new migration runner script |

## Files Created

| File | Purpose |
|------|---------|
| `DEPLOYMENT_SUCCESS.md` | Comprehensive deployment guide |
| `QUICK_REFERENCE.md` | Quick command reference |
| `DEPLOYMENT_COMPLETE.md` | Status report and next steps |
| `DEPLOYMENT_FIX.md` | This file - technical fix details |

---

## Timeline of Events

| Time | Event |
|------|-------|
| 10:10:52 | Spring Boot starts initializing |
| 10:10:57 | JPA repositories bootstrap |
| 10:10:59 | Tomcat initialized |
| 10:11:00 | **Connection Attempt**: HikariPool tries to connect |
| **BEFORE FIX** | ❌ Connection fails (wrong host) → Hibernate error → Pod crashes |
| **AFTER FIX** | ✅ Connection succeeds → Hibernate initializes → Application starts |
| 10:11:05 | EntityManagerFactory initialized successfully |
| 10:11:13 | ✅ Tomcat started on port 8080 |
| 10:11:13 | ✅ Application started successfully (20.6 seconds) |

---

## Performance Impact

- **Startup Time**: ~20 seconds (normal for Spring Boot)
- **Database Connection Pool**: HikariCP with 10 connections
- **Memory Usage**: 512Mi (request) / 1Gi (limit)
- **CPU Usage**: 250m (request) / 1000m (limit)

---

## Why This Works

### 1. Service Discovery
- Frontend can reach Backend via Kubernetes DNS: `backend:8080`
- Both pods in same namespace (`gearup`)

### 2. External Database Access
- Backend needs to reach MySQL on Docker host
- `host.docker.internal` is Docker's special hostname for this
- Resolves to 192.168.65.254 (Docker Desktop bridge network)

### 3. Database Connectivity
- MySQL container published port 3307
- Backend pod can reach 192.168.65.254:3307 (verified with `nc` connectivity test)
- JDBC connection string properly formatted and executed

### 4. Database Readiness
- All migrations executed before backend needed tables
- Tables exist when Hibernate initializes
- JPA repositories can query successfully

---

## What Would Happen Without This Fix

```
❌ Service Request Flow (if not fixed):
   Backend tries to connect to: mysql:3306
   ↓
   Kubernetes DNS lookup for 'mysql' service
   ↓
   No service named 'mysql' exists (or wrong port)
   ↓
   Connection refused
   ↓
   HikariPool cannot establish connection
   ↓
   Hibernate cannot determine SQL dialect
   ↓
   Spring Boot initialization fails
   ↓
   Pod crashes
   ↓
   Kubernetes restarts pod (exponential backoff)
   ↓
   🔄 CrashLoopBackOff (continuous restart)
```

---

## Lessons Learned

1. **Database Location Matters**: Know whether DB is inside or outside Kubernetes
2. **Docker Desktop Specifics**: `host.docker.internal` is key for accessing host services
3. **Database Readiness**: Tables must exist before application initializes
4. **Connection Testing**: Always verify connectivity with `nc` or similar tools
5. **Health Checks**: Readiness/liveness probes help catch startup issues

---

## Preventive Measures for Future

✅ Document database deployment location  
✅ Use consistent naming for services  
✅ Test database connectivity before deployment  
✅ Run migrations in init containers or pre-deployment scripts  
✅ Implement comprehensive health checks  
✅ Monitor pod restart counts for early issue detection  

---

**Fix Date**: November 8, 2025  
**Status**: ✅ Complete and Verified  
**Result**: All systems operational, application running successfully
