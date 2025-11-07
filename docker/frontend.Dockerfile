# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies with fresh install (no cached modules from Windows)
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY frontend/ ./

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Simple nginx config for SPA
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]