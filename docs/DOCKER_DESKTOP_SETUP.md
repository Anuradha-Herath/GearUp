# Docker Desktop Setup Checklist for Kubernetes

## Step 1: Verify Docker Desktop Installation

### Windows 11/10
```powershell
# Check Docker Desktop version
docker --version
docker run hello-world
```

**Expected Output:**
```
Docker version 24.0.0 (or newer)
Hello from Docker!
```

If not installed, download from: https://www.docker.com/products/docker-desktop

---

## Step 2: Configure Docker Desktop Resources

### Important: Allocate Enough Resources

1. **Open Docker Desktop Settings**
   - Right-click Docker icon in system tray
   - Select "Settings" (gear icon)
   - Or: Docker Desktop window → Preferences

2. **Go to: Settings → Resources**

3. **Set the following minimum values:**
   - **CPUs**: 4 (minimum)
   - **Memory**: 4GB (minimum) - 8GB recommended
   - **Disk image size**: 100GB (or more)
   - **Swap**: 1GB

   ```
   Current settings shown:
   ├─ CPUs: [████░░░░] 4/8
   ├─ Memory: [█████░░░░░] 4GB/16GB
   ├─ Disk image size: [██████████] 50GB
   └─ Swap: 1GB
   ```

4. **Click "Apply & Restart"**

### Check Configuration
```powershell
docker system df
docker info | Select-String "Memory\|CPUs\|Kernel"
```

---

## Step 3: Enable Kubernetes

### Enable Kubernetes in Docker Desktop

1. **Open Docker Desktop Settings**
   - Settings (gear icon)

2. **Go to: Settings → Kubernetes**

3. **Enable Kubernetes**
   - ☑ Check "Enable Kubernetes"
   - Leave "Show system containers (advanced)" unchecked
   - Leave "Deploy Docker Stacks to Kubernetes by default" unchecked

4. **Click "Apply & Restart"**
   - Docker Desktop will restart (~2-3 minutes)
   - You'll see "Kubernetes is starting..." in the Kubernetes tab
   - Wait for "Kubernetes is running" message

### Wait for Kubernetes to Start
```powershell
# Watch status (you can check while it starts)
# Keep running until you see "Kubernetes is running"

# Expected output during startup:
# - Creating kubernetes cluster
# - Starting kubelets
# - Waiting for cluster to stabilize
# ... (takes 2-3 minutes)
# - Kubernetes is running
```

### Verify Kubernetes is Running
```powershell
# Test kubectl connection
kubectl cluster-info

# Expected output:
# Kubernetes control plane is running at https://127.0.0.1:6443
# CoreDNS is running at ...
# To further debug, use 'kubectl cluster-info dump'
```

---

## Step 4: Verify kubectl Installation

### kubectl is Usually Included
```powershell
# Check kubectl version
kubectl version --client --short

# Expected output:
# Client Version: v1.x.x

# If not found, install separately
# See: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
```

### Configure kubectl Context
```powershell
# See available contexts
kubectl config get-contexts

# Should show:
# CURRENT   NAME             CLUSTER          AUTHINFO         NAMESPACE
# *         docker-desktop   docker-desktop   docker-desktop

# If docker-desktop is not default, set it:
kubectl config use-context docker-desktop
```

---

## Step 5: Test Kubernetes Setup

### Deploy Test Application
```powershell
# Create namespace
kubectl create namespace test

# Deploy nginx test
kubectl create deployment nginx --image=nginx -n test
kubectl expose deployment nginx --port=80 --type=NodePort -n test

# Check pods
kubectl get pods -n test

# Should show:
# NAME                     READY   STATUS    RESTARTS   AGE
# nginx-7854ff8877-xxxxx   1/1     Running   0          10s

# Access the test app
$port = kubectl get svc nginx -n test -o jsonpath='{.spec.ports[0].nodePort}'
Write-Host "Nginx running at http://localhost:$port"

# Cleanup test
kubectl delete namespace test
```

---

## Step 6: Prepare System Disk Space

### Verify Sufficient Disk Space
```powershell
# Check available space
Get-Volume | Where-Object { $_.DriveLetter -eq 'C' } | 
    Select-Object DriveLetter, Size, SizeRemaining | 
    Format-Table

# Expected: At least 20GB free for image building
```

### If Low on Space
```powershell
# Clean up old Docker images
docker system prune -a --volumes

# This removes:
# - Stopped containers
# - Unused networks
# - Dangling volumes
# - Unused images

# Note: You'll be asked to confirm
```

---

## Step 7: Build Docker Images for GearUp

