# Security Best Practices for GearUp Backend

## ⚠️ Critical Security Rules

### 1. **NEVER Hardcode Sensitive Data**

❌ **BAD - DON'T DO THIS:**
```yaml
spring:
  datasource:
    password: Anu@2001  # NEVER hardcode passwords!
jwt:
  secret: mySecretKey123  # NEVER hardcode secrets!
```

✅ **GOOD - DO THIS:**
```yaml
spring:
  datasource:
    password: ${DATABASE_PASSWORD}  # Always use environment variables
jwt:
  secret: ${JWT_SECRET}  # Always use environment variables
```

### 2. **Use Environment Variables**

All sensitive data should be stored in `.env` files that are **NOT committed to git**.

**File: `backend/.env`** (Git-ignored)
```properties
DATABASE_PASSWORD=your-actual-password
JWT_SECRET=your-actual-secret-key
SENDGRID_API_KEY=your-actual-api-key
```

### 3. **Git Ignore Configuration**

Ensure your `.gitignore` includes:
```gitignore
# Environment files with secrets
.env
.env.local
.env.*.local

# Application properties with secrets
**/application-local.yml
**/application-secret.yml
```

## 🔐 Secrets Management

### Development Environment

**Use `.env` file:**
```properties
# backend/.env (NEVER commit this file)
DATABASE_PASSWORD=dev_password_123
JWT_SECRET=dev_jwt_secret_at_least_256_bits_long
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### Production Environment

**Option 1: Environment Variables**
```bash
export DATABASE_PASSWORD="prod_secure_password"
export JWT_SECRET="prod_jwt_secret_very_long_and_secure"
export SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"
```

**Option 2: Docker Secrets** (Recommended for Docker Swarm)
```yaml
services:
  backend:
    secrets:
      - db_password
      - jwt_secret
    environment:
      DATABASE_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret

secrets:
  db_password:
    external: true
  jwt_secret:
    external: true
```

**Option 3: Kubernetes Secrets** (Recommended for Kubernetes)
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: gearup-secrets
type: Opaque
data:
  database-password: <base64-encoded>
  jwt-secret: <base64-encoded>
```

**Option 4: Cloud Secret Managers**
- **AWS Secrets Manager**
- **Azure Key Vault**
- **Google Cloud Secret Manager**
- **HashiCorp Vault**

### CI/CD Environment

**GitHub Actions Example:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        env:
          DATABASE_PASSWORD: ${{ secrets.DATABASE_PASSWORD }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY }}
        run: |
          echo "Deploying with secrets from GitHub Secrets..."
```

## 🛡️ Password Security Checklist

### Database Passwords
- [ ] **Never** commit passwords to git
- [ ] Use strong passwords (min 16 characters)
- [ ] Include uppercase, lowercase, numbers, special chars
- [ ] Different passwords for dev/staging/prod
- [ ] Rotate passwords regularly (every 90 days)
- [ ] Use password managers to generate/store

### JWT Secrets
- [ ] **Minimum 256 bits (32 characters)**
- [ ] Use cryptographically secure random generation
- [ ] Different secrets for each environment
- [ ] Never reuse secrets across projects
- [ ] Rotate regularly (every 6 months)

### API Keys
- [ ] Store in environment variables
- [ ] Never log API keys
- [ ] Use separate keys for dev/prod
- [ ] Monitor API key usage
- [ ] Rotate if compromised

## 📝 How to Generate Secure Secrets

### Generate JWT Secret (256-bit)
```powershell
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Or using OpenSSL (if installed)
openssl rand -base64 64
```

### Generate Strong Database Password
```powershell
# PowerShell
-join ((33..126) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Generate UUID-based Secret
```powershell
# PowerShell
[guid]::NewGuid().ToString() + [guid]::NewGuid().ToString()
```

## 🚨 What to Do If Secrets Are Exposed

### If You Accidentally Committed Secrets:

1. **Immediately rotate all exposed secrets**
   ```bash
   # Change database password
   # Generate new JWT secret
   # Regenerate API keys
   ```

2. **Remove from Git history**
   ```bash
   # Use BFG Repo-Cleaner or git filter-branch
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: coordinate with team)
   git push origin --force --all
   ```

3. **Add to .gitignore immediately**
   ```bash
   echo ".env" >> .gitignore
   git add .gitignore
   git commit -m "Add .env to gitignore"
   ```

4. **Notify your team**

5. **Review access logs** for unauthorized access

## 📋 Environment Variable Naming Conventions

### Standard Naming
```properties
# Use UPPERCASE with underscores
DATABASE_PASSWORD=xxx
JWT_SECRET=xxx

# Prefix by service/component
SENDGRID_API_KEY=xxx
SENDGRID_FROM_EMAIL=xxx

# Suffix with environment (optional)
DATABASE_PASSWORD_PROD=xxx
DATABASE_PASSWORD_DEV=xxx
```

## 🔍 Security Audit Script

Create a script to check for hardcoded secrets:

**File: `scripts/security-check.ps1`**
```powershell
# Check for potential hardcoded secrets
Write-Host "Scanning for hardcoded secrets..." -ForegroundColor Yellow

$patterns = @(
    "password\s*=\s*['\"][^$]",
    "secret\s*=\s*['\"][^$]",
    "api[_-]?key\s*=\s*['\"][^$]",
    "token\s*=\s*['\"][^$]"
)

$files = Get-ChildItem -Recurse -Include *.java,*.yml,*.yaml,*.properties -Exclude .env*

foreach ($file in $files) {
    foreach ($pattern in $patterns) {
        $matches = Select-String -Path $file.FullName -Pattern $pattern
        if ($matches) {
            Write-Host "⚠️  Potential secret found in: $($file.FullName)" -ForegroundColor Red
            $matches | ForEach-Object { Write-Host "   Line $($_.LineNumber): $($_.Line)" }
        }
    }
}

Write-Host "Security scan complete!" -ForegroundColor Green
```

## 🏆 Best Practices Summary

### DO ✅
1. **Use environment variables** for all secrets
2. **Add `.env` to `.gitignore`**
3. **Use `.env.example`** with dummy values for documentation
4. **Rotate secrets regularly**
5. **Use different secrets** for dev/staging/prod
6. **Generate cryptographically secure** random secrets
7. **Use secret management tools** in production
8. **Implement proper access controls**
9. **Monitor and audit** secret access
10. **Document secret requirements** (length, format, etc.)

### DON'T ❌
1. **Never hardcode passwords** in source code
2. **Never commit `.env` files** to git
3. **Never log secrets** in application logs
4. **Never share secrets** via email/chat
5. **Never reuse secrets** across environments
6. **Never use weak/simple secrets** in production
7. **Never store secrets** in frontend code
8. **Never expose secrets** in error messages
9. **Never use default passwords** in production
10. **Never skip security reviews**

## 📚 Additional Resources

- [OWASP Top 10 Security Risks](https://owasp.org/www-project-top-ten/)
- [12-Factor App - Config](https://12factor.net/config)
- [Spring Boot Security Best Practices](https://spring.io/guides/topicals/spring-security-architecture/)
- [Docker Secrets Documentation](https://docs.docker.com/engine/swarm/secrets/)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

## 🔗 Related Files

- `backend/.env.example` - Template for environment variables
- `backend/.gitignore` - Files excluded from git
- `docker/.env.example` - Docker environment template
- `docker/docker-compose.yml` - Docker configuration

---

**Remember:** Security is not a one-time task, it's an ongoing process! 🔐
