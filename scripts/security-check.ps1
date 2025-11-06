#!/usr/bin/env pwsh
# Security Check Script for GearUp Project
# Scans for hardcoded secrets and security issues

Write-Host "`n🔍 GearUp Security Scanner`n" -ForegroundColor Cyan

$foundIssues = $false

# Patterns to search for potential secrets
$patterns = @{
    "Hardcoded Password" = 'password\s*[:=]\s*[''"](?!\$\{)[^''"]{3,}'
    "Hardcoded Secret" = 'secret\s*[:=]\s*[''"](?!\$\{)[^''"]{3,}'
    "Hardcoded API Key" = 'api[_-]?key\s*[:=]\s*[''"](?!\$\{)[^''"]{3,}'
    "Hardcoded Token" = 'token\s*[:=]\s*[''"](?!\$\{)[^''"]{3,}'
    "MySQL Password" = 'mysql.*password.*=.*[''"][^$][^''"]{2,}'
}

# Files to scan
$extensions = @("*.java", "*.yml", "*.yaml", "*.properties", "*.xml", "*.json")
$excludePaths = @("target", "node_modules", ".git", ".idea", "apache-maven-*")

Write-Host "📂 Scanning backend directory..." -ForegroundColor Yellow

# Get files to scan
$files = Get-ChildItem -Path "backend" -Recurse -Include $extensions -File | 
    Where-Object { 
        $path = $_.FullName
        -not ($excludePaths | Where-Object { $path -like "*$_*" })
    }

Write-Host "   Found $($files.Count) files to scan`n" -ForegroundColor Gray

foreach ($patternName in $patterns.Keys) {
    $pattern = $patterns[$patternName]
    
    foreach ($file in $files) {
        try {
            $matches = Select-String -Path $file.FullName -Pattern $pattern -ErrorAction SilentlyContinue
            
            if ($matches) {
                $foundIssues = $true
                Write-Host "⚠️  $patternName found in:" -ForegroundColor Red
                Write-Host "    📄 $($file.FullName)" -ForegroundColor Yellow
                
                foreach ($match in $matches) {
                    $line = $match.Line.Trim()
                    # Mask the actual value for security
                    $line = $line -replace '([''"])[^''"]+([''"])', '$1***REDACTED***$2'
                    Write-Host "       Line $($match.LineNumber): $line" -ForegroundColor Gray
                }
                Write-Host ""
            }
        }
        catch {
            # Silently skip files that can't be read
        }
    }
}

# Check if .env is in .gitignore
Write-Host "🔒 Checking .gitignore configuration..." -ForegroundColor Yellow

$gitignorePath = "backend\.gitignore"
if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath -Raw
    
    if ($gitignoreContent -match "\.env") {
        Write-Host "   ✅ .env is properly ignored in .gitignore" -ForegroundColor Green
    }
    else {
        Write-Host "   ⚠️  .env is NOT in .gitignore!" -ForegroundColor Red
        $foundIssues = $true
    }
}
else {
    Write-Host "   ⚠️  .gitignore file not found!" -ForegroundColor Red
    $foundIssues = $true
}

# Check if .env exists and warn
Write-Host "`n🔐 Checking for .env files..." -ForegroundColor Yellow

$envFiles = Get-ChildItem -Path "." -Recurse -Include ".env" -File -ErrorAction SilentlyContinue

foreach ($envFile in $envFiles) {
    Write-Host "   📄 Found: $($envFile.FullName)" -ForegroundColor Cyan
    
    # Check if it's tracked by git
    $gitStatus = git status --porcelain $envFile.FullName 2>&1
    if ($gitStatus -match "^\?\?") {
        Write-Host "      ✅ Not tracked by git" -ForegroundColor Green
    }
    elseif ($LASTEXITCODE -eq 0 -and $gitStatus) {
        Write-Host "      ⚠️  WARNING: This file is tracked by git!" -ForegroundColor Red
        $foundIssues = $true
    }
}

# Check for .env.example
Write-Host "`n📋 Checking for .env.example..." -ForegroundColor Yellow

$envExampleFiles = Get-ChildItem -Path "." -Recurse -Include ".env.example" -File -ErrorAction SilentlyContinue

if ($envExampleFiles) {
    Write-Host "   ✅ Found $($envExampleFiles.Count) .env.example file(s)" -ForegroundColor Green
}
else {
    Write-Host "   ⚠️  No .env.example found (recommended for documentation)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" + ("=" * 60) -ForegroundColor Gray

if (-not $foundIssues) {
    Write-Host "`n✅ No security issues found!" -ForegroundColor Green
    Write-Host "   Your configuration appears to be secure.`n" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "`n⚠️  Security issues detected!" -ForegroundColor Red
    Write-Host "   Please review and fix the issues above.`n" -ForegroundColor Red
    exit 1
}
