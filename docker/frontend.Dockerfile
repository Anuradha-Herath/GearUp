# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm install --prefer-offline --no-audit

# Copy source code
COPY frontend/ ./

# Build
RUN npm run build

# Production stage - Use Apache httpd instead of nginx (simpler, fewer permission issues)
FROM httpd:2.4-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/local/apache2/htdocs/

# Configure Apache for SPA (serve index.html for all routes)
RUN echo '<VirtualHost *:80>' > /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo 'DocumentRoot /usr/local/apache2/htdocs' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo '<Directory /usr/local/apache2/htdocs>' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo 'RewriteEngine On' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo 'RewriteBase /' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo 'RewriteRule ^index\.html$ - [L]' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo 'RewriteCond %{REQUEST_FILENAME} !-f' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo 'RewriteCond %{REQUEST_FILENAME} !-d' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo 'RewriteRule . /index.html [L]' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo '</Directory>' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo '</VirtualHost>' >> /usr/local/apache2/conf/extra/httpd-spa.conf && \
    echo 'Include conf/extra/httpd-spa.conf' >> /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf

EXPOSE 80