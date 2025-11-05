#!/usr/bin/env pwsh

# ==============================================================================
# Docker Compose Configuration Validator
# ==============================================================================
# This script validates the Docker Compose setup before deployment
# Usage: .\docker-validate.ps1
# ==============================================================================

param(
    [switch]$verbose = $false
)

$ErrorActionPreference = "Continue"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$dockerPath = $scriptPath

function Write-Header {
    param([string]$message)
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host $message -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
}

function Write-Check {
    param([string]$message, [string]$status = "OK")
    $color = if ($status -eq "OK") { "Green" } else { "Red" }
    Write-Host "  [✓] $message" -ForegroundColor $color
}

function Write-Error {
    param([string]$message)
    Write-Host "  [✗] $message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$message)
    Write-Host "  [!] $message" -ForegroundColor Yellow
}

function Test-DockerInstalled {
    Write-Header "Checking Docker Installation"
    
    try {
        $dockerVersion = docker --version
        Write-Check "Docker is installed: $dockerVersion"
        return $true
    }
    catch {
        Write-Error "Docker is not installed or not in PATH"
        Write-Host "  Please install Docker from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        return $false
    }
}

function Test-DockerComposeInstalled {
    Write-Header "Checking Docker Compose Installation"
    
    try {
        $composeVersion = docker compose version
        Write-Check "Docker Compose is installed: $composeVersion"
        return $true
    }
    catch {
        Write-Error "Docker Compose is not installed"
        Write-Host "  Docker Compose should be included with Docker Desktop" -ForegroundColor Yellow
        return $false
    }
}

function Test-EnvFile {
    Write-Header "Checking Environment Configuration"
    
    $envFile = Join-Path $dockerPath ".env"
    $envExample = Join-Path $dockerPath ".env.example"
    
    if (-not (Test-Path $envFile)) {
        Write-Error ".env file not found"
        Write-Host "  Creating .env from .env.example..." -ForegroundColor Yellow
        
        if (Test-Path $envExample) {
            Copy-Item $envExample $envFile
            Write-Check ".env file created from template"
            Write-Warning "Please edit .env with your actual configuration values!"
            return $false
        }
        else {
            Write-Error ".env.example template not found"
            return $false
        }
    }
    else {
        Write-Check ".env file exists"
        
        # Check required variables
        $requiredVars = @(
            "DB_ROOT_PASSWORD",
            "DB_PASSWORD",
            "JWT_SECRET",
            "SENDGRID_API_KEY",
            "SENDGRID_FROM_EMAIL"
        )
        
        $envContent = Get-Content $envFile | Where-Object { $_ -and -not $_.StartsWith("#") }
        $allPresent = $true
        
        foreach ($var in $requiredVars) {
            if ($envContent -match "^$var=") {
                $value = ($envContent | Select-String "^$var=").ToString().Split("=")[1]
                if ($value -and $value -ne "your_*") {
                    Write-Check "✓ $var is configured"
                }
                else {
                    Write-Warning "$var is set but may need configuration"
                    $allPresent = $false
                }
            }
            else {
                Write-Error "$var is missing from .env file"
                $allPresent = $false
            }
        }
        
        return $allPresent
    }
}

function Test-DockerComposeFile {
    Write-Header "Validating docker-compose.yml"
    
    $composeFile = Join-Path $dockerPath "docker-compose.yml"
    
    if (-not (Test-Path $composeFile)) {
        Write-Error "docker-compose.yml not found at $composeFile"
        return $false
    }
    
    try {
        $output = docker compose -f $composeFile config 2>&1
        Write-Check "docker-compose.yml syntax is valid"
        return $true
    }
    catch {
        Write-Error "docker-compose.yml validation failed: $_"
        return $false
    }
}

function Test-DockerImages {
    Write-Header "Checking Required Docker Images"
    
    $images = @(
        "mysql:8.0.36-alpine",
        "node:20-alpine",
        "eclipse-temurin:17-jre-alpine",
        "nginx:1.25-alpine"
    )
    
    $allPresent = $true
    foreach ($image in $images) {
        try {
            $result = docker image inspect $image 2>&1
            Write-Check "Image available: $image"
        }
        catch {
            Write-Warning "Image not cached locally: $image (will be pulled on first run)"
        }
    }
    
    return $true
}

function Test-Ports {
    Write-Header "Checking Required Ports"
    
    $ports = @{
        "80"   = "Frontend (HTTP)"
        "3306" = "Database (MySQL)"
        "8080" = "Backend (Spring Boot)"
    }
    
    $allAvailable = $true
    foreach ($port in $ports.GetEnumerator()) {
        $portNum = $port.Name
        $service = $port.Value
        
        try {
            $connection = Test-NetConnection -ComputerName localhost -Port $portNum -WarningAction SilentlyContinue
            if ($connection.TcpTestSucceeded) {
                Write-Warning "Port $portNum is already in use ($service)"
                $allAvailable = $false
            }
            else {
                Write-Check "Port $portNum is available ($service)"
            }
        }
        catch {
            Write-Check "Port $portNum is available ($service)"
        }
    }
    
    return $allAvailable
}

function Test-DiskSpace {
    Write-Header "Checking Disk Space"
    
    $disk = Get-Volume | Where-Object { $_.DriveLetter -eq $dockerPath[0] }
    if ($disk) {
        $freeGB = [math]::Round($disk.SizeRemaining / 1GB, 2)
        $totalGB = [math]::Round($disk.Size / 1GB, 2)
        
        Write-Check "Free disk space: ${freeGB}GB / ${totalGB}GB"
        
        if ($freeGB -lt 10) {
            Write-Warning "Low disk space detected (less than 10GB free)"
            return $false
        }
        
        return $true
    }
    
    return $true
}

function Test-Dockerfiles {
    Write-Header "Checking Dockerfiles"
    
    $dockerfiles = @(
        "backend.Dockerfile",
        "frontend.Dockerfile"
    )
    
    $allPresent = $true
    foreach ($dockerfile in $dockerfiles) {
        $path = Join-Path $dockerPath $dockerfile
        if (Test-Path $path) {
            Write-Check "$dockerfile exists"
        }
        else {
            Write-Error "$dockerfile not found"
            $allPresent = $false
        }
    }
    
    return $allPresent
}

# ==============================================================================
# Main Execution
# ==============================================================================

Write-Host "`n" -ForegroundColor Cyan
Write-Host "  AutoServe Docker Compose Configuration Validator" -ForegroundColor Cyan
Write-Host "  ================================================" -ForegroundColor Cyan

$allChecks = @()

$allChecks += Test-DockerInstalled
$allChecks += Test-DockerComposeInstalled
$allChecks += Test-DockerComposeFile
$allChecks += Test-Dockerfiles
$allChecks += Test-EnvFile
$allChecks += Test-Ports
$allChecks += Test-DiskSpace
$allChecks += Test-DockerImages

Write-Header "Validation Summary"

$passed = ($allChecks | Where-Object { $_ -eq $true }).Count
$total = $allChecks.Count

if ($passed -eq $total) {
    Write-Host "✓ All checks passed! You're ready to deploy." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Edit .env file with your actual configuration values" -ForegroundColor White
    Write-Host "  2. Run: docker compose up --build" -ForegroundColor White
    Write-Host "  3. Access http://localhost in your browser" -ForegroundColor White
    exit 0
}
else {
    Write-Host "✗ Some checks failed. Please fix the issues above before deploying." -ForegroundColor Red
    Write-Host "`nFailed checks: $($total - $passed)/$total" -ForegroundColor Red
    exit 1
}
