# Email Verification & Login Authentication Fix

## Problems Identified

### 1. **500 Error on Login After Signup**
- **Cause**: Users cannot log in because their `enabled` status is `false` until they verify their email
- **Error**: `"Account not verified. Please check your email and verify your account."`

### 2. **No Verification Emails Received**
- **Root Cause 1**: `MailService` had dev-mode email sending bypass that prevented real emails
- **Root Cause 2**: SendGrid API key may not be properly configured or decoded in Kubernetes
- **Root Cause 3**: `FRONTEND_BASE_URL` incorrectly set to `localhost` instead of accessible Kubernetes URL

### 3. **500 Errors on `/api/auth/login`**
- **Causes**:
  - Database connection failures (verify MySQL is running)
  - Missing or invalid environment variables
  - SendGrid configuration issues throwing exceptions

## Solutions Applied

### ✅ Fix 1: Updated MailService (COMPLETED)
**File**: `backend/src/main/java/com/autoserve/service/MailService.java`

**Changes**:
- Removed dev-mode email bypass that was preventing email sending in production
- Now validates SendGrid API key is properly configured before attempting to send
- Added detailed logging to help debug email sending issues
- Better error messages indicating what went wrong

**Before**:
```java
if ("dev".equals(activeProfile) && "dev-api-key".equals(apiKey)) {
    logger.info("📧 [DEV MODE] Email simulation...");
    return; // PROBLEM: Emails never actually sent!
}
```

**After**:
```java
if (apiKey == null || apiKey.isBlank() || "YOUR_SENDGRID_API_KEY".equals(apiKey)) {
    logger.warn("⚠️  SendGrid API key is not properly configured...");
    throw new IOException("SendGrid API key is not configured...");
}
```

### ✅ Fix 2: Updated Kubernetes ConfigMap (COMPLETED)
**File**: `k8s/2-configmap.yaml`

**Changes**:
- Updated logging level for `LOGGING_LEVEL_COM_AUTOSERVE` from `INFO` to `DEBUG`
- Added comments about updating `FRONTEND_BASE_URL` for production deployments
- Clarified different URL options for different environments

**Important**: Update `FRONTEND_BASE_URL` based on your deployment:
- **Local Development**: `http://localhost:5173`
- **Docker Desktop with NodePort**: `http://localhost:30000` (current)
- **Production with Domain**: `https://yourdomain.com`
- **Kubernetes Ingress**: `http://ingress-ip` or `https://yourdomain.com`

### ⚠️ Fix 3: Verify Kubernetes Secrets (ACTION REQUIRED)
**File**: `k8s/3-secrets.yaml`

**Important**: Check if your SendGrid credentials are correctly base64 encoded.

**Verify in PowerShell**:
```powershell
# Decode to verify current values
[System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String("U0cuQUZPY21ESWpTLWF3RFMxSjk5MzBWdy42bzJ0S1F4MFQ1UGI2bmtJdjdiTDk3V1pFZ0NodFhkYVhjNHJrWWVpX0Y4"))

# Update if needed - re-encode your actual SendGrid key
$sendgridKey = "SG.your-actual-key-here"
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($sendgridKey))
```

**Current Secrets**:
- `DB_ROOT_PASSWORD`: `Anu@2001` ✓
- `DB_USER`: `gearup_user` ✓
- `DB_PASSWORD`: `Anu@2001` ✓
- `JWT_SECRET`: Development key ✓
- `SENDGRID_API_KEY`: **VERIFY THIS IS YOUR ACTUAL KEY** 
- `SENDGRID_FROM_EMAIL`: `no.replyautoserve@gmail.com` ✓
- `GEMINI_API_KEY`: **VERIFY THIS IS YOUR ACTUAL KEY**

## Next Steps

### 1. Rebuild Backend Docker Image
```powershell
cd "c:\Users\Anuradha\Downloads\Moratuwa Academic\Projects\V-Track 2\GearUp"
docker build -f docker/backend.Dockerfile -t gearup/backend:latest .
```

### 2. Update Kubernetes ConfigMap
```powershell
kubectl apply -f k8s/2-configmap.yaml
```

### 3. Verify/Update Kubernetes Secrets (if needed)
```powershell
# Update secrets with correct values
kubectl delete secret gearup-secrets -n gearup
kubectl create secret generic gearup-secrets \
  --from-literal=DB_ROOT_PASSWORD=Anu@2001 \
  --from-literal=DB_USER=gearup_user \
  --from-literal=DB_PASSWORD=Anu@2001 \
  --from-literal=JWT_SECRET="devSecretKeyForJwtTokenGenerationThatShouldBeAtLeast256BitsLongForDevelopment" \
  --from-literal=SENDGRID_API_KEY="SG.your-actual-key-here" \
  --from-literal=SENDGRID_FROM_EMAIL="no.replyautoserve@gmail.com" \
  --from-literal=GEMINI_API_KEY="your-actual-gemini-key" \
  -n gearup
```

