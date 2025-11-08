# Kubernetes Deployment - Complete Troubleshooting Guide

## Understanding Kubernetes Concepts

### Key Components
1. **Namespace** - Isolated environment for your application
2. **ConfigMap** - Non-sensitive configuration data
3. **Secret** - Sensitive data (passwords, API keys)
4. **PersistentVolumeClaim (PVC)** - Storage for databases
5. **Deployment** - Manages pod replicas and updates
6. **Pod** - Smallest unit, contains container(s)
7. **Service** - Stable network endpoint for pods
8. **Ingress** - External HTTP/HTTPS routing (optional)

---

## Common Issues & Solutions

### Issue 1: Kubernetes Not Enabled

**Symptom:**
```
error: the server was unable to complete your request: 
Unexpected error: Error during WebSocket handshake
```

**Solution:**
1. Open Docker Desktop
2. Go to Settings → Kubernetes
3. Check "Enable Kubernetes"
4. Click "Apply & Restart"
5. Wait 2-3 minutes for Kubernetes to start
6. Verify: `kubectl cluster-info`

---

### Issue 2: Docker Images Not Found

**Symptom:**
```
Pod is stuck in ImagePullBackOff or ErrImagePull
```

**Debug:**
```powershell
# Check pod status
kubectl describe pod <pod-name> -n gearup

# Look for "Failed to pull image" message
```

**Solution:**
```powershell
# Build images
docker build -f docker/backend.Dockerfile -t gearup/backend:latest .
docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .

# Verify images exist
docker images | Select-String gearup

# If using imagePullPolicy: Always, either:
# Option 1: Change to IfNotPresent in deployments
# Option 2: Push images to Docker Hub
```

---

### Issue 3: Pod Stuck in Pending

**Symptom:**
```
STATUS: Pending
```

**Debug:**
```powershell
kubectl describe pod <pod-name> -n gearup
# Look at "Events" section at the bottom
```

**Common Causes:**

#### Insufficient Resources
```powershell
# Check node resources
kubectl top nodes
kubectl describe node docker-desktop

# Solution: Free up resources on your machine or reduce resource requests
```

#### Persistent Volume Not Available
```powershell
kubectl get pvc -n gearup
kubectl describe pvc mysql-pvc -n gearup

# Solution: Ensure disk space available on your machine (at least 10GB free)
```

---

### Issue 4: Pod Stuck in CrashLoopBackOff

**Symptom:**
```
Pod repeatedly crashes and restarts
```

**Debug:**
```powershell
# Check logs
kubectl logs <pod-name> -n gearup

# Check previous logs (before crash)
kubectl logs <pod-name> -n gearup --previous

# Describe pod for events
kubectl describe pod <pod-name> -n gearup
```

**Common Causes:**

#### Backend Can't Connect to Database
```
DATABASE_URL not set correctly
Database not ready yet
Database credentials wrong
```

**Solution:**
```powershell
# Check backend logs
kubectl logs -n gearup -l app=backend

# Verify MySQL is running
kubectl get pods -n gearup -l app=mysql

# Check MySQL logs
kubectl logs -n gearup -l app=mysql

# Verify secrets exist
kubectl get secrets -n gearup gearup-secrets -o yaml
```

#### Frontend Nginx Error
```
Unable to bind to port
Invalid configuration
```

**Solution:**
```powershell
# Check frontend logs
kubectl logs -n gearup -l app=frontend

# Try restarting
kubectl rollout restart deployment/frontend -n gearup
```

---

### Issue 5: Service Not Accessible

**Symptom:**
```
Can't connect to http://localhost:8080 or http://localhost
```

**Debug:**
```powershell
# Check services exist
kubectl get svc -n gearup

# Check endpoints (should show pod IPs)
kubectl get endpoints -n gearup

# Check pod logs
kubectl logs -n gearup -l app=backend

# Check if pods are actually running
kubectl get pods -n gearup
```

**Solution:**

#### Using NodePort
```powershell
# Get NodePort
kubectl get svc -n gearup frontend

# Frontend NodePort should be 30000, access at:
# http://localhost:30000

# Backend NodePort should be 30080, access at:
# http://localhost:30080
```

#### Using Port Forward
```powershell
# Open new PowerShell windows for each service

# Window 1: Frontend
kubectl port-forward -n gearup svc/frontend 80:80

# Window 2: Backend
kubectl port-forward -n gearup svc/backend 8080:8080

# Window 3: Database
kubectl port-forward -n gearup svc/mysql 3306:3306

# Now access at http://localhost and http://localhost:8080
```

