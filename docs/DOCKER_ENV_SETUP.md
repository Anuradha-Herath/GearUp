# Docker Environment Setup Guide

This document outlines the environment variables and Docker configuration required for the AutoServe application with the new features (Chatbot and Image Handling).

## Features Supported

### 1. **Chatbot Service** ✅
- **Provider**: Google Gemini API
- **Purpose**: Intelligent Q&A system for automobile services
- **Required**: `GEMINI_API_KEY`

### 2. **Image Upload/Handling** ✅
- **Provider**: UploadThing
- **Purpose**: Service image uploads and management
- **Frontend Token**: `VITE_UPLOADTHING_TOKEN` (frontend/.env)

### 3. **Email Notifications** ✅
- **Provider**: SendGrid
- **Purpose**: Appointment confirmations, password resets, service notifications
- **Required**: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`

### 4. **Authentication** ✅
- **Type**: JWT (JSON Web Tokens)
- **Required**: `JWT_SECRET`, `JWT_EXPIRATION`

---

## Environment Variables

### Backend Environment Variables (docker/.env)

```properties
# JWT Configuration
JWT_SECRET=devSecretKeyForJwtTokenGenerationThatShouldBeAtLeast256BitsLongForDevelopment
JWT_EXPIRATION=86400000

# SendGrid Configuration (Email)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=no.replyautoserve@gmail.com

# Gemini API Configuration (Chatbot) 🤖
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxx

# Frontend URL (for email verification links)
FRONTEND_BASE_URL=http://localhost

# Database Configuration
DB_ROOT_PASSWORD=Anu@2001
DB_PASSWORD=Anu@2001
DB_NAME=gearup
DB_USER=gearup_user
DB_PORT=3307

# Spring Profile (dev, prod, test)
SPRING_PROFILES_ACTIVE=prod
```

### Frontend Environment Variables (frontend/.env)

```properties
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# UploadThing Configuration (Image Uploads)
VITE_UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza19saXZlX2ZiZDcwYmM2ZjhhODRlMzE1ZDQ5ZGU4NWY4OWRjNzUxNzBlYTgwZDVhMDJkODNiODY3MGYyZDUxMzFjZjgyZWEiLCJhcHBJZCI6IjRvd2lveXYzd2YiLCJyZWdpb25zIjpbInNlYTEiXX0=
```

---

## Obtaining API Keys

### 1. Gemini API Key 🔑
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click on "Get API Key"
3. Select or create a Google Cloud Project
4. Copy the API key
5. Add to `.env` as `GEMINI_API_KEY`

**Important**: Keep this key secure and never commit it to version control!

### 2. SendGrid API Key 📧
1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com/)
2. Go to Settings → API Keys
3. Create a new API key with "Mail Send" permissions
4. Copy the key
5. Add to `.env` as `SENDGRID_API_KEY`

### 3. UploadThing Token 📤
1. Sign up at [uploadthing.com](https://uploadthing.com/)
2. Create a new app
3. Get your API key
4. Add to `frontend/.env` as `VITE_UPLOADTHING_TOKEN`

---

## Docker Compose Usage

### Development Mode
```bash
cd docker
docker-compose up --build
```

### Production Mode
```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Stop Containers
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

---

## Service Configuration in docker-compose.yml

### Backend Service
- **Port**: 8080
- **Database**: MySQL (service: `db`)
- **Environment Variables**: All from `.env` are passed automatically
- **Dependencies**: 
  - `GeminiService` for chatbot responses
  - `SendGridService` for emails
  - `VectorDBService` for context retrieval

### Frontend Service
- **Port**: 80
- **Build**: Multi-stage build with Node.js and Nginx
- **Environment Variables**: 
  - `VITE_API_BASE_URL`: Backend API endpoint
  - `VITE_UPLOADTHING_TOKEN`: Image upload token

### Database Service
- **Port**: 3306 (mapped to 3307 on host)
- **Image**: MySQL 8.0 Oracle
- **Persistence**: `mysql_data` volume
- **Initialization**: Runs migration scripts from `database/migrations/`

---

## Health Checks

All services include health checks:

- **Database**: MySQL health check via `mysqladmin ping`
- **Backend**: HTTP GET to `/actuator/health`
- **Frontend**: HTTP GET to `/health` endpoint

---

## Troubleshooting

### Backend Container Exiting
1. Check logs: `docker-compose logs backend`
2. Verify environment variables are set in `.env`
3. Ensure `GEMINI_API_KEY` is valid
4. Check database connectivity

### Chatbot Returning Empty Responses
- Verify `GEMINI_API_KEY` in `.env`
- Check Gemini API quota hasn't been exceeded
- Review backend logs for API errors

### Image Upload Failing
- Verify `VITE_UPLOADTHING_TOKEN` in `frontend/.env`
- Check UploadThing account and API key validity
- Review browser console for CORS errors

### Database Connection Issues
- Verify `DATABASE_PASSWORD` matches `DB_PASSWORD`
- Check database is healthy: `docker-compose ps`
- Ensure port 3307 isn't already in use

---

## Performance Notes

### Resource Allocation
- **Backend**: 1-2 CPU cores, 768MB-1.5GB RAM
- **Frontend**: 0.5-1 CPU core, 128MB-256MB RAM
- **Database**: 1-2 CPU cores, 1-2GB RAM

### Optimization
- Backend uses G1GC garbage collector
- API responses are cached where possible
- Frontend assets are minified and compressed

---

## Security Considerations

1. **Never commit `.env` to version control** ⚠️
2. **Rotate API keys regularly** 🔄
3. **Use strong JWT_SECRET** (minimum 256 bits) 🔐
4. **Enable HTTPS in production** 🔒
5. **Run containers as non-root user** ✅

---

## Related Documentation

- [Backend Docker Guide](BACKEND_DOCKER_GUIDE.md)
- [Frontend Docker Guide](FRONTEND_DOCKER_GUIDE.md)
- [Docker Compose Guide](DOCKER_COMPOSE_GUIDE.md)
- [Chatbot Architecture](../docs/chatbot/02-architecture.md)

