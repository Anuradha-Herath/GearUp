# 🚀 Quick Reference - GearUp Kubernetes Deployment

## ⚡ Access Your Application

**Frontend**: http://localhost:30000  
**Backend API**: http://localhost:30080  
**API Health**: http://localhost:30080/actuator/health

---

## 📊 Check Status

```powershell
# See all pods
kubectl get pods -n gearup

# See all services  
kubectl get svc -n gearup

# Detailed pod info
kubectl describe pod <pod-name> -n gearup
```

## 📝 View Logs

```powershell
# Backend logs
kubectl logs -n gearup -l app=backend -f

# Frontend logs
kubectl logs -n gearup -l app=frontend -f

# Last 50 lines
kubectl logs -n gearup <pod-name> --tail=50
```

## 🔧 Common Tasks

### Restart a Service
```powershell
kubectl rollout restart deployment/backend -n gearup
kubectl rollout restart deployment/frontend -n gearup
```

### Check Database Connection
```powershell
# From within pod
kubectl run -it --rm test --image=busybox --restart=Never -n gearup -- \
  sh -c "nc -zv 192.168.65.254 3307"

# Check database is running
docker ps | findstr mysql
```

### Scale Replicas (HA)
```powershell
kubectl scale deployment backend --replicas=3 -n gearup
kubectl scale deployment frontend --replicas=2 -n gearup
```

### Get All Resources
```powershell
kubectl get all -n gearup
```

---

## 🗄️ Database

**MySQL 5.7 Container**: `gearup-mysql-dev`  
**Database**: gearup  
**Port**: 3307  
**User**: gearup_user / Anu@2001  
**Root**: root / Anu@2001

### Database Commands
```powershell
# Connect to MySQL
docker exec -it gearup-mysql-dev mysql -uroot -pAnu@2001

# Check tables
docker exec gearup-mysql-dev mysql -uroot -pAnu@2001 gearup -e "SHOW TABLES;"

# Check database size
docker exec gearup-mysql-dev mysql -uroot -pAnu@2001 -e "SELECT table_schema, SUM(data_length + index_length) / 1024 / 1024 AS size_mb FROM information_schema.tables WHERE table_schema='gearup' GROUP BY table_schema;"
```

---

## 🆘 Troubleshooting

### Backend in CrashLoopBackOff?
```powershell
# Check logs
kubectl logs -n gearup -l app=backend --tail=100

# Common issues:
# 1. Database not running: docker ps | findstr mysql
# 2. Wrong DATABASE_URL: kubectl get deployment backend -n gearup -o yaml | findstr DATABASE_URL
# 3. Tables don't exist: Run migrations (see DEPLOYMENT_SUCCESS.md)
```

### Frontend shows "Cannot connect to server"?
```powershell
# Check backend is running
kubectl get pods -n gearup -l app=backend

# Check backend service exists
kubectl get svc backend -n gearup

# Test API
curl http://localhost:30080/actuator/health
```

### Port Already in Use?
```powershell
# Check what's using the port
netstat -ano | findstr :30000
netstat -ano | findstr :30080

# Kill process (replace PID)
taskkill /PID <PID> /F
```

---

## 🔄 Full Restart Procedure

```powershell
# 1. Restart Kubernetes
kubectl delete namespace gearup
kubectl apply -f k8s/

# 2. Wait for pods to be ready
kubectl get pods -n gearup -w

# 3. Run migrations
powershell -ExecutionPolicy Bypass -File run_migrations.ps1

# 4. Verify
curl http://localhost:30080/actuator/health
```

---

## 📦 Redeploy Changes

### Update Backend
```powershell
# 1. Build new image
docker build -f docker/backend.Dockerfile -t gearup/backend:latest .

# 2. Force pod restart
kubectl rollout restart deployment/backend -n gearup

# 3. Monitor
kubectl logs -n gearup -l app=backend -f
```

### Update Frontend  
```powershell
# 1. Build new image
docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .

# 2. Force pod restart
kubectl rollout restart deployment/frontend -n gearup

# 3. Monitor
kubectl logs -n gearup -l app=frontend -f
```

---

## 📋 Configuration Files

- **ConfigMap**: `k8s/2-configmap.yaml` (non-sensitive settings)
- **Secrets**: `k8s/3-secrets.yaml` (passwords, API keys)
- **Backend Deployment**: `k8s/7-backend-deployment.yaml`
- **Frontend Deployment**: `k8s/9-frontend-deployment.yaml`
- **Docker Compose**: `docker/docker-compose.yml` (MySQL)

---

## 🆔 Service Endpoints (Internal)

From inside Kubernetes pods:

```
Backend: http://backend:8080
Frontend: http://frontend
MySQL: host.docker.internal:3307 (from container perspective)
```

## 🔗 External Endpoints (NodePort)

From your host machine:

```
Frontend: http://localhost:30000
Backend: http://localhost:30080
MySQL: localhost:3307
```

---

## 📊 Resource Limits

**Backend**: 250m CPU / 512Mi RAM (requests), 1000m CPU / 1Gi RAM (limits)  
**Frontend**: 500m CPU / 128Mi RAM (requests), 1000m CPU / 256Mi RAM (limits)  
**MySQL**: 1000m CPU / 1Gi RAM (requests), 2000m CPU / 2Gi RAM (limits)

---

**Everything is running! Enjoy your GearUp application!** 🎉
