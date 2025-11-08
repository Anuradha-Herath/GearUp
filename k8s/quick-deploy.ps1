#!/usr/bin/env pwsh
# ============================================================================
# Quick Deployment Script
# ============================================================================
# Simple one-liner deployment script
# Usage: .\quick-deploy.ps1
# ============================================================================

param(
    [string]$ProjectRoot = "..",
    [string]$Namespace = "gearup"
)

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   GearUp Kubernetes - Quick Deployment        ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Magenta

# Navigate to project root
Push-Location $ProjectRoot

# Build images
Write-Host "`n📦 Building Docker images..." -ForegroundColor Cyan
docker build -f docker/backend.Dockerfile -t gearup/backend:latest . 2>&1 | Write-Host
docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest . 2>&1 | Write-Host

# Change to k8s directory
cd k8s

# Deploy all manifests
Write-Host "`n🚀 Deploying to Kubernetes..." -ForegroundColor Cyan
kubectl apply -f 1-namespace.yaml
kubectl apply -f 2-configmap.yaml
kubectl apply -f 3-secrets.yaml
kubectl apply -f 4-mysql-pvc.yaml
kubectl apply -f 5-mysql-deployment.yaml
kubectl apply -f 6-mysql-service.yaml

Write-Host "`n⏳ Waiting for MySQL to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=mysql -n $Namespace --timeout=120s

kubectl apply -f 7-backend-deployment.yaml
kubectl apply -f 8-backend-service.yaml

Write-Host "`n⏳ Waiting for Backend to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=backend -n $Namespace --timeout=180s

kubectl apply -f 9-frontend-deployment.yaml
kubectl apply -f 10-frontend-service.yaml

Write-Host "`n⏳ Waiting for Frontend to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=frontend -n $Namespace --timeout=60s

# Verify
Write-Host "`n✓ Deployment Status:" -ForegroundColor Green
kubectl get all -n $Namespace

Write-Host @"

📱 Access your application:

    Port Forward (Development):
    kubectl port-forward -n gearup svc/frontend 80:80
    kubectl port-forward -n gearup svc/backend 8080:8080

    Then access:
    - Frontend: http://localhost
    - Backend:  http://localhost:8080

View Logs:
    kubectl logs -n gearup -l app=frontend -f
    kubectl logs -n gearup -l app=backend -f

For more info, see DEPLOYMENT_STEPS.md
"@ -ForegroundColor Green

Pop-Location