---

### Issue 6: Environment Variables Not Set

**Symptom:**
```
NullPointerException in backend
Database connection fails
JWT secret not found
```

**Debug:**
```powershell
# Check ConfigMap
kubectl get configmap -n gearup gearup-config -o yaml

# Check Secrets
kubectl get secret -n gearup gearup-secrets -o yaml

# Check pod environment
kubectl exec -it <backend-pod> -n gearup -- env | Select-String DATABASE
```

**Solution:**

#### Update ConfigMap
```powershell
# Edit ConfigMap
kubectl edit configmap gearup-config -n gearup

# Or delete and recreate
kubectl delete configmap gearup-config -n gearup
kubectl apply -f 2-configmap.yaml
```

#### Update Secrets
```powershell
# Generate new secrets
# Update 3-secrets.yaml with base64 encoded values

# Delete and recreate
kubectl delete secret gearup-secrets -n gearup
kubectl apply -f 3-secrets.yaml

# Restart pods to pick up new secrets
kubectl rollout restart deployment/backend -n gearup
kubectl rollout restart deployment/frontend -n gearup
```

---

### Issue 7: Database Connection Issues

**Symptom:**
```
Can't connect to database
Connection refused
Authentication failed
```

**Debug:**

#### Test MySQL Connection
```powershell
# Get MySQL pod name
$mysqlPod = kubectl get pods -n gearup -l app=mysql -o jsonpath='{.items[0].metadata.name}'

# Connect to pod
kubectl exec -it $mysqlPod -n gearup -- /bin/bash

# Inside pod:
mysql -u gearup_user -p gearup
# Enter password from secrets

# Verify tables exist
show tables;
```

#### Test from Backend Pod
```powershell
# Get backend pod name
$backendPod = kubectl get pods -n gearup -l app=backend -o jsonpath='{.items[0].metadata.name}'

# Test DNS
kubectl exec $backendPod -n gearup -- nslookup mysql

# Test connection
kubectl exec $backendPod -n gearup -- curl http://mysql:3306
```

**Solution:**

#### Fix Database Credentials
```powershell
# Update 3-secrets.yaml
# Make sure DB_USER and DB_PASSWORD match

# Recreate secrets
kubectl delete secret gearup-secrets -n gearup
kubectl apply -f 3-secrets.yaml

# Restart backend
kubectl rollout restart deployment/backend -n gearup
```

#### Ensure MySQL is Ready
```powershell
# Check MySQL pod
kubectl describe pod -n gearup -l app=mysql

# Check MySQL logs
kubectl logs -n gearup -l app=mysql --tail=50

# Verify it's listening
kubectl exec -it <mysql-pod> -n gearup -- netstat -an | grep 3306
```

---

### Issue 8: Frontend Can't Reach Backend

**Symptom:**
```
API errors in browser console
503 Service Unavailable
```

**Debug:**

#### Test Backend from Frontend
```powershell
# Get frontend pod
$frontendPod = kubectl get pods -n gearup -l app=frontend -o jsonpath='{.items[0].metadata.name}'

# Test DNS
kubectl exec $frontendPod -n gearup -- nslookup backend

# Test connection
kubectl exec $frontendPod -n gearup -- curl http://backend:8080/api/health
```

**Solution:**

#### Update Backend URL in Frontend
Frontend should call: `http://backend:8080` (not localhost)

This might be hardcoded or in environment. Check:
- `frontend/src/services/api.js` or similar
- Frontend build configuration
- Nginx configuration

#### Verify Backend is Ready
```powershell
# Check backend pod logs
kubectl logs -n gearup -l app=backend --tail=50

# Verify it's listening on port 8080
kubectl exec <backend-pod> -n gearup -- netstat -an | grep 8080
```

---

### Issue 9: Storage/PVC Issues

**Symptom:**
```
PVC stuck in Pending
PersistentVolume not found
```

**Debug:**
```powershell
# Check PVC status
kubectl get pvc -n gearup

# Describe PVC
kubectl describe pvc mysql-pvc -n gearup

# Check PV status
kubectl get pv
```

**Solution:**

#### For Docker Desktop
```powershell
# Docker Desktop uses local storage, should work automatically

# If stuck, delete and recreate
kubectl delete pvc mysql-pvc -n gearup
kubectl apply -f 4-mysql-pvc.yaml

# Or delete everything and redeploy
kubectl delete namespace gearup
# Then redeploy
```

