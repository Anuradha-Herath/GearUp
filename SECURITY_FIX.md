# 🔒 Security Fix - API Key Moved to .env

## Issue Fixed

**Problem:** Gemini API key was hardcoded in `application.yml`

**Solution:** Moved to `.env` file (not committed to git)

## Changes Made

### 1. Added to `.env`
```env
GEMINI_API_KEY=AIzaSyC_L2Rhw9kJyWrX767KfDT9GlDMYL9X-eQ
```

### 2. Updated `application.yml`
```yaml
# Before
gemini:
  api:
    key: ${GEMINI_API_KEY:AIzaSyC_L2Rhw9kJyWrX767KfDT9GlDMYL9X-eQ}

# After
gemini:
  api:
    key: ${GEMINI_API_KEY}
```

### 3. Updated `.env.example`
```env
GEMINI_API_KEY=your-gemini-api-key-here
```

## Why This Matters

✅ **Security:** API keys should never be in version control  
✅ **Flexibility:** Easy to change per environment  
✅ **Best Practice:** Follows 12-factor app principles  

## How It Works

1. `.env` file contains actual API key (gitignored)
2. `application.yml` reads from environment variable
3. `.env.example` shows what's needed (no real keys)

## For New Developers

1. Copy `.env.example` to `.env`
2. Add your actual API key
3. Never commit `.env` file

## Restart Required

```bash
./scripts/restart-backend.sh
```

The backend will now read the API key from `.env` file.

## Summary

✅ API key moved to `.env`  
✅ Not in version control  
✅ Secure and flexible  
✅ Follows best practices  
