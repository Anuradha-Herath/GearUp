# Kubernetes Deployment - Step by Step Guide

## Phase 1: Preparation (Docker Desktop)

### Step 1.1: Enable Kubernetes in Docker Desktop

1. **Open Docker Desktop Settings**
   - Click Docker icon in system tray → Settings
   - Go to: Settings → Kubernetes
   - Check "Enable Kubernetes"
   - Click "Apply & Restart" and wait for it to start (~2 minutes)
   
2. **Verify Kubernetes is Running**
   ```powershell
   kubectl cluster-info
   kubectl get nodes
   ```
   
   Expected output:
   ```
   NAME             STATUS   ROLES           AGE   VERSION
   docker-desktop   Ready    control-plane   1m    v1.x.x
   ```

### Step 1.2: Build Docker Images

```powershell
# Navigate to project root
cd "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp"

# Build Backend Image
docker build -f docker/backend.Dockerfile -t gearup/backend:latest .

# Build Frontend Image
docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .

# Verify images are built
docker images | findstr gearup
```

Expected output:
```
gearup/backend    latest    abc123...    10 minutes ago    500MB
gearup/frontend   latest    def456...    5 minutes ago     150MB
```

### Step 1.3: Create Environment Secrets File

Before deploying, you need to prepare your secrets. Create a temporary file with your credentials:

```powershell
# Create a file: secrets-values.txt (KEEP THIS SAFE - DO NOT COMMIT TO GIT)
$secretsContent = @"
DB_ROOT_PASSWORD=root_password_here
DB_USER=gearup_user
DB_PASSWORD=database_password_here
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
GEMINI_API_KEY=your-gemini-api-key
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@gearup.com
FRONTEND_BASE_URL=http://localhost
"@

$secretsContent | Out-File -Encoding UTF8 "secrets-values.txt"
```

---

## Phase 2: Prepare Kubernetes Manifests

### Step 2.1: Update Secrets Manifest

You need to convert your secrets to base64 encoding. In PowerShell:

```powershell
# Function to encode to base64
function ConvertTo-Base64 {
    param([string]$String)
    [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($String))
}

# Example conversions (use your actual values)
$dbPassword = ConvertTo-Base64 "your-db-password"
$jwtSecret = ConvertTo-Base64 "your-jwt-secret-key-minimum-32-characters"
$geminiKey = ConvertTo-Base64 "your-gemini-api-key"
$sendgridKey = ConvertTo-Base64 "your-sendgrid-key"

# Print for copy-paste into 3-secrets.yaml
Write-Host "DB_PASSWORD (base64): $dbPassword"
Write-Host "JWT_SECRET (base64): $jwtSecret"
Write-Host "GEMINI_API_KEY (base64): $geminiKey"
Write-Host "SENDGRID_API_KEY (base64): $sendgridKey"
```

Then update `3-secrets.yaml` with these base64-encoded values.

### Step 2.2: Customize Manifests for Your Environment

Edit each manifest file to match your setup:

1. **2-configmap.yaml**
   - Update `DB_NAME` if different from "gearup"
   - Update `FRONTEND_BASE_URL` to your actual URL

2. **3-secrets.yaml**
   - Add base64-encoded secrets from Step 2.1
   - Keep this file PRIVATE - never commit to git

3. **Other manifests**
   - Keep defaults unless you have specific requirements

---

## Phase 3: Deploy to Kubernetes

### Step 3.1: Create Namespace and Initial Resources

```powershell
# Navigate to k8s directory
cd "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp\k8s"

# Create namespace
kubectl apply -f 1-namespace.yaml

# Verify namespace created
kubectl get namespaces | findstr gearup
```

### Step 3.2: Deploy Configuration and Secrets

```powershell
# Apply ConfigMap
kubectl apply -f 2-configmap.yaml

# Apply Secrets
kubectl apply -f 3-secrets.yaml

# Verify
kubectl get configmaps -n gearup
kubectl get secrets -n gearup
```

### Step 3.3: Deploy Database (MySQL)

```powershell
# Create storage for database
kubectl apply -f 4-mysql-pvc.yaml

# Deploy MySQL
kubectl apply -f 5-mysql-deployment.yaml

# Create MySQL service
kubectl apply -f 6-mysql-service.yaml

# Wait for MySQL to be ready (should see 1/1 Ready)
kubectl get pods -n gearup -l app=mysql -w

# Check logs if needed
kubectl logs -n gearup -l app=mysql
```

**Expected**: After 30-60 seconds, MySQL pod should be RUNNING and READY.

### Step 3.4: Deploy Backend (Spring Boot)

```powershell
# Deploy backend
kubectl apply -f 7-backend-deployment.yaml

# Create backend service
kubectl apply -f 8-backend-service.yaml

# Wait for backend to be ready
kubectl get pods -n gearup -l app=backend -w

# Check logs
kubectl logs -n gearup -l app=backend --tail=50
```

**Expected**: Backend pod should be RUNNING after 1-2 minutes (Spring Boot startup time).

### Step 3.5: Deploy Frontend (React + Nginx)

```powershell
# Deploy frontend
kubectl apply -f 9-frontend-deployment.yaml

# Create frontend service
kubectl apply -f 10-frontend-service.yaml

# Wait for frontend to be ready
kubectl get pods -n gearup -l app=frontend -w

# Check logs
kubectl logs -n gearup -l app=frontend --tail=50
```

