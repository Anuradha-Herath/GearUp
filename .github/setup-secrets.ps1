@echo off
REM ==============================================================================
REM GearUp CI/CD Secrets Setup Script (Windows PowerShell)
REM ==============================================================================
REM This script helps you set up all required GitHub secrets for the CI/CD pipeline
REM 
REM Usage: setup-secrets.ps1
REM ==============================================================================

# Check if gh CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed" -ForegroundColor Red
    Write-Host "Install from: https://cli.github.com/"
    exit 1
}

# Check if authenticated
try {
    gh auth status | Out-Null
} catch {
    Write-Host "❌ Not authenticated with GitHub" -ForegroundColor Red
    Write-Host "Run: gh auth login"
    exit 1
}

Write-Host "✅ GitHub CLI is ready" -ForegroundColor Green
Write-Host ""

# Get repository
try {
    $repo = gh repo view --json nameWithOwner --jq '.nameWithOwner'
    if (-not $repo) {
        Write-Host "❌ Not in a GitHub repository" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Failed to get repository" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Repository: $repo" -ForegroundColor Cyan
Write-Host ""

# Function to set secret
function Set-Secret {
    param(
        [string]$Name,
        [string]$Prompt,
        [bool]$IsFile = $false
    )
    
    if ($IsFile) {
        $filePath = Read-Host "Enter $Name (file path)"
        if (-not (Test-Path $filePath)) {
            Write-Host "❌ File not found: $filePath" -ForegroundColor Red
            return $false
        }
        $content = Get-Content $filePath -Raw
    } else {
        $content = Read-Host "Enter $Name" -AsSecureString
        $content = [System.Net.NetworkCredential]::new('', $content).Password
        
        if ([string]::IsNullOrEmpty($content)) {
            Write-Host "❌ Cannot be empty" -ForegroundColor Red
            return $false
        }
    }
    
    $content | gh secret set "$Name"
    Write-Host "✅ Set $Name" -ForegroundColor Green
    return $true
}

# Display menu
Write-Host "🔧 Setup Options:" -ForegroundColor Yellow
Write-Host "1. Set essential secrets (Docker + Slack)" -ForegroundColor White
Write-Host "2. Set all secrets (Docker + AWS + SSH + Slack)" -ForegroundColor White
Write-Host "3. Set Docker secrets only" -ForegroundColor White
Write-Host "4. Set AWS secrets only" -ForegroundColor White
Write-Host "5. Set SSH deployment secrets only" -ForegroundColor White
Write-Host "6. Set Slack notifications only" -ForegroundColor White
Write-Host "7. View current secrets" -ForegroundColor White
Write-Host "8. Exit" -ForegroundColor White
Write-Host ""

$option = Read-Host "Select option (1-8)"
Write-Host ""

switch ($option) {
    "1" {
        Write-Host "📝 Essential Secrets Setup" -ForegroundColor Yellow
        Write-Host "==========================" -ForegroundColor Yellow
        Write-Host ""
        
        Write-Host "🐳 Docker Hub Configuration" -ForegroundColor Cyan
        Set-Secret "DOCKER_USERNAME" "Docker Hub username"
        Set-Secret "DOCKER_PASSWORD" "Docker Hub token (not password)"
        Write-Host ""
        
        Write-Host "💬 Slack Configuration" -ForegroundColor Cyan
        Set-Secret "SLACK_WEBHOOK_URL" "Slack webhook URL"
        Write-Host ""
        
        Write-Host "✅ Essential secrets configured!" -ForegroundColor Green
    }
    "2" {
        Write-Host "📝 Complete Secrets Setup" -ForegroundColor Yellow
        Write-Host "=========================" -ForegroundColor Yellow
        Write-Host ""
        
        Write-Host "🐳 Docker Hub Configuration" -ForegroundColor Cyan
        Set-Secret "DOCKER_USERNAME" "Docker Hub username"
        Set-Secret "DOCKER_PASSWORD" "Docker Hub token"
        Write-Host ""
        
        Write-Host "☁️  AWS Configuration (optional)" -ForegroundColor Cyan
        $setupAWS = Read-Host "Set up AWS? (y/n)"
        if ($setupAWS -eq "y") {
            Set-Secret "AWS_REGION" "AWS region (e.g., us-east-1)"
            Set-Secret "AWS_ROLE_TO_ASSUME" "AWS role ARN (arn:aws:iam::...)"
        }
        Write-Host ""
        
        Write-Host "🔑 SSH Deployment Configuration (optional)" -ForegroundColor Cyan
        $setupSSH = Read-Host "Set up SSH? (y/n)"
        if ($setupSSH -eq "y") {
            Set-Secret "DEPLOY_SSH_KEY" "SSH private key" $true
            Set-Secret "STAGING_SERVER_IP" "Staging server IP/hostname"
            Set-Secret "PRODUCTION_SERVER_IP" "Production server IP/hostname"
        }
        Write-Host ""
        
        Write-Host "💬 Slack Configuration" -ForegroundColor Cyan
        Set-Secret "SLACK_WEBHOOK_URL" "Slack webhook URL"
        Write-Host ""
        
        Write-Host "✅ All secrets configured!" -ForegroundColor Green
    }
    "3" {
        Write-Host "🐳 Docker Hub Configuration" -ForegroundColor Yellow
        Write-Host "===========================" -ForegroundColor Yellow
        Write-Host ""
        Set-Secret "DOCKER_USERNAME" "Docker Hub username"
        Set-Secret "DOCKER_PASSWORD" "Docker Hub token"
    }
    "4" {
        Write-Host "☁️  AWS Configuration" -ForegroundColor Yellow
        Write-Host "====================" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Get these values from AWS:"
        Write-Host "- Region: e.g., us-east-1, eu-west-1"
        Write-Host "- Role ARN: arn:aws:iam::ACCOUNT-ID:role/role-name"
        Write-Host ""
        Set-Secret "AWS_REGION" "AWS region"
        Set-Secret "AWS_ROLE_TO_ASSUME" "AWS role ARN"
    }
    "5" {
        Write-Host "🔑 SSH Deployment Configuration" -ForegroundColor Yellow
        Write-Host "===============================" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Generate SSH key (if needed):"
        Write-Host "  ssh-keygen -t ed25519 -f deploy_key -N '""'"
        Write-Host "  ssh-copy-id -i deploy_key.pub ubuntu@server-ip"
        Write-Host ""
        Set-Secret "DEPLOY_SSH_KEY" "SSH private key" $true
        Set-Secret "STAGING_SERVER_IP" "Staging server IP/hostname"
        Set-Secret "PRODUCTION_SERVER_IP" "Production server IP/hostname"
    }
    "6" {
        Write-Host "💬 Slack Notifications Configuration" -ForegroundColor Yellow
        Write-Host "====================================" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Create Slack webhook:"
        Write-Host "1. Go to https://api.slack.com/apps"
        Write-Host "2. Create new app or select existing"
        Write-Host "3. Enable 'Incoming Webhooks'"
        Write-Host "4. Click 'Add New Webhook to Workspace'"
        Write-Host "5. Select channel (#deployments recommended)"
        Write-Host "6. Copy webhook URL"
        Write-Host ""
        Set-Secret "SLACK_WEBHOOK_URL" "Slack webhook URL"
    }
    "7" {
        Write-Host "📋 Current Secrets:" -ForegroundColor Yellow
        Write-Host "==================" -ForegroundColor Yellow
        gh secret list
    }
    "8" {
        Write-Host "👋 Goodbye!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "❌ Invalid option" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Green
Write-Host "1. Create GitHub environments:"
Write-Host "   - Settings → Environments → New environment 'staging'"
Write-Host "   - Settings → Environments → New environment 'production'"
Write-Host ""
Write-Host "2. Configure production environment protection:"
Write-Host "   - Required reviewers: 2"
Write-Host "   - Restrict who can deploy: admins only"
Write-Host ""
Write-Host "3. Create branch protection rules:"
Write-Host "   - Settings → Branches → Add rule for 'main'"
Write-Host "   - Require status checks to pass before merging"
Write-Host "   - Require pull request reviews before merging"
Write-Host ""
Write-Host "4. Test the pipeline:"
Write-Host "   - Push code to a feature branch"
Write-Host "   - Create a pull request to main/develop"
Write-Host "   - Watch the CI pipeline in Actions tab"
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
