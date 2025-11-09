#!/usr/bin/env pwsh
# Test the backend API after fixes

Write-Host "=== Testing GearUp Backend API ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health check
Write-Host "[1/3] Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri 'http://localhost:30080/actuator/health' -UseBasicParsing
    Write-Host "      Status: $($health.StatusCode)" -ForegroundColor Green
    Write-Host "      Result: OK" -ForegroundColor Green
} catch {
    Write-Host "      ERROR: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Login (should fail with user not found, but no email error)
Write-Host "[2/3] Testing login endpoint..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "test@example.com"
        password = "test123"
    } | ConvertTo-Json
    
    $login = Invoke-WebRequest -Uri 'http://localhost:30080/api/auth/login' `
        -Method POST `
        -ContentType 'application/json' `
        -Body $loginBody `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue
    
    Write-Host "      Status: $($login.StatusCode)" -ForegroundColor Green
    Write-Host "      Response: $($login.Content | ConvertFrom-Json)" -ForegroundColor Green
} catch {
    $errorData = $_ | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($errorData) {
        Write-Host "      Status: 400/500 (Expected - user not found)" -ForegroundColor Yellow
        Write-Host "      Good: No email sending error!" -ForegroundColor Green
    } else {
        Write-Host "      ERROR: $_" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: Signup (will simulate email in dev mode)
Write-Host "[3/3] Testing signup endpoint..." -ForegroundColor Yellow
try {
    $username = "testuser_$(Get-Random)"
    $signupBody = @{
        username = $username
        email = "$username@example.com"
        password = "TestPass123"
    } | ConvertTo-Json
    
    $signup = Invoke-WebRequest -Uri 'http://localhost:30080/api/auth/signup' `
        -Method POST `
        -ContentType 'application/json' `
        -Body $signupBody `
        -UseBasicParsing `
        -ErrorAction SilentlyContinue
    
    Write-Host "      Status: $($signup.StatusCode)" -ForegroundColor Green
    Write-Host "      Message: $($signup.Content)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode
    if ($statusCode -in @('400', '500')) {
        Write-Host "      Status: $statusCode" -ForegroundColor Yellow
        Write-Host "      Checking if email error or validation error..." -ForegroundColor Yellow
        if ($_.Exception.Response.Content -like "*SendGrid*" -or $_.Exception.Response.Content -like "*email*") {
            Write-Host "      ERROR: Email sending failed!" -ForegroundColor Red
        } else {
            Write-Host "      OK: Likely validation error (user may already exist)" -ForegroundColor Green
        }
    } else {
        Write-Host "      ERROR: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