---

## Diagnostic Commands

### Check Overall Health
```powershell
# Full system status
kubectl get all -n gearup

# Detailed pod info
kubectl describe pods -n gearup

# Pod resource usage
kubectl top pods -n gearup

# Recent events
kubectl get events -n gearup --sort-by='.lastTimestamp'
```

### Check Database
```powershell
# MySQL pod status
kubectl get pods -n gearup -l app=mysql

# MySQL pod logs
kubectl logs -n gearup -l app=mysql -f

# MySQL resource usage
kubectl top pod -n gearup -l app=mysql
```

### Check Backend
```powershell
# Backend deployment status
kubectl rollout status deployment/backend -n gearup

# Backend pod logs
kubectl logs -n gearup -l app=backend -f --tail=100

# Backend pod details
kubectl describe deployment backend -n gearup
```

### Check Frontend
```powershell
# Frontend deployment status
kubectl rollout status deployment/frontend -n gearup

# Frontend pod logs
kubectl logs -n gearup -l app=frontend -f --tail=50

# Frontend pod details
kubectl describe deployment frontend -n gearup
```

---

## Cleanup & Reset

### Restart Components
```powershell
# Restart specific deployment
kubectl rollout restart deployment/backend -n gearup

# Restart all deployments
kubectl rollout restart deployments -n gearup

# Delete and recreate pod
kubectl delete pod <pod-name> -n gearup
```

### Full Reset
```powershell
# Delete entire namespace (removes everything)
kubectl delete namespace gearup

# Wait for deletion to complete
kubectl get namespaces -w

# Redeploy everything
# Follow DEPLOYMENT_STEPS.md
```

### Check Logs After Issue
```powershell
# All logs from namespace
kubectl logs -n gearup --all-containers=true -f

# Specific container logs
kubectl logs -n gearup <pod-name> -c <container-name>

# Previous pod logs (useful for crash debugging)
kubectl logs -n gearup <pod-name> --previous
```

---

## Performance Troubleshooting

### Slow Application
```powershell
# Check resource usage
kubectl top pods -n gearup

# Check if pods are getting killed for using too much
kubectl describe pod <pod-name> -n gearup
# Look for "OOMKilled" or "OutOfMemory"

# Check database query performance
# Connect to MySQL and run EXPLAIN ANALYZE
```

### Solution
```powershell
# Increase resource limits in deployment yaml
# For backend, edit 7-backend-deployment.yaml
# For frontend, edit 9-frontend-deployment.yaml
# For MySQL, edit 5-mysql-deployment.yaml

# Apply changes
kubectl apply -f <updated-file>.yaml

# Or patch directly
kubectl patch deployment backend -n gearup -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"backend","resources":{"limits":{"memory":"2Gi"}}}]}}}}'
```

---

## Quick Reference

| Issue | Command | Note |
|-------|---------|------|
| Check cluster | `kubectl cluster-info` | Should show running cluster |
| Check pods | `kubectl get pods -n gearup` | All should be Running/Ready |
| Check services | `kubectl get svc -n gearup` | Should have 3 services |
| Check logs | `kubectl logs -n gearup -l app=backend -f` | Replace 'backend' with others |
| Connect to pod | `kubectl exec -it <pod> -n gearup -- /bin/bash` | Interactive shell |
| Port forward | `kubectl port-forward svc/frontend 80:80 -n gearup` | Access in browser |
| Full cleanup | `kubectl delete namespace gearup` | Removes everything |

---

## Getting Help

### Check Official Documentation
- Kubernetes: https://kubernetes.io/docs/
- Docker Desktop: https://docs.docker.com/desktop/kubernetes/

### Enable Debug Logging
```powershell
# More verbose kubectl output
kubectl get pods -n gearup -v=8

# Check API server logs
kubectl logs -n kube-system -l component=kube-apiserver
```

### Common Commands for Investigation
```powershell
# View pod YAML
kubectl get pod <name> -n gearup -o yaml

# View deployment YAML
kubectl get deployment backend -n gearup -o yaml

# Export current state
kubectl get all -n gearup -o yaml > backup.yaml
```

Remember: Most Kubernetes issues are related to:
1. Images not found or incorrect
2. Secrets/ConfigMaps not properly set
3. Database not ready when pods start
4. Resource constraints
5. Networking issues between pods

Check logs first, then verify configuration!
