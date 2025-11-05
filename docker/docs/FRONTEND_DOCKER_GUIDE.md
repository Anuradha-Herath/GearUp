# Frontend Docker Configuration

This directory contains the Docker configuration for the GearUp frontend application built with React and Vite.

## 🏗️ Architecture

The Dockerfile uses a **multi-stage build** approach with two stages:

1. **Builder Stage**: Compiles the React application using Node.js
2. **Production Stage**: Serves the static files using Nginx

## 📋 Features

### Security Best Practices
- ✅ Multi-stage build to minimize final image size
- ✅ Non-root user execution
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ Minimal Alpine-based images
- ✅ dumb-init for proper signal handling

### Performance Optimizations
- ✅ Gzip compression enabled
- ✅ Static asset caching (1 year for immutable assets)
- ✅ Optimized chunk splitting in Vite config
- ✅ Efficient layer caching

### Production Ready
- ✅ Health check endpoint at `/health`
- ✅ SPA routing support (all routes serve index.html)
- ✅ Proper error handling
- ✅ Logging configuration

## 🚀 Usage

### Build the Image

From the project root directory:

```bash
# Build the frontend image
docker build -f docker/frontend.Dockerfile -t gearup-frontend:latest .
```

### Run the Container

```bash
# Run the container
docker run -d \
  --name gearup-frontend \
  -p 80:80 \
  gearup-frontend:latest
```

### With Docker Compose

From the `docker` directory:

```bash
docker-compose up frontend
```

## 🔧 Configuration

### Environment Variables

The frontend uses environment variables defined in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

> **Note**: For Docker deployments, you may need to update the API URL to point to the backend service.

### Nginx Configuration

The Dockerfile includes a custom Nginx configuration that:
- Handles SPA routing (all routes serve index.html)
- Adds security headers
- Enables gzip compression
- Caches static assets
- Provides a health check endpoint

### Port Configuration

- **Development**: Port 5173 (Vite dev server)
- **Preview**: Port 3000 (Vite preview)
- **Production (Docker)**: Port 80 (Nginx)

## 🏥 Health Checks

The container includes a health check endpoint:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' gearup-frontend

# Manual health check
curl http://localhost/health
```

## 📦 Image Size Optimization

The multi-stage build significantly reduces the final image size:

- **Builder stage**: ~500MB (includes Node.js and build tools)
- **Final image**: ~25-30MB (only Nginx and static files)

## 🔍 Debugging

### View Nginx Logs

```bash
# Access logs
docker logs gearup-frontend

# Follow logs
docker logs -f gearup-frontend
```

### Access Container Shell

```bash
# Access the container (as non-root user)
docker exec -it gearup-frontend sh
```

### Check Nginx Configuration

```bash
# Test nginx configuration
docker exec gearup-frontend nginx -t

# View nginx config
docker exec gearup-frontend cat /etc/nginx/conf.d/default.conf
```

## 🛠️ Development vs Production

### Development Mode

For development, use Vite's dev server:

```bash
cd frontend
npm install
npm run dev
```

### Production Mode (Local)

Test the production build locally:

```bash
cd frontend
npm run build
npm run preview
```

### Production Mode (Docker)

Use the Dockerfile for containerized production deployment.

## 📝 Build Arguments

You can customize the build with build arguments:

```bash
# Use a different Node version
docker build \
  --build-arg NODE_VERSION=20-alpine \
  -f docker/frontend.Dockerfile \
  -t gearup-frontend:latest \
  .
```

## 🔐 Security Considerations

1. **Non-root User**: The container runs as a non-root user (`nginx-app`)
2. **Security Headers**: Configured to prevent common web vulnerabilities
3. **Minimal Image**: Uses Alpine Linux for minimal attack surface
4. **No Sensitive Data**: Environment variables are build-time only
5. **Health Checks**: Enables container orchestration health monitoring

## 🚦 CI/CD Integration

Example GitHub Actions workflow:

```yaml
- name: Build Frontend Image
  run: |
    docker build -f docker/frontend.Dockerfile -t gearup-frontend:${{ github.sha }} .
    docker tag gearup-frontend:${{ github.sha }} gearup-frontend:latest
```

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🐛 Troubleshooting

### Issue: Container starts but site is not accessible

**Solution**: Check if the port mapping is correct and not blocked by firewall.

```bash
docker ps
netstat -an | findstr :80
```

### Issue: SPA routes return 404

**Solution**: The Nginx configuration should handle this. Verify the configuration:

```bash
docker exec gearup-frontend cat /etc/nginx/conf.d/default.conf | grep try_files
```

### Issue: Changes not reflected after rebuild

**Solution**: Clear Docker cache and rebuild:

```bash
docker build --no-cache -f docker/frontend.Dockerfile -t gearup-frontend:latest .
```

## 📄 License

This configuration is part of the GearUp project.
