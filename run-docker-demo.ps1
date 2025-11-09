# Docker Demo Automation Script
# Run this to quickly demonstrate Docker setup

Write-Host "🚀 AutoServe Docker Demo" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Check if Docker is running
Write-Host "`n1. Checking Docker status..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running or installed!" -ForegroundColor Red
    exit 1
}

# Navigate to project directory
Write-Host "`n2. Navigating to project directory..." -ForegroundColor Yellow
Set-Location "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp"
Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Green

# Show Docker files
Write-Host "`n3. Docker project structure:" -ForegroundColor Yellow
Get-ChildItem docker/ -Name | Where-Object { $_ -notlike "*.md" -and $_ -notlike "docs" }

# Show docker-compose services
Write-Host "`n4. Services defined in docker-compose.yml:" -ForegroundColor Yellow
Write-Host "   - MySQL Database (Port 3306)"
Write-Host "   - Spring Boot Backend (Port 8080)"
Write-Host "   - React Frontend (Port 80)"

# Build and start services
Write-Host "`n5. Building and starting services..." -ForegroundColor Yellow
Write-Host "   This will take 2-3 minutes..." -ForegroundColor Cyan

docker-compose -f docker/docker-compose.yml up --build -d

# Wait a bit for services to start
Start-Sleep -Seconds 10

# Show running containers
Write-Host "`n6. Running containers:" -ForegroundColor Yellow
docker-compose ps

# Test services
Write-Host "`n7. Testing services..." -ForegroundColor Yellow

# Test backend health
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 10
    Write-Host "✅ Backend is healthy: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend not ready yet (this is normal during startup)" -ForegroundColor Yellow
}

# Test frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost" -TimeoutSec 5
    Write-Host "✅ Frontend is accessible: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Frontend not ready yet" -ForegroundColor Yellow
}

Write-Host "`n🎯 Demo Complete!" -ForegroundColor Green
Write-Host "   - Open Docker Desktop to see running containers"
Write-Host "   - Visit http://localhost for the frontend"
Write-Host "   - Backend API at http://localhost:8080"
Write-Host "`nTo stop: docker-compose down" -ForegroundColor Cyan</content>
<parameter name="filePath">c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp\run-docker-demo.ps1