### Build Backend Image
```powershell
# Navigate to project root
cd "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp"

# Build backend
docker build -f docker/backend.Dockerfile -t gearup/backend:latest .

# Expected output:
# [+] Building 5m32s (18/18) FINISHED
# => => naming to docker.io/library/gearup/backend:latest
```

### Build Frontend Image
```powershell
# Build frontend
docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .

# Expected output:
# [+] Building 1m24s (15/15) FINISHED
# => => naming to docker.io/library/gearup/frontend:latest
```

### Verify Images
```powershell
# List built images
docker images | Select-String "gearup"

# Expected output:
# REPOSITORY           TAG       IMAGE ID      CREATED       SIZE
# gearup/backend       latest    abc123def...  2 minutes     500MB
# gearup/frontend      latest    def456abc...  1 minute      150MB
```

### Test Images Locally (Optional)
```powershell
# Test backend image
docker run --rm -p 8080:8080 -e DATABASE_URL=jdbc:mysql://localhost:3306/gearup gearup/backend:latest

# Test frontend image
docker run --rm -p 80:80 gearup/frontend:latest

# Access at http://localhost (frontend) or http://localhost:8080 (backend)
```

---

## Step 8: Final Verification Checklist

Run this PowerShell script to verify everything:

```powershell
# Create verification script

$checks = @(
    ("Docker installed", { docker --version }),
    ("Kubernetes enabled", { kubectl cluster-info }),
    ("kubectl working", { kubectl get nodes }),
    ("Docker context", { kubectl config current-context }),
    ("Backend image", { docker images | Select-String "gearup/backend" }),
    ("Frontend image", { docker images | Select-String "gearup/frontend" })
)

Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Docker Desktop Setup Verification" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan

$passed = 0
$failed = 0

foreach ($check in $checks) {
    $name = $check[0]
    $command = $check[1]
    
    try {
        & $command | Out-Null
        Write-Host "✓ $name" -ForegroundColor Green
        $passed++
    } catch {
        Write-Host "✗ $name" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
}

Write-Host ""
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host "`n✓ All checks passed! Ready to deploy!" -ForegroundColor Green
} else {
    Write-Host "`n✗ Fix errors above and try again" -ForegroundColor Red
}
```

---

## Common Docker Desktop Issues

### Issue: "Kubernetes is not running"

**Causes:**
- Not enough disk space
- Not enough memory allocated
- WSL 2 backend issues (Windows)

**Solutions:**
1. Allocate more resources (see Step 2)
2. Restart Docker Desktop
3. Restart your computer

### Issue: "Cannot pull images"

**Solutions:**
1. Check internet connection
2. Restart Docker Desktop
3. Clear Docker cache: `docker system prune`

### Issue: "Port already in use"

**Solutions:**
```powershell
# Find what's using the port
Get-NetTCPConnection -LocalPort 3306

# Stop the process or use different port
kubectl port-forward -n gearup svc/mysql 3307:3306
# Now access at localhost:3307
```

### Issue: "Out of disk space during build"

**Solutions:**
```powershell
# Clean up Docker
docker system prune -a

# Or increase Docker disk limit in Settings → Resources
```

---

## System Monitoring While Running

### Monitor Docker Resources
```powershell
# Real-time stats
docker stats

# Or check Docker Desktop in Settings → Resources
# You'll see CPU, Memory, and Disk usage
```

### Monitor Kubernetes Resources
```powershell
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n gearup

# Note: Metrics might take 1 minute to be available after startup
```

---

## Ready for Kubernetes Deployment!

Once you've completed all steps above:

1. ✅ Docker Desktop installed and running
2. ✅ Kubernetes enabled and running
3. ✅ kubectl working and connected
4. ✅ Docker images built
5. ✅ Sufficient resources allocated

**Next:** Follow `DEPLOYMENT_STEPS.md` to deploy to Kubernetes!

---

## Helpful Commands

```powershell
# Start Docker Desktop
Start-Service com.docker.service

# Stop Docker Desktop
Stop-Service com.docker.service

# Restart Docker
Restart-Service com.docker.service

# Check Docker status
Get-Service com.docker.service

# Open Docker Desktop settings
explorer shell:appsFolder\Docker.DockerDesktop_cv1g1gkbsb6cd

# Enable WSL 2 (recommended backend for Windows)
wsl --set-default-version 2
wsl --list -v
```

---

## Next Steps

After completing this checklist:

1. Read `SETUP_SUMMARY.md` for architecture overview
2. Follow `DEPLOYMENT_STEPS.md` for step-by-step deployment
3. Use `KUBECTL_COMMANDS.md` as reference
4. Check `TROUBLESHOOTING.md` if issues arise

**Happy Deploying! 🚀**
