#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Deployment commands for the email verification fix to Kubernetes
.DESCRIPTION
    This script provides step-by-step commands to deploy the authentication fixes
#>

Write-Host "========================================"
Write-Host "GearUp Authentication Fix - Deployment"
Write-Host "========================================"
Write-Host ""

# Step 1: Rebuild Backend Docker Image
Write-Host "STEP 1: Rebuild Backend Docker Image" -ForegroundColor Cyan
Write-Host "Command:" -ForegroundColor Yellow
Write-Host 'cd "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp"'
Write-Host 'docker build -f docker/backend.Dockerfile -t gearup/backend:latest .'
Write-Host ""
Write-Host "⚠️  Run this command in a new terminal and wait for completion"
Write-Host ""

# Step 2: Apply ConfigMap
Write-Host "STEP 2: Apply Updated ConfigMap" -ForegroundColor Cyan
Write-Host "Command:" -ForegroundColor Yellow
Write-Host 'kubectl apply -f k8s/2-configmap.yaml'
Write-Host ""

# Step 3: Check Current Secrets
Write-Host "STEP 3: Verify Kubernetes Secrets" -ForegroundColor Cyan
Write-Host "Command to check current secrets:" -ForegroundColor Yellow
Write-Host 'kubectl get secret gearup-secrets -n gearup -o yaml'
Write-Host ""

# Decode current SendGrid key to verify it's correct
Write-Host "STEP 3.1: Decode current SendGrid API key:" -ForegroundColor Yellow
Write-Host "Command:" -ForegroundColor Yellow
Write-Host '@($env:POSH_VERSION, ([System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("U0cuQUZPY21ESWpTLWF3RFMxSjk5MzBWdy42bzJ0S1F4MFQ1UGI2bmtJdjdiTDk3V1pFZ0NodFhkYVhjNHJrWWVpX0Y4")))) | Write-Host'
Write-Host ""
Write-Host "If the decoded value matches your SendGrid API key, proceed."
Write-Host "If NOT, update the secrets (see STEP 3.2)"
Write-Host ""

# Step 3.2: Update Secrets if needed
Write-Host "STEP 3.2: Update Secrets (if your API key is different)" -ForegroundColor Yellow
Write-Host '# First, delete the old secret:' -ForegroundColor Gray
Write-Host 'kubectl delete secret gearup-secrets -n gearup' -ForegroundColor Yellow
Write-Host ""
Write-Host '# Then create new secret with YOUR ACTUAL values:' -ForegroundColor Gray
Write-Host 'kubectl create secret generic gearup-secrets `' -ForegroundColor Yellow
Write-Host '  --from-literal=DB_ROOT_PASSWORD=Anu@2001 `' -ForegroundColor Yellow
Write-Host '  --from-literal=DB_USER=gearup_user `' -ForegroundColor Yellow
Write-Host '  --from-literal=DB_PASSWORD=Anu@2001 `' -ForegroundColor Yellow
Write-Host '  --from-literal=JWT_SECRET="devSecretKeyForJwtTokenGenerationThatShouldBeAtLeast256BitsLongForDevelopment" `' -ForegroundColor Yellow
Write-Host '  --from-literal=SENDGRID_API_KEY="YOUR_ACTUAL_SENDGRID_KEY_HERE" `' -ForegroundColor Yellow
Write-Host '  --from-literal=SENDGRID_FROM_EMAIL="no.replyautoserve@gmail.com" `' -ForegroundColor Yellow
Write-Host '  --from-literal=GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_KEY_HERE" `' -ForegroundColor Yellow
Write-Host '  -n gearup' -ForegroundColor Yellow
Write-Host ""

# Step 4: Restart Backend
Write-Host "STEP 4: Restart Backend Deployment" -ForegroundColor Cyan
Write-Host "Command:" -ForegroundColor Yellow
Write-Host 'kubectl rollout restart deployment/backend -n gearup'
Write-Host ""
Write-Host "Wait for the pod to restart..."
Write-Host 'kubectl rollout status deployment/backend -n gearup'
Write-Host ""

# Step 5: Check Logs
Write-Host "STEP 5: Monitor Backend Logs for Startup" -ForegroundColor Cyan
Write-Host "Command:" -ForegroundColor Yellow
Write-Host 'kubectl logs -f deployment/backend -n gearup'
Write-Host ""
Write-Host "Wait until you see: 'Started AutoserveApplication'"
Write-Host "Then press Ctrl+C to stop following logs"
Write-Host ""

# Step 6: Test Signup
Write-Host "STEP 6: Test Signup Endpoint" -ForegroundColor Cyan
Write-Host "Command:" -ForegroundColor Yellow
Write-Host ""
Write-Host '@{' -ForegroundColor Yellow
Write-Host '  "username" = "testuser123"' -ForegroundColor Yellow
Write-Host '  "email" = "your.email@example.com"' -ForegroundColor Yellow
Write-Host '  "password" = "Test@1234"' -ForegroundColor Yellow
Write-Host '} | ConvertTo-Json | Invoke-WebRequest -Uri "http://localhost:30080/api/auth/signup" -Method POST -ContentType "application/json"' -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected: 200 OK with message about checking email for verification"
Write-Host ""

# Step 7: Check Backend Logs for Email Sending
Write-Host "STEP 7: Check if Email was Sent" -ForegroundColor Cyan
Write-Host "Command:" -ForegroundColor Yellow
Write-Host 'kubectl logs deployment/backend -n gearup | Select-String -Pattern "email|sendgrid|SendGrid" -CaseSensitive:$false'
Write-Host ""
Write-Host "Look for lines like:"
Write-Host "  ✅ Email successfully sent to: your.email@example.com" -ForegroundColor Green
Write-Host ""

# Step 8: Verify Email Received
Write-Host "STEP 8: Check Your Email" -ForegroundColor Cyan
Write-Host "Look for an email from: no.replyautoserve@gmail.com" -ForegroundColor Yellow
Write-Host "Subject: Welcome to AutoServe! 🚗"
Write-Host "Click the 'Verify My Account' button"
Write-Host ""
Write-Host "⚠️  Check spam/promotions folder if not in inbox"
Write-Host ""

# Step 9: Verify Account
Write-Host "STEP 9: Verify Account via API" -ForegroundColor Cyan
Write-Host "If you didn't click the link, you can verify via API:"
Write-Host "Command:" -ForegroundColor Yellow
Write-Host 'Invoke-WebRequest -Uri "http://localhost:30080/api/auth/verify?code={VERIFICATION_CODE_FROM_EMAIL}" -Method GET'
Write-Host ""

# Step 10: Test Login
Write-Host "STEP 10: Test Login" -ForegroundColor Cyan
Write-Host "Command:" -ForegroundColor Yellow
Write-Host ""
Write-Host '@{' -ForegroundColor Yellow
Write-Host '  "email" = "your.email@example.com"' -ForegroundColor Yellow
Write-Host '  "password" = "Test@1234"' -ForegroundColor Yellow
Write-Host '} | ConvertTo-Json | Invoke-WebRequest -Uri "http://localhost:30080/api/auth/login" -Method POST -ContentType "application/json"' -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected: 200 OK with JWT token in response"
Write-Host ""

Write-Host "========================================"
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "For troubleshooting, see: AUTHENTICATION_FIX.md"
Write-Host ""
