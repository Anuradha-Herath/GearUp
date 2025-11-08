# 🔧 Kubernetes API Connection Fix

## Problem Summary
After deploying to Kubernetes, login and API calls were failing with:
```
Cannot connect to server. Please make sure the backend is running on http://localhost:8080
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

## Root Causes Identified

### 1. **Hardcoded localhost URLs in Frontend Components** ❌
Two components were using hardcoded `http://localhost:8080` instead of using the environment variable:

- `frontend/src/pages/employee/Services.jsx`
- `frontend/src/pages/customer/Services.jsx`

**Issue**: In Kubernetes, `localhost` refers to the frontend pod itself, NOT the backend service. The backend is on a different pod and must be accessed via the Kubernetes service DNS name.

### 2. **Incorrect Database Connection in Backend Deployment** ❌
The backend deployment was configured to connect to:
```
jdbc:mysql://host.docker.internal:3307/gearup
```

**Issue**: `host.docker.internal` is a Docker Desktop feature that doesn't exist in Kubernetes clusters. The MySQL service DNS should be used instead.

## Fixes Applied

### Fix 1: Frontend Component URLs ✅

**File**: `frontend/src/pages/employee/Services.jsx`
```javascript
// BEFORE (hardcoded)
const response = await fetch('http://localhost:8080/api/employee/services', { ... });

// AFTER (uses environment variable)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const response = await fetch(`${API_BASE_URL}/employee/services`, { ... });
```

**File**: `frontend/src/pages/customer/Services.jsx`
```javascript
// BEFORE (hardcoded)
const response = await fetch('http://localhost:8080/api/customer/services', { ... });

// AFTER (uses environment variable)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const response = await fetch(`${API_BASE_URL}/customer/services`, { ... });
```

### Fix 2: Backend Database Connection ✅

**File**: `k8s/7-backend-deployment.yaml`
```yaml
# BEFORE (incorrect for Kubernetes)
- name: DATABASE_URL
  value: "jdbc:mysql://host.docker.internal:3307/gearup?useSSL=false&..."

# AFTER (uses Kubernetes service DNS)
- name: DATABASE_URL
  value: "jdbc:mysql://mysql:3306/gearup?useSSL=false&..."
```

## How It Works Now

### Frontend-to-Backend Communication
```
1. Frontend loads from: http://localhost:30080 (NodePort)
   └─ Contains: VITE_API_BASE_URL=http://backend:8080/api

2. User tries to login
   └─ Frontend makes fetch: http://backend:8080/api/auth/login

3. Kubernetes DNS resolution
   └─ Service 'backend' → IP 10.101.70.218 (or similar)
   └─ Routes to Backend Service
   └─ Routes to Backend Pod on port 8080 ✅

4. Backend processes request
   └─ Successfully responds
```

### Backend-to-Database Communication
```
1. Backend starts up
   └─ Reads: DATABASE_URL=jdbc:mysql://mysql:3306/gearup

2. Kubernetes DNS resolution
   └─ Service 'mysql' → IP (e.g., 10.105.x.x)
   └─ Routes to MySQL Service
   └─ Routes to MySQL Pod on port 3306 ✅

3. Database connection established
```

## Kubernetes Service Discovery

When you deploy services in Kubernetes with namespace `gearup`:

| Service | DNS Name | Port | Access From |
|---------|----------|------|-------------|
| **backend** | `backend.gearup.svc.cluster.local` | 8080 | frontend pod, external via NodePort 30080 |
| **mysql** | `mysql.gearup.svc.cluster.local` | 3306 | backend pod |
| **frontend** | `frontend.gearup.svc.cluster.local` | 80 | external via NodePort 30000 |

Within the same namespace, you can use short names:
- `backend:8080` (from frontend pod)
- `mysql:3306` (from backend pod)

## Testing the Fix

### 1. Rebuild Frontend Docker Image
```powershell
cd docker
docker build -t gearup/frontend:latest -f frontend.Dockerfile ..
```

### 2. Redeploy to Kubernetes
```powershell
cd k8s
kubectl apply -f .
# or use your deployment script
./deploy.ps1
```

### 3. Verify Connections
```powershell
# Check backend logs for database connection
kubectl logs -n gearup deployment/backend

# Check frontend logs
kubectl logs -n gearup deployment/frontend

# Test login endpoint
$response = Invoke-WebRequest -Uri 'http://localhost:30080' -UseBasicParsing
$response.StatusCode  # Should be 200
```

### 4. Try Login
1. Open browser: `http://localhost:30000`
2. Go to login page
3. Attempt login - should now work! ✅

## Environment Variable Usage

The `.env` file correctly specifies:
```env
VITE_API_BASE_URL=http://backend:8080/api
```

**Key Points**:
- ✅ This is used during Docker build (`npm run build`)
- ✅ Embedded in the React bundle
- ✅ Works both locally (with `http://backend:8080`) and from browsers
- ✅ The Docker Compose file maps `backend` hostname to the backend service

## Summary of Changes

| File | Change | Reason |
|------|--------|--------|
| `frontend/src/pages/employee/Services.jsx` | Use `API_BASE_URL` variable | Support Kubernetes service DNS |
| `frontend/src/pages/customer/Services.jsx` | Use `API_BASE_URL` variable | Support Kubernetes service DNS |
| `k8s/7-backend-deployment.yaml` | Change DB URL from `host.docker.internal:3307` to `mysql:3306` | Correct Kubernetes service DNS |

## Status
✅ **All fixes applied and ready for deployment**

Your application should now work correctly in Kubernetes with proper service-to-service communication!

---

**Next Steps**:
1. Rebuild the frontend Docker image
2. Redeploy to Kubernetes using `kubectl apply -f k8s/`
3. Test login functionality
4. If issues persist, check logs: `kubectl logs -n gearup deployment/backend` and `kubectl logs -n gearup deployment/frontend`
