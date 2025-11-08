# Frontend API Connection Fix - DNS Resolution Error

## Problem

You were getting these errors after deployment:
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
POST http://backend:8080/api/auth/signup net::ERR_NAME_NOT_RESOLVED
```

## Root Cause Analysis

### Why This Happened

1. **Frontend `.env` had**: `VITE_API_BASE_URL=http://backend:8080/api`
2. **The issue**: The frontend is a **browser-based React app** - JavaScript runs in the **user's browser**, NOT in a Kubernetes container
3. **The browser cannot resolve `backend`** because:
   - `backend` is a Kubernetes Service DNS name (e.g., `backend.gearup.svc.cluster.local`)
   - DNS names only work inside the Kubernetes cluster
   - The browser is outside the cluster and cannot reach the internal DNS

### Architecture Diagram

```
Browser (Your Machine)
    ↓
    ✗ Cannot resolve "backend" (Kubernetes internal DNS)
    
Kubernetes Cluster
    ├── Frontend Pod (Nginx/Apache serving static HTML/JS)
    │   └── JavaScript runs in browser, tries to reach API
    │
    ├── Backend Service (Internal DNS: backend:8080)
    │   └── NodePort: 30080 ← This is accessible from outside!
    │
    └── Backend Pod (Spring Boot API)
```

## Solution Implemented

### Changed Frontend Configuration

**Old (Broken)**:
```env
VITE_API_BASE_URL=http://backend:8080/api
```

**New (Fixed)**:
```env
VITE_API_BASE_URL=http://localhost:30080/api
```

### Why This Works

1. **NodePort 30080** is exposed on your machine by Kubernetes
2. The browser can now reach `localhost:30080` successfully
3. Kubernetes routes traffic from `localhost:30080` → Backend Service → Backend Pod

### Changes Made

1. ✅ Updated `frontend/.env`:
   - Changed API URL from `http://backend:8080/api` to `http://localhost:30080/api`

2. ✅ Rebuilt frontend Docker image:
   ```bash
   docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .
   ```

3. ✅ Restarted frontend deployment:
   ```bash
   kubectl -n gearup rollout restart deployment frontend
   ```

## Testing the Fix

### Verify the Frontend Can Now Call the API

```bash
# Check frontend pod is running with new image
kubectl -n gearup get pods -l app=frontend

# Check backend service NodePort
kubectl -n gearup get svc backend

# Expected output:
# NAME      TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
# backend   NodePort   10.101.70.218   <none>        8080:30080/TCP   6h
```

### Test from Your Browser

1. Open: `http://localhost:30000` (Frontend)
2. Try to login or signup
3. Check browser console (F12) for the API calls
4. Should see successful requests to `http://localhost:30080/api/...`

## Important Notes

### For Docker Desktop with Kubernetes

- **Localhost works** because Docker Desktop runs Kubernetes on your machine
- NodePort services are accessible at `localhost:<nodeport>`

### For Remote Kubernetes Clusters

If deploying to a remote cluster, update the `.env` file:

```env
# For remote cluster, use cluster IP or hostname
VITE_API_BASE_URL=http://<your-cluster-ip>:30080/api
# Or for a domain
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

Then rebuild:
```bash
docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .
kubectl -n gearup rollout restart deployment frontend
```

### For Production with Ingress

Consider using an Ingress controller for better routing:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gearup-ingress
  namespace: gearup
spec:
  rules:
  - host: gearup.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 8080
```

Then update `.env`:
```env
VITE_API_BASE_URL=https://gearup.example.com/api
```

## Summary of Fix

| Issue | Solution |
|-------|----------|
| Browser couldn't reach backend | Changed URL from internal DNS (`backend:8080`) to exposed NodePort (`localhost:30080`) |
| Frontend built with wrong URL | Rebuilt Docker image with updated `.env` |
| Pod still using old image | Restarted deployment to pull new image |

✅ **All errors should now be resolved!**

## Current API Access Points

| Component | Access Method | URL |
|-----------|----------------|-----|
| Frontend | Browser | `http://localhost:30000` |
| Backend API (from browser) | NodePort | `http://localhost:30080` |
| Backend API (from within cluster) | Service DNS | `http://backend:8080` |
| MySQL (from within cluster) | Service DNS | `mysql.gearup.svc.cluster.local:3306` |
