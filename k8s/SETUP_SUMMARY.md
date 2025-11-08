# GearUp Kubernetes Deployment - Complete Setup Summary

Welcome! This is your complete guide to deploying the GearUp application on Kubernetes. This summary ties everything together.

## 📋 What You Need

### Prerequisites
- ✅ Docker Desktop installed (Windows)
- ✅ Kubernetes enabled in Docker Desktop
- ✅ kubectl installed (usually included with Docker Desktop)
- ✅ 4+ GB RAM allocated to Docker Desktop
- ✅ 10+ GB free disk space

## 📁 Files Created

Your `k8s/` folder now contains:

### Documentation Files
1. **README.md** - Overview and quick start
2. **DEPLOYMENT_STEPS.md** - Detailed step-by-step guide
3. **KUBECTL_COMMANDS.md** - Common kubectl commands reference
4. **TROUBLESHOOTING.md** - Comprehensive troubleshooting guide
5. **SETUP_SUMMARY.md** - This file

### Kubernetes Manifest Files
1. **1-namespace.yaml** - Create isolated namespace
2. **2-configmap.yaml** - Non-sensitive configuration
3. **3-secrets.yaml** - Sensitive data (passwords, API keys)
4. **4-mysql-pvc.yaml** - Database storage
5. **5-mysql-deployment.yaml** - MySQL database container
6. **6-mysql-service.yaml** - Database network service
7. **7-backend-deployment.yaml** - Spring Boot backend container
8. **8-backend-service.yaml** - Backend network service
9. **9-frontend-deployment.yaml** - React frontend container
10. **10-frontend-service.yaml** - Frontend network service
11. **11-frontend-ingress.yaml** - Advanced routing (optional)

### Script Files
1. **deploy.ps1** - Automated deployment script (recommended)
2. **quick-deploy.ps1** - Simple quick deployment script

## 🚀 Quick Start (5 Steps)

### Step 1: Enable Kubernetes in Docker Desktop
1. Right-click Docker icon → Settings
2. Go to: Settings → Kubernetes
3. Check "Enable Kubernetes"
4. Click "Apply & Restart"
5. Wait 2-3 minutes for startup

### Step 2: Prepare Your Secrets
```powershell
# Function to encode to base64
function Encode-Base64 {
    param([string]$String)
    [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($String))
}

# Example - encode your actual values:
Encode-Base64 "your-database-password"
Encode-Base64 "your-jwt-secret-key-min-32-chars"
Encode-Base64 "your-gemini-api-key"
Encode-Base64 "your-sendgrid-key"
```

Update `3-secrets.yaml` with your base64-encoded values.

### Step 3: Build Docker Images
```powershell
cd "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp"

docker build -f docker/backend.Dockerfile -t gearup/backend:latest .
docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .
```

### Step 4: Deploy to Kubernetes
```powershell
cd k8s

# Option A: Use automated script (recommended)
.\deploy.ps1

# Option B: Manual deployment
kubectl apply -f 1-namespace.yaml
kubectl apply -f 2-configmap.yaml
kubectl apply -f 3-secrets.yaml
kubectl apply -f 4-mysql-pvc.yaml
kubectl apply -f 5-mysql-deployment.yaml
kubectl apply -f 6-mysql-service.yaml
kubectl apply -f 7-backend-deployment.yaml
kubectl apply -f 8-backend-service.yaml
kubectl apply -f 9-frontend-deployment.yaml
kubectl apply -f 10-frontend-service.yaml
```

### Step 5: Access Your Application
```powershell
# Terminal 1: Frontend
kubectl port-forward -n gearup svc/frontend 80:80

# Terminal 2: Backend
kubectl port-forward -n gearup svc/backend 8080:8080

# Terminal 3: Database
kubectl port-forward -n gearup svc/mysql 3306:3306
```

Then open browser:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api/health

