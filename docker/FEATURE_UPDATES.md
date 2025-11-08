# Docker Configuration Updates for New Features

## Summary of Changes

Your project now includes two major new features that require Docker configuration updates:

1. **Chatbot Service** (Gemini API integration)
2. **Image Upload/Handling** (UploadThing integration)

---

## Files Modified ✅

### 1. **docker/docker-compose.yml**
- ✅ Added `GEMINI_API_KEY` environment variable to backend service
- Ensures chatbot API key is passed to the Spring Boot application
- Location: Line ~115 (backend service > environment section)

### 2. **docker/docker-compose.prod.yml**
- ✅ Added `GEMINI_API_KEY` environment variable to backend service
- Ensures production environment also has chatbot configuration
- Location: Line ~64 (backend service > environment section)

### 3. **docker/.env**
- ✅ Added `GEMINI_API_KEY` configuration
- Removed trailing quote from previous entry
- Now properly formatted with all required variables

### 4. **docker/backend.Dockerfile**
- ✅ Updated comments to reflect all dependencies
- Now documents: Chatbot (OkHttp, Gson), Image Upload, JWT, Email
- Multi-stage build properly handles all dependencies

### 5. **docker/DOCKER_ENV_SETUP.md** (NEW)
- ✅ Comprehensive documentation created
- Contains setup instructions for all API keys
- Troubleshooting guide for common issues

---

## Environment Variables Checklist

### ✅ Backend (.env in docker folder)
```
[✓] JWT_SECRET
[✓] JWT_EXPIRATION
[✓] SENDGRID_API_KEY (Email)
[✓] SENDGRID_FROM_EMAIL
[✓] GEMINI_API_KEY (Chatbot) 🤖 NEW!
[✓] FRONTEND_BASE_URL
[✓] DB_ROOT_PASSWORD
[✓] DB_PASSWORD
[✓] DB_NAME
[✓] DB_USER
[✓] DB_PORT
[✓] SPRING_PROFILES_ACTIVE
```

### ✅ Frontend (.env in frontend folder)
```
[✓] VITE_API_BASE_URL
[✓] VITE_UPLOADTHING_TOKEN (Image Upload) 📤 NEW!
```

---

## How the New Features Work

### 🤖 Chatbot Service (GeminiService)
```
User Query
    ↓
VectorDBService (retrieves context)
    ↓
GeminiService (calls Gemini API with GEMINI_API_KEY)
    ↓
Response returned to frontend
```

**Required**:
- `GEMINI_API_KEY` environment variable
- OkHttp library (for HTTP requests)
- Gson library (for JSON parsing)
- Both already in pom.xml ✅

### 📤 Image Handling (ImageUploader)
```
User uploads image
    ↓
Frontend UploadThing (uses VITE_UPLOADTHING_TOKEN)
    ↓
Image stored and URL returned
    ↓
URL sent to backend (stored in database)
```

**Required**:
- `VITE_UPLOADTHING_TOKEN` in frontend/.env
- No backend changes needed ✅

---

## Next Steps to Get the Application Running

### 1. Start Docker Desktop
- Open Docker Desktop application
- Wait for it to fully load

### 2. Verify Environment Variables
```bash
# Check docker/.env
cat docker/.env

# Check frontend/.env
cat frontend/.env
```

### 3. Build and Run
```bash
cd docker
docker-compose up --build
```

### 4. Check Logs
```bash
# View all logs
docker-compose logs -f

# View backend logs specifically
docker-compose logs -f backend
```

### 5. Test the Application
- Frontend: http://localhost
- Backend: http://localhost:8080
- API Health: http://localhost:8080/actuator/health

---

## Debugging the Login Error

If you're still seeing `ERR_EMPTY_RESPONSE` on `/api/auth/login`:

### 1. Check Backend Logs
```bash
docker-compose logs backend
```

**Look for**:
- ✅ "Started Application in X seconds"
- ❌ Any error about missing `GEMINI_API_KEY`
- ❌ Any database connection errors

### 2. Common Issues

**Issue**: Backend container is exiting
- **Solution**: Verify `GEMINI_API_KEY` is set in docker/.env
- **Check**: `docker-compose logs backend`

**Issue**: "Failed to instantiate GeminiService"
- **Solution**: Make sure `GEMINI_API_KEY` is not empty
- **Check**: `grep GEMINI_API_KEY docker/.env`

**Issue**: Database connection failed
- **Solution**: Ensure DB container is healthy
- **Check**: `docker ps` (should show db as "healthy")

### 3. Restart Everything
```bash
# Stop all containers
docker-compose down

# Remove volumes (fresh database)
docker volume rm docker_mysql_data

# Rebuild and start
docker-compose up --build -d

# Check status
docker-compose ps
```

---

## Configuration Flow

```
.env variables (docker/.env)
    ↓
Docker environment variables passed to containers
    ↓
Spring Boot application.yml reads via ${}
    ↓
Services (GeminiService, ChatbotService) receive config
    ↓
Application runs with full functionality ✅
```

---

## Application.yml Configuration

Your backend reads these properties:

```yaml
gemini:
  api:
    key: ${GEMINI_API_KEY}

sendgrid:
  api:
    key: ${SENDGRID_API_KEY}
  from:
    email: ${SENDGRID_FROM_EMAIL}

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION}
```

✅ All now properly configured in Docker!

---

## Production Considerations

For production deployment:
1. Use strong, unique `JWT_SECRET` (not the dev one)
2. Store API keys in secure vault (not in .env)
3. Use separate `.env.prod` with production values
4. Enable HTTPS for all external communication
5. Implement rate limiting for Gemini API calls
6. Monitor UploadThing bandwidth usage

---

## Testing the Chatbot

Once running:

1. Open frontend at http://localhost
2. Go to chatbot section
3. Ask a question like: "What services do you offer?"
4. Expected: Response from Gemini AI based on your knowledge base

**If not working**:
- Check backend logs: `docker-compose logs backend`
- Verify Gemini API key quota
- Test API directly: `curl http://localhost:8080/api/chatbot`

---

## Files Reference

- **Docker Compose**: `docker/docker-compose.yml`
- **Production Override**: `docker/docker-compose.prod.yml`
- **Backend Dockerfile**: `docker/backend.Dockerfile`
- **Frontend Dockerfile**: `docker/frontend.Dockerfile`
- **Environment Setup**: `docker/.env`
- **Documentation**: `docker/DOCKER_ENV_SETUP.md`