**Expected**: Frontend pod should be RUNNING after 30 seconds.

---

## Phase 4: Verification & Access

### Step 4.1: Verify All Resources

```powershell
# Check all deployments
kubectl get deployments -n gearup

# Check all pods
kubectl get pods -n gearup

# Check all services
kubectl get services -n gearup

# Expected output should show:
# - 1 mysql pod (1/1 Ready)
# - 1 backend pod (1/1 Ready)
# - 1 frontend pod (1/1 Ready)
# - 3 services (mysql, backend, frontend)
```

### Step 4.2: Access the Application

**Option A: Using Port-Forward (Easiest for Local Development)**

```powershell
# In one PowerShell window - access backend
kubectl port-forward -n gearup svc/backend 8080:8080
# Access at: http://localhost:8080

# In another PowerShell window - access frontend
kubectl port-forward -n gearup svc/frontend 80:80
# Access at: http://localhost

# In another window - access database
kubectl port-forward -n gearup svc/mysql 3306:3306
# Access via MySQL client at localhost:3306
```

**Option B: Using NodePort (Direct Access)**

```powershell
# Get service details
kubectl get svc -n gearup

# Frontend NodePort:
# If NodePort is 30000, access at: http://localhost:30000

# Backend NodePort:
# If NodePort is 30001, access at: http://localhost:30001/api
```

### Step 4.3: Test the Application

```powershell
# Test backend API
curl http://localhost:8080/api/health

# Expected: 200 OK response

# Test frontend
# Open browser and go to http://localhost
# Expected: GearUp application loads
```

---

## Phase 5: Troubleshooting

### Problem: Pod is not starting or restarting repeatedly

```powershell
# Describe the pod to see events
kubectl describe pod <pod-name> -n gearup

# Check logs
kubectl logs <pod-name> -n gearup

# Common causes:
# - Image not found: Build and tag images correctly
# - Secret/ConfigMap not found: Verify they exist
# - Resource limits exceeded: Check available resources
```

### Problem: Backend cannot connect to database

```powershell
# Check MySQL pod is running
kubectl get pods -n gearup -l app=mysql

# Check MySQL logs
kubectl logs -n gearup -l app=mysql

# Test connection from backend pod
kubectl exec -it <backend-pod> -n gearup -- /bin/sh
# Inside pod: curl mysql:3306

# Check environment variables in backend
kubectl exec -it <backend-pod> -n gearup -- env | findstr DATABASE
```

### Problem: Frontend cannot reach backend

```powershell
# Check backend service DNS
kubectl exec -it <frontend-pod> -n gearup -- /bin/sh
# Inside pod: ping backend
# Inside pod: curl http://backend:8080/api/health

# Check frontend nginx config
kubectl logs -n gearup -l app=frontend

# Update frontend to use correct backend URL in nginx config
```

### Problem: Service not accessible

```powershell
# Check service status
kubectl get svc -n gearup <service-name>

# Check endpoints
kubectl get endpoints -n gearup <service-name>

# Should show IP addresses; if empty, pods might not be ready

# Check selectors match pods
kubectl get pods -n gearup --show-labels
```

---

## Phase 6: Cleanup

### To stop everything but keep configuration:

```powershell
# Delete all deployments (keeps namespace, configmaps, secrets)
kubectl delete deployments -n gearup --all
kubectl delete services -n gearup --all
kubectl delete pvc -n gearup --all
```

### To completely remove everything:

```powershell
# Delete entire namespace (removes everything in it)
kubectl delete namespace gearup

# Verify namespace is deleted
kubectl get namespaces
```

### To disable Kubernetes in Docker Desktop:

```powershell
# Settings → Kubernetes → Uncheck "Enable Kubernetes"
# or keep it enabled for next deployment
```

---

## Useful Commands Reference

```powershell
# Watch resources in real-time
kubectl get pods -n gearup -w

# Stream logs from a pod
kubectl logs -n gearup <pod-name> -f

# Get detailed pod information
kubectl describe pod <pod-name> -n gearup

# Execute command in pod
kubectl exec -it <pod-name> -n gearup -- <command>

# Port forward to access service
kubectl port-forward -n gearup svc/<service-name> <local-port>:<service-port>

# Get all resources in namespace
kubectl get all -n gearup

# Delete a specific resource
kubectl delete pod <pod-name> -n gearup

# Apply/update resource from file
kubectl apply -f filename.yaml

# View manifest of running resource
kubectl get <resource> <name> -n gearup -o yaml
```

---

## Next Steps

1. ✅ Follow all deployment phases above
2. ✅ Verify application is accessible
3. ✅ Test all features (login, appointments, services)
4. ✅ Check logs for any errors
5. ⏭️ (Optional) Set up Ingress for production-like access
6. ⏭️ (Optional) Configure persistent volumes for production
7. ⏭️ (Optional) Set up monitoring and logging

---

## Success Criteria

After deployment, you should be able to:

- ✅ Access frontend at http://localhost (via port-forward)
- ✅ Access backend API at http://localhost:8080 (via port-forward)
- ✅ Log in to the application
- ✅ See real-time data from database
- ✅ All pods are in Running/Ready state
- ✅ No error logs in any pod

Congratulations! Your GearUp application is running on Kubernetes! 🎉
