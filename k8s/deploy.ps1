#!/usr/bin/env pwsh
# ============================================================================
# GearUp Kubernetes Deployment Script
# ============================================================================
# This script automates the deployment of GearUp to Kubernetes
# Usage: .\deploy.ps1 [-Step 1] [-Clean] [-Interactive]
# ============================================================================

param(
    [int]$Step = 0,                      # Which step to run (0 = all)
    [switch]$Clean = $false,             # Clean up everything first
    [switch]$Interactive = $false,       # Interactive mode
    [string]$Namespace = "gearup"
)

# Colors for output
$Colors = @{
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Cyan"
    Header = "Magenta"
}

function Write-Header {
    param([string]$Message)
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Colors.Header
    Write-Host "║ $($Message.PadRight(58)) ║" -ForegroundColor $Colors.Header
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Colors.Header
}

function Write-Status {
    param(
        [string]$Message,
        [ValidateSet("Success", "Error", "Warning", "Info")]
        [string]$Status = "Info"
    )
    $Icon = @{
        Success = "✓"
        Error = "✗"
        Warning = "⚠"
        Info = "ℹ"
    }
    Write-Host "$($Icon[$Status]) $Message" -ForegroundColor $Colors[$Status]
}

# ============================================================================
# Phase 1: Check Prerequisites
# ============================================================================
function Check-Prerequisites {
    Write-Header "PHASE 1: Checking Prerequisites"
    
    $allOk = $true
    
    # Check Docker
    Write-Host "`nChecking Docker..." -ForegroundColor $Colors.Info
    try {
        $dockerVersion = docker --version
        Write-Status $dockerVersion "Success"
    } catch {
        Write-Status "Docker not found! Please install Docker Desktop." "Error"
        $allOk = $false
    }
    
    # Check kubectl
    Write-Host "`nChecking kubectl..." -ForegroundColor $Colors.Info
    try {
        $kubectlVersion = kubectl version --client --short 2>$null
        Write-Status $kubectlVersion "Success"
    } catch {
        Write-Status "kubectl not found! Please install kubectl." "Error"
        $allOk = $false
    }
    
    # Check Kubernetes
    Write-Host "`nChecking Kubernetes cluster..." -ForegroundColor $Colors.Info
    try {
        $clusterInfo = kubectl cluster-info 2>$null
        if ($?) {
            Write-Status "Kubernetes cluster is running" "Success"
            kubectl cluster-info
        }
    } catch {
        Write-Status "Kubernetes not running! Enable it in Docker Desktop." "Error"
        $allOk = $false
    }
    
    # Check kubectl context
    Write-Host "`nChecking kubectl context..." -ForegroundColor $Colors.Info
    $context = kubectl config current-context 2>$null
    Write-Status "Current context: $context" "Info"
    
    if (-not $allOk) {
        Write-Status "Prerequisites check failed!" "Error"
        exit 1
    }
    
    Write-Status "All prerequisites satisfied!" "Success"
}

# ============================================================================
# Phase 2: Build Docker Images
# ============================================================================
function Build-Images {
    param([switch]$Force = $false)
    
    Write-Header "PHASE 2: Building Docker Images"
    
    $projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
    
    # Check if images exist
    $backendImageExists = docker images | Select-String "gearup/backend"
    $frontendImageExists = docker images | Select-String "gearup/frontend"
    
    if (-not $Force -and $backendImageExists -and $frontendImageExists) {
        Write-Status "Docker images already exist. Skipping build." "Info"
        if ($Interactive) {
            $rebuild = Read-Host "Rebuild images? (y/N)"
            if ($rebuild -ne "y") { return }
        }
    }
    
    # Build backend
    Write-Host "`nBuilding backend image..." -ForegroundColor $Colors.Info
    try {
        Push-Location $projectRoot
        docker build -f docker/backend.Dockerfile -t gearup/backend:latest .
        if ($?) {
            Write-Status "Backend image built successfully" "Success"
        } else {
            Write-Status "Backend image build failed" "Error"
            Pop-Location
            exit 1
        }
    } catch {
        Write-Status "Error building backend: $_" "Error"
        Pop-Location
        exit 1
    }
    
    # Build frontend
    Write-Host "`nBuilding frontend image..." -ForegroundColor $Colors.Info
    try {
        docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .
        if ($?) {
            Write-Status "Frontend image built successfully" "Success"
        } else {
            Write-Status "Frontend image build failed" "Error"
            Pop-Location
            exit 1
        }
    } catch {
        Write-Status "Error building frontend: $_" "Error"
        Pop-Location
        exit 1
    }
    
    Pop-Location
    
    # Verify images
    Write-Host "`nVerifying images..." -ForegroundColor $Colors.Info
    docker images | Select-String "gearup/"
}

