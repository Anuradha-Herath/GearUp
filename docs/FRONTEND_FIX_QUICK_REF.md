# Frontend API Connection - Quick Reference

## Issue Fixed ✅

**Error**: `net::ERR_NAME_NOT_RESOLVED` when trying to reach `http://backend:8080`

**Reason**: Browser can't resolve internal Kubernetes DNS names

**Solution**: Use NodePort `localhost:30080` instead of internal DNS `backend:8080`

## Current Access URLs

```
Frontend:   http://localhost:30000
Backend:    http://localhost:30080
API:        http://localhost:30080/api
```

## File Changed

- ✅ `frontend/.env` - Updated `VITE_API_BASE_URL=http://localhost:30080/api`

## Steps Taken

1. ✅ Updated `.env` file with correct NodePort
2. ✅ Rebuilt frontend Docker image
3. ✅ Restarted frontend pod

## Deployment Status

```
Deployments:  ✅ All Ready (3/3)
Pods:         ✅ All Running (3/3)
Services:     ✅ All Created (3/3)

Frontend:     1/1 Running
Backend:      1/1 Running
MySQL:        1/1 Running
```

## Testing

Open http://localhost:30000 in your browser and try:
- Login
- Signup
- Any API call

All should work now! 🎉

---

## Why This Architecture

### Browser Cannot Access Internal Kubernetes DNS

```
Browser Request: http://backend:8080
                    ↓
Browser: "What is 'backend'?"
                    ↓
DNS Lookup: ❌ Failed (only works inside cluster)
                    ↓
Error: net::ERR_NAME_NOT_RESOLVED
```

### Solution: Use NodePort

```
Browser Request: http://localhost:30080
                    ↓
Browser: "Connect to 127.0.0.1:30080"
                    ↓
Kubernetes: Route to backend:8080 inside cluster ✅
                    ↓
Backend responds ✅
```

## If You Need to Change the API URL Again

1. Edit `frontend/.env`
2. Run: `docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .`
3. Run: `kubectl -n gearup rollout restart deployment frontend`

That's it! The new configuration will take effect immediately.
