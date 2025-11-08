# API Errors - Root Cause Analysis & Fix

## Errors Observed

```
POST /api/auth/login     ΓåÆ 500 Internal Server Error
POST /api/auth/signup    ΓåÆ 400 Bad Request, then 500
```

## Root Causes Identified

### Issue #1: Frontend URL Misconfiguration Γ£à FIXED
- **Problem**: `FRONTEND_BASE_URL` was set to `http://localhost` (missing port)
- **Expected**: Should be `http://localhost:30000` (with port)
- **Impact**: Verification links in emails were incorrect
- **Fix**: Updated ConfigMap with correct URL

### Issue #2: SendGrid API Key Expired/Invalid ΓÜá∩╕Å
- **Problem**: SendGrid API key returns HTTP 401 "authorization grant is invalid, expired, or revoked"
- **Root Cause**: The API key in `k8s/3-secrets.yaml` is no longer valid
- **Current Key**: _(stored in k8s/3-secrets.yaml or env ΓÇö rotate if ever committed)_ (EXPIRED)
- **Impact**: Email verification fails during signup, causing 500 errors

### Issue #3: Spring Profile Set to `prod`
- **Problem**: Profile is `prod`, which tries to send real emails
- **Better for Dev**: Should be `dev` to skip email sending during development

## Immediate Solution: Enable Dev Mode

For development/testing, switch to dev profile:

### Step 1: Update ConfigMap
```bash
kubectl -n gearup patch configmap gearup-config \
  -p '{"data":{"SPRING_PROFILE":"dev"}}'
```

### Step 2: Update Secret with Dev Key
```bash
# The MailService checks for "dev-api-key" to skip email sending
kubectl -n gearup patch secret gearup-secrets \
  -p '{"data":{"SENDGRID_API_KEY":"'$(echo -n 'dev-api-key' | base64)'}}"'
```

### Step 3: Restart Backend
```bash
kubectl -n gearup rollout restart deployment backend
```

## Detailed Fix Instructions

### Option A: DEV MODE (Recommended for Testing)

1. **Update Spring Profile to Dev**
   ```bash
   kubectl -n gearup patch configmap gearup-config \
     -p '{"data":{"SPRING_PROFILE":"dev"}}'
   ```

2. **Set Dev API Key**
   ```bash
   kubectl -n gearup patch secret gearup-secrets \
     -p '{"data":{"SENDGRID_API_KEY":"'$(echo -n 'dev-api-key' | base64)'}}"'
   ```

3. **Restart Backend**
   ```bash
   kubectl -n gearup rollout restart deployment backend
   ```

4. **Test Again**
   - Try signup at http://localhost:30000
   - Check backend logs for "Email simulation" message
   - Signup should complete without email errors

### Option B: USE VALID SendGrid API KEY (For Production)

1. **Get a Valid SendGrid API Key**
   - Go to https://app.sendgrid.com/settings/api_keys
   - Create a new API key or use an existing valid one
   - Copy the key

2. **Update Secret**
   ```powershell
   $apiKey = "your-new-valid-api-key"
   $encoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($apiKey))
   kubectl -n gearup patch secret gearup-secrets \
     -p "{\"data\":{\"SENDGRID_API_KEY\":\"$encoded\"}}"
   ```

3. **Update ConfigMap to prod**
   ```bash
   kubectl -n gearup patch configmap gearup-config \
     -p '{"data":{"SPRING_PROFILE":"prod"}}'
   ```

4. **Restart Backend**
   ```bash
   kubectl -n gearup rollout restart deployment backend
   ```

## Testing After Fix

### Dev Mode Test
```powershell
# 1. Open frontend
# http://localhost:30000

# 2. Try to signup
# Fill in: username, email, password
# Click Sign Up

# 3. Check backend logs for email simulation
$podName = kubectl -n gearup get pods -l app=backend -o jsonpath='{.items[0].metadata.name}'
kubectl -n gearup logs $podName --tail=20 | Select-String "Email simulation"

# Expected output:
# [DEV MODE] Email simulation - Would send email:
#    To: user@example.com
#    Subject: Welcome to AutoServe! ≡ƒÜù
```

### Login Test
```powershell
# If signup succeeded, you should be able to login
# Note: In dev mode, account verification is skipped
# So you can login immediately after signup
```

## Current Status

| Component | Status | Details |
|-----------|--------|---------|
| Frontend URL | Γ£à FIXED | Now using `http://localhost:30000` |
| SendGrid API Key | ΓÜá∩╕Å EXPIRED | Need to fix - see options above |
| Spring Profile | ΓÜá∩╕Å PROD | Should be DEV for testing |

## Which Option to Choose?

### Use DEV MODE if:
- Γ£à You're testing/developing the application
- Γ£à You don't need to actually send emails
- Γ£à You want faster development cycle
- Γ£à Email functionality is not your current focus

### Use VALID API KEY if:
- Γ£à You need to test email functionality
- Γ£à You're preparing for production
- Γ£à You have a valid SendGrid account and API key
- Γ£à Users need to receive verification emails

## Email Verification Flow (Dev Mode)

```
User Signs Up
    Γåô
Frontend calls POST /api/auth/signup
    Γåô
Backend creates User (enabled=false, verification_code generated)
    Γåô
Backend attempts to send email
    Γåô
MailService detects DEV mode + "dev-api-key"
    Γåô
Email sending is simulated (logged, not actually sent)
    Γåô
Success response returned to frontend
    Γåô
User can login even without email verification
```

## Email Verification Flow (Prod Mode with Valid Key)

```
User Signs Up
    Γåô
Frontend calls POST /api/auth/signup
    Γåô
Backend creates User (enabled=false, verification_code generated)
    Γåô
Backend attempts to send email
    Γåô
Email sent via SendGrid (requires valid API key)
    Γåô
User receives verification email with link: http://localhost:30000/verify?code=...
    Γåô
User clicks link
    Γåô
Frontend calls GET /api/auth/verify?code=...
    Γåô
Backend enables user account
    Γåô
User can now login
```

## Commands Reference

### Quick Fix (DEV MODE)
```bash
# 1. Set dev profile
kubectl -n gearup patch configmap gearup-config \
  -p '{"data":{"SPRING_PROFILE":"dev"}}'

# 2. Set dev API key  
kubectl -n gearup patch secret gearup-secrets \
  -p '{"data":{"SENDGRID_API_KEY":"ZGV2LWFwaS1rZXk="}}'

# 3. Restart
kubectl -n gearup rollout restart deployment backend

# 4. Wait and test
kubectl -n gearup rollout status deployment backend
```

### Check Logs
```bash
kubectl -n gearup logs -f deployment/backend --tail=50
```

### Check if Backend is Ready
```bash
kubectl -n gearup get pods -l app=backend
# Should see: 1/1 Running
```

---

## Summary

**What's Fixed:**
- Γ£à Frontend Base URL now uses correct port (30000)

**What Needs Your Action:**
- ΓÜá∩╕Å Choose either Dev Mode (for testing) or get a valid SendGrid API key (for production)
- ΓÜá∩╕Å Apply the fix using the commands in Option A or Option B above

**Recommended Next Step:**
1. Use **Option A (Dev Mode)** to quickly get working
2. Test signup/login functionality
3. Later, integrate with a real SendGrid API key for email verification