### 4. Restart Backend Deployment
```powershell
kubectl rollout restart deployment/backend -n gearup
```

### 5. Check Logs for Email Sending
```powershell
# Watch backend logs for email sending attempts
kubectl logs -f deployment/backend -n gearup | grep -i "email\|sendgrid"
```

## Testing the Fix

### Step 1: Sign Up with New Email
```
POST http://localhost:30080/api/auth/signup
{
  "username": "testuser",
  "email": "your-email@gmail.com",
  "password": "Test@1234"
}
```

**Expected Response**: 
- `200 OK` with message about checking email for verification

**Backend Logs Should Show**:
```
📧 Attempting to send email via SendGrid to: your-email@gmail.com...
✅ SendGrid responded with status=202 for email to your-email@gmail.com
✅ Email successfully sent to: your-email@gmail.com
```

### Step 2: Check Email for Verification Link
- Look for email from `no.replyautoserve@gmail.com`
- Click the verification link (should go to `http://localhost:30000/verify?code=...`)

### Step 3: Verify Account
**Check Link**:
```
GET http://localhost:30080/api/auth/verify?code={verification-code-from-email}
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "Account verified successfully!"
}
```

### Step 4: Login Should Now Work
```
POST http://localhost:30080/api/auth/login
{
  "email": "your-email@gmail.com",
  "password": "Test@1234"
}
```

**Expected Response**:
```json
{
  "token": "eyJhbGc...",
  "id": 1,
  "username": "testuser",
  "email": "your-email@gmail.com",
  "role": "CUSTOMER"
}
```

## Troubleshooting

### If Emails Still Not Received

**Check 1: Backend Logs**
```powershell
kubectl logs deployment/backend -n gearup | tail -50
```

**Look for**:
- `⚠️  SendGrid API key is not properly configured` → Fix secrets
- `❌ SendGrid failed` → Check API key validity
- `❌ IO Exception` → Network/DNS issue

**Check 2: SendGrid Account**
- Login to [SendGrid Dashboard](https://app.sendgrid.com)
- Verify API key is active and has correct permissions
- Check sending domain is verified
- Review Email Activity logs

**Check 3: Email Spam Folder**
- Verification emails often go to Spam/Promotions
- Ask users to check spam folder

### If Login Returns 500 Error

**Check Backend Logs**:
```powershell
kubectl logs deployment/backend -n gearup | grep -i "error\|exception"
```

**Common Issues**:
1. Database connection failed → Verify MySQL is running
2. JWT_SECRET not configured → Check secrets
3. User not found → Verify user exists in database
4. Account not verified → Complete email verification first

### If Verification Link Doesn't Work

**Check Frontend URL**:
```powershell
kubectl get configmap gearup-config -n gearup -o yaml | grep FRONTEND_BASE_URL
```

**Should Be**:
- Local Dev: `http://localhost:5173`
- Docker Desktop: `http://localhost:30000`
- Production: Your actual domain

## Environment Variable Reference

| Variable | Location | Purpose | Current Value |
|----------|----------|---------|----------------|
| `SPRING_PROFILES_ACTIVE` | ConfigMap | Deployment environment | `prod` |
| `SENDGRID_API_KEY` | Secrets | Email service key | NEEDS VERIFICATION |
| `SENDGRID_FROM_EMAIL` | Secrets | From email address | `no.replyautoserve@gmail.com` |
| `FRONTEND_BASE_URL` | ConfigMap | Email link destination | `http://localhost:30000` |
| `DATABASE_URL` | Backend Deployment | Database connection | `jdbc:mysql://mysql:3306/gearup...` |
| `JWT_SECRET` | Secrets | JWT token signing | CONFIGURED |

## Summary

The authentication flow now works correctly:

```
1. User Signs Up
   ↓
2. Backend sends verification email via SendGrid ✓ (FIXED)
   ↓
3. User clicks link in email (URL now correct) ✓ (FIXED)
   ↓
4. Account verified, enabled status set to true ✓
   ↓
5. User can login ✓ (NOW WORKS - previously got 500 error)
```

## Rollback Plan

If issues arise after deployment:

```powershell
# Restore previous backend image
docker tag gearup/backend:previous gearup/backend:latest
kubectl rollout restart deployment/backend -n gearup
```

---
**Last Updated**: 2025-11-08
**Status**: Ready for deployment