# ============================================================================
# Phase 3: Deploy to Kubernetes
# ============================================================================
function Deploy-Kubernetes {
    Write-Header "PHASE 3: Deploying to Kubernetes"
    
    $k8sDir = $PSScriptRoot
    
    # Step 1: Namespace
    Write-Host "`nStep 1: Creating namespace..." -ForegroundColor $Colors.Info
    kubectl apply -f "$k8sDir\1-namespace.yaml"
    Write-Status "Namespace created" "Success"
    
    # Step 2: ConfigMap
    Write-Host "`nStep 2: Creating ConfigMap..." -ForegroundColor $Colors.Info
    kubectl apply -f "$k8sDir\2-configmap.yaml"
    Write-Status "ConfigMap created" "Success"
    
    # Step 3: Secrets
    Write-Host "`nStep 3: Creating Secrets..." -ForegroundColor $Colors.Warning
    Write-Status "IMPORTANT: Update 3-secrets.yaml with your actual values!" "Warning"
    Write-Status "Using placeholder values from 3-secrets.yaml" "Warning"
    kubectl apply -f "$k8sDir\3-secrets.yaml"
    Write-Status "Secrets created" "Success"
    
    # Step 4: Storage
    Write-Host "`nStep 4: Creating storage..." -ForegroundColor $Colors.Info
    kubectl apply -f "$k8sDir\4-mysql-pvc.yaml"
    Write-Status "PVC created" "Success"
    
    # Step 5: MySQL
    Write-Host "`nStep 5: Deploying MySQL..." -ForegroundColor $Colors.Info
    kubectl apply -f "$k8sDir\5-mysql-deployment.yaml"
    kubectl apply -f "$k8sDir\6-mysql-service.yaml"
    Write-Status "MySQL deployment created" "Success"
    
    Write-Host "`nWaiting for MySQL to be ready..." -ForegroundColor $Colors.Info
    kubectl wait --for=condition=ready pod -l app=mysql -n $Namespace --timeout=120s
    Write-Status "MySQL is ready" "Success"
    
    # Step 7: Backend
    Write-Host "`nStep 6: Deploying Backend..." -ForegroundColor $Colors.Info
    kubectl apply -f "$k8sDir\7-backend-deployment.yaml"
    kubectl apply -f "$k8sDir\8-backend-service.yaml"
    Write-Status "Backend deployment created" "Success"
    
    Write-Host "`nWaiting for Backend to be ready..." -ForegroundColor $Colors.Info
    kubectl wait --for=condition=ready pod -l app=backend -n $Namespace --timeout=180s
    Write-Status "Backend is ready" "Success"
    
    # Step 9: Frontend
    Write-Host "`nStep 7: Deploying Frontend..." -ForegroundColor $Colors.Info
    kubectl apply -f "$k8sDir\9-frontend-deployment.yaml"
    kubectl apply -f "$k8sDir\10-frontend-service.yaml"
    Write-Status "Frontend deployment created" "Success"
    
    Write-Host "`nWaiting for Frontend to be ready..." -ForegroundColor $Colors.Info
    kubectl wait --for=condition=ready pod -l app=frontend -n $Namespace --timeout=60s
    Write-Status "Frontend is ready" "Success"
}

# ============================================================================
# Phase 4: Verification
# ============================================================================
function Verify-Deployment {
    Write-Header "PHASE 4: Verifying Deployment"
    
    Write-Host "`nPods:" -ForegroundColor $Colors.Info
    kubectl get pods -n $Namespace
    
    Write-Host "`nServices:" -ForegroundColor $Colors.Info
    kubectl get svc -n $Namespace
    
    Write-Host "`nDeployments:" -ForegroundColor $Colors.Info
    kubectl get deployments -n $Namespace
    
    # Check pod status
    $allReady = $true
    $pods = kubectl get pods -n $Namespace -o json | ConvertFrom-Json
    
    foreach ($pod in $pods.items) {
        $name = $pod.metadata.name
        $ready = $pod.status.containerStatuses[0].ready
        $status = if ($ready) { "Ready" } else { "Not Ready" }
        Write-Status "$name : $status" $(if ($ready) { "Success" } else { "Warning" })
        if (-not $ready) { $allReady = $false }
    }
    
    if ($allReady) {
        Write-Status "All pods are ready!" "Success"
    } else {
        Write-Status "Some pods are not ready yet. Check logs for details." "Warning"
    }
}

# ============================================================================
# Phase 5: Cleanup
# ============================================================================
function Cleanup-Kubernetes {
    Write-Header "PHASE 5: Cleaning Up"
    
    Write-Status "Deleting namespace: $Namespace" "Warning"
    kubectl delete namespace $Namespace --ignore-not-found
    
    Write-Status "Cleanup complete!" "Success"
}

# ============================================================================
# Main
# ============================================================================

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

try {
    Check-Prerequisites
    
    if ($Clean) {
        $confirm = Read-Host "Are you sure you want to clean up? (y/N)"
        if ($confirm -eq "y") {
            Cleanup-Kubernetes
        }
    }
    
    Build-Images
    
    Deploy-Kubernetes
    
    Verify-Deployment
    
    Write-Header "DEPLOYMENT COMPLETE"
    Write-Host @"

✓ Your GearUp application is deployed to Kubernetes!

Next Steps:
1. Port-forward to access services:
   
   kubectl port-forward -n gearup svc/frontend 80:80
   kubectl port-forward -n gearup svc/backend 8080:8080
   
2. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   
3. View logs:
   
   kubectl logs -n gearup -l app=frontend -f
   kubectl logs -n gearup -l app=backend -f
   kubectl logs -n gearup -l app=mysql -f

4. For more commands, see KUBECTL_COMMANDS.md

"@ -ForegroundColor $Colors.Success
    
} catch {
    Write-Status "Deployment failed: $_" "Error"
    exit 1
}