## 🔑 Understanding the Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                        │
│                     (Docker Desktop)                         │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Namespace: gearup                      │   │
│  │                                                     │   │
│  │  ConfigMap (Configuration)                         │   │
│  │  ├─ DB_NAME: gearup                               │   │
│  │  ├─ BACKEND_PORT: 8080                            │   │
│  │  └─ ... other config values ...                   │   │
│  │                                                     │   │
│  │  Secrets (Sensitive Data)                          │   │
│  │  ├─ DB_ROOT_PASSWORD (base64)                     │   │
│  │  ├─ JWT_SECRET (base64)                           │   │
│  │  ├─ GEMINI_API_KEY (base64)                       │   │
│  │  └─ SENDGRID_API_KEY (base64)                     │   │
│  │                                                     │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ MySQL Pod (Database)                        │ │   │
│  │  │ - Image: mysql:8.0-oracle                   │ │   │
│  │  │ - Volume: 5GB PVC (persistent storage)      │ │   │
│  │  │ - Port: 3306 (internal)                     │ │   │
│  │  │ - Service: mysql (ClusterIP)                │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                       ↑                            │   │
│  │                  (connects to)                     │   │
│  │                       ↓                            │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ Backend Pod (Spring Boot)                    │ │   │
│  │  │ - Image: gearup/backend:latest              │ │   │
│  │  │ - Port: 8080                                │ │   │
│  │  │ - Service: backend (NodePort 30080)         │ │   │
│  │  │ - Env vars from ConfigMap + Secrets         │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                       ↑                            │   │
│  │                  (calls from)                      │   │
│  │                       ↓                            │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │ Frontend Pod (React + Nginx)                 │ │   │
│  │  │ - Image: gearup/frontend:latest             │ │   │
│  │  │ - Port: 80                                  │ │   │
│  │  │ - Service: frontend (NodePort 30000)        │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Services exposed:                                          │
│  - Frontend: localhost:30000 (or :80 via port-forward)     │
│  - Backend: localhost:30080 (or :8080 via port-forward)    │
│  - MySQL: localhost:3306 (only via port-forward)           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📊 File Breakdown

### 1. ConfigMap (`2-configmap.yaml`)
- **Purpose**: Store non-sensitive configuration
- **Contains**: Database name, ports, logging levels, URLs
- **When to edit**: When changing configuration that doesn't need to be secret

### 2. Secrets (`3-secrets.yaml`)
- **Purpose**: Store sensitive data securely
- **Contains**: Database passwords, API keys, JWT secret (all base64-encoded)
- **When to edit**: When adding/changing passwords or API keys
- **⚠️ WARNING**: Don't commit to git! Add to .gitignore

### 3. MySQL Deployment (`5-mysql-deployment.yaml`)
- **Purpose**: Define how MySQL container runs
- **Key settings**:
  - Image: `mysql:8.0-oracle`
  - Resource limits: 512MB min, 1GB max
  - Health checks: Ensures MySQL is ready
  - PVC mount: Persistent storage for data

### 4. Backend Deployment (`7-backend-deployment.yaml`)
- **Purpose**: Define how Spring Boot runs
- **Key settings**:
  - Image: `gearup/backend:latest` (built locally)
  - Resource limits: 512MB min, 1GB max
  - Environment: Loads from ConfigMap + Secrets
  - Health checks: Uses Spring actuator endpoints

### 5. Frontend Deployment (`9-frontend-deployment.yaml`)
- **Purpose**: Define how React + Nginx runs
- **Key settings**:
  - Image: `gearup/frontend:latest` (built locally)
  - Resource limits: 64MB min, 256MB max (lightweight)
  - Security: Runs as non-root user (nginx)

## 🔄 Deployment Order

Kubernetes automatically handles dependencies, but manifests are numbered for clarity:

1. **Namespace** - Create isolated environment
2. **ConfigMap** - Set up configuration
3. **Secrets** - Set up sensitive data
4. **Storage** - Create persistent volume
5. **MySQL** - Start database (depends on storage)
6. **Backend** - Start API (depends on MySQL)
7. **Frontend** - Start web UI (depends on backend)

