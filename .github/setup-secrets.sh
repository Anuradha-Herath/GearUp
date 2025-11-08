#!/bin/bash
# ==============================================================================
# GearUp CI/CD Secrets Setup Script
# ==============================================================================
# This script helps you set up all required GitHub secrets for the CI/CD pipeline
# 
# Usage: ./setup-secrets.sh
# ==============================================================================

set -e

echo "🔐 GearUp CI/CD Secrets Setup"
echo "=============================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Install from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ Not authenticated with GitHub"
    echo "Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready"
echo ""

# Verify repository
REPO=$(gh repo view --json nameWithOwner --jq '.nameWithOwner')
if [ -z "$REPO" ]; then
    echo "❌ Not in a GitHub repository"
    exit 1
fi

echo "📦 Repository: $REPO"
echo ""

# Function to set secret with validation
set_secret() {
    local name=$1
    local prompt=$2
    local is_file=${3:-false}
    
    echo -n "Enter $name"
    if [ "$is_file" = "true" ]; then
        echo -n " (file path): "
        read -r file_path
        
        if [ ! -f "$file_path" ]; then
            echo "❌ File not found: $file_path"
            return 1
        fi
        
        content=$(<"$file_path")
        gh secret set "$name" --body "$content"
    else
        echo -n ": "
        read -rs content
        echo ""
        
        if [ -z "$content" ]; then
            echo "❌ Cannot be empty"
            return 1
        fi
        
        gh secret set "$name" --body "$content"
    fi
    
    echo "✅ Set $name"
}

# Menu for selective setup
echo "🔧 Setup Options:"
echo "1. Set only essential secrets (Docker + Slack)"
echo "2. Set all secrets (Docker + AWS + SSH + Slack)"
echo "3. Set Docker secrets only"
echo "4. Set AWS secrets only"
echo "5. Set SSH deployment secrets only"
echo "6. Set Slack notifications only"
echo "7. View current secrets"
echo "8. Exit"
echo ""

read -p "Select option (1-8): " option

echo ""

case $option in
    1)
        echo "📝 Essential Secrets Setup"
        echo "=========================="
        echo ""
        echo "🐳 Docker Hub Configuration"
        set_secret "DOCKER_USERNAME" "Docker Hub username"
        set_secret "DOCKER_PASSWORD" "Docker Hub token (not password)"
        echo ""
        
        echo "💬 Slack Configuration"
        set_secret "SLACK_WEBHOOK_URL" "Slack webhook URL"
        echo ""
        
        echo "✅ Essential secrets configured!"
        ;;
        
    2)
        echo "📝 Complete Secrets Setup"
        echo "========================="
        echo ""
        
        echo "🐳 Docker Hub Configuration"
        set_secret "DOCKER_USERNAME" "Docker Hub username"
        set_secret "DOCKER_PASSWORD" "Docker Hub token"
        echo ""
        
        echo "☁️  AWS Configuration (optional - press Ctrl+C to skip)"
        set_secret "AWS_REGION" "AWS region" || echo "⏭️  Skipping AWS"
        set_secret "AWS_ROLE_TO_ASSUME" "AWS role ARN" || echo "⏭️  Skipping AWS"
        echo ""
        
        echo "🔑 SSH Deployment Configuration (optional)"
        set_secret "DEPLOY_SSH_KEY" "SSH private key" true || echo "⏭️  Skipping SSH"
        set_secret "STAGING_SERVER_IP" "Staging server IP/hostname" || echo "⏭️  Skipping SSH"
        set_secret "PRODUCTION_SERVER_IP" "Production server IP/hostname" || echo "⏭️  Skipping SSH"
        echo ""
        
        echo "💬 Slack Configuration"
        set_secret "SLACK_WEBHOOK_URL" "Slack webhook URL"
        echo ""
        
        echo "✅ All secrets configured!"
        ;;
        
    3)
        echo "🐳 Docker Hub Configuration"
        echo "==========================="
        echo ""
        set_secret "DOCKER_USERNAME" "Docker Hub username"
        set_secret "DOCKER_PASSWORD" "Docker Hub token"
        ;;
        
    4)
        echo "☁️  AWS Configuration"
        echo "===================="
        echo ""
        echo "Get these values from AWS:"
        echo "- Region: e.g., us-east-1, eu-west-1"
        echo "- Role ARN: arn:aws:iam::ACCOUNT-ID:role/role-name"
        echo ""
        set_secret "AWS_REGION" "AWS region"
        set_secret "AWS_ROLE_TO_ASSUME" "AWS role ARN (ARN format)"
        ;;
        
    5)
        echo "🔑 SSH Deployment Configuration"
        echo "==============================="
        echo ""
        echo "Generate SSH key (if needed):"
        echo "  ssh-keygen -t ed25519 -f deploy_key -N ''"
        echo "  ssh-copy-id -i deploy_key.pub ubuntu@server-ip"
        echo ""
        set_secret "DEPLOY_SSH_KEY" "SSH private key" true
        set_secret "STAGING_SERVER_IP" "Staging server IP/hostname"
        set_secret "PRODUCTION_SERVER_IP" "Production server IP/hostname"
        ;;
        
    6)
        echo "💬 Slack Notifications Configuration"
        echo "===================================="
        echo ""
        echo "Create Slack webhook:"
        echo "1. Go to https://api.slack.com/apps"
        echo "2. Create new app or select existing"
        echo "3. Enable 'Incoming Webhooks'"
        echo "4. Click 'Add New Webhook to Workspace'"
        echo "5. Select channel (#deployments recommended)"
        echo "6. Copy webhook URL"
        echo ""
        set_secret "SLACK_WEBHOOK_URL" "Slack webhook URL"
        ;;
        
    7)
        echo "📋 Current Secrets:"
        echo "=================="
        gh secret list --repo "$REPO" || echo "❌ Failed to list secrets"
        ;;
        
    8)
        echo "👋 Goodbye!"
        exit 0
        ;;
        
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📚 Next Steps:"
echo "1. Create GitHub environments:"
echo "   - Settings → Environments → New environment 'staging'"
echo "   - Settings → Environments → New environment 'production'"
echo ""
echo "2. Configure production environment protection:"
echo "   - Required reviewers: 2"
echo "   - Restrict who can deploy: admins only"
echo ""
echo "3. Create branch protection rules:"
echo "   - Settings → Branches → Add rule for 'main'"
echo "   - Require status checks to pass before merging"
echo "   - Require pull request reviews before merging"
echo ""
echo "4. Test the pipeline:"
echo "   - Push code to a feature branch"
echo "   - Create a pull request to main/develop"
echo "   - Watch the CI pipeline in Actions tab"
echo ""
echo "✅ Setup complete!"