## 🎯 Common Tasks

### Check Status
```powershell
# See all pods and their status
kubectl get pods -n gearup

# Watch status in real-time
kubectl get pods -n gearup -w
```

### View Logs
```powershell
# Backend logs
kubectl logs -n gearup -l app=backend -f

# Frontend logs
kubectl logs -n gearup -l app=frontend -f

# MySQL logs
kubectl logs -n gearup -l app=mysql -f
```

### Update Configuration
```powershell
# Edit and apply ConfigMap
kubectl edit configmap gearup-config -n gearup

# Edit and apply Secrets
kubectl edit secret gearup-secrets -n gearup

# Or delete and recreate from file
kubectl delete configmap gearup-config -n gearup
kubectl apply -f 2-configmap.yaml
```

### Restart Pods
```powershell
# Restart all pods in deployment
kubectl rollout restart deployment/backend -n gearup
kubectl rollout restart deployment/frontend -n gearup

# Delete specific pod (will be recreated)
kubectl delete pod <pod-name> -n gearup
```

### Access Database
```powershell
# Connect to MySQL from your machine
kubectl port-forward -n gearup svc/mysql 3306:3306

# Then use MySQL client from another terminal
mysql -h 127.0.0.1 -u gearup_user -p gearup
```

### View Pod Details
```powershell
# See everything about a pod
kubectl describe pod <pod-name> -n gearup

# See pod YAML
kubectl get pod <pod-name> -n gearup -o yaml
```

## ⚠️ Important Notes

### Security Considerations
1. **Base64 is not encryption** - Secrets are base64-encoded, not encrypted
2. **Use RBAC** - In production, implement role-based access control
3. **Use network policies** - In production, restrict pod-to-pod communication
4. **Don't commit secrets** - Keep `3-secrets.yaml` out of git

### Resource Limits
Current setup uses development-friendly limits:
- MySQL: 512MB - 1GB memory
- Backend: 512MB - 1GB memory
- Frontend: 64MB - 256MB memory

For production, adjust based on traffic.

### Persistent Storage
MySQL data is stored in a PersistentVolumeClaim. On Docker Desktop:
- Data persists across pod restarts
- Data is lost if PVC is deleted
- Default quota is 5GB (can be increased)

### Scaling
To scale backend to 3 replicas:
```powershell
kubectl scale deployment/backend --replicas=3 -n gearup

# Or edit deployment
kubectl edit deployment backend -n gearup
# Change: spec.replicas: 3
```

## 📞 Support Resources

### Documentation in This Folder
- **DEPLOYMENT_STEPS.md** - Detailed walkthrough with explanations
- **TROUBLESHOOTING.md** - Solutions for common problems
- **KUBECTL_COMMANDS.md** - Command reference

### External Resources
- Official Kubernetes docs: https://kubernetes.io/docs/
- Docker Desktop docs: https://docs.docker.com/desktop/kubernetes/
- Spring Boot in Kubernetes: https://spring.io/guides/gs/spring-boot-docker/

## ✅ Success Checklist

After deployment, verify:
- ✅ All pods are Running (use `kubectl get pods -n gearup`)
- ✅ All pods are Ready (use `kubectl get pods -n gearup`)
- ✅ All services have ENDPOINTS (use `kubectl get svc -n gearup`)
- ✅ Can access frontend at http://localhost (via port-forward)
- ✅ Can access backend at http://localhost:8080 (via port-forward)
- ✅ Can log in to the application
- ✅ Backend can connect to database
- ✅ No errors in logs

## 🎉 You're Ready!

You now have everything needed to deploy GearUp to Kubernetes. Start with DEPLOYMENT_STEPS.md for the guided walkthrough!

---

**Last Updated**: November 2024
**Version**: 1.0
**Application**: GearUp (AutoServe)
