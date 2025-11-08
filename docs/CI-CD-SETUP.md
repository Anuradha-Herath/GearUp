# GearUp CI/CD Pipeline Setup Guide

## Overview

This document provides complete setup instructions for the GearUp CI/CD pipeline using GitHub Actions.

## Pipeline Structure

```
┌─────────────┐
│   Code Push │
└──────┬──────┘
       │
       ├──────────────────┬──────────────────┐
       │                  │                  │
       v                  v                  v
  ┌─────────────┐    ┌─────────────┐   ┌──────────────┐
  │  Backend CI │    │ Frontend CI │   │ Docker Build │
  │   (Maven)   │    │   (Node)    │   │  (Multi-arch)│
  └──────┬──────┘    └──────┬──────┘   └──────┬───────┘
         │                  │                 │
         │                  v                 │
         │           ┌─────────────┐          │
         │           │   Security  │          │
         │           │    Scan     │          │
         │           └──────┬──────┘          │
         │                  │                 │
         └──────────────────┼─────────────────┘
                            │
                            v
                  ┌──────────────────────┐
                  │   Staging Deployment │
                  │  (Optional/Dev)      │
                  └──────────┬───────────┘
                             │
                             v (on main branch)
                  ┌──────────────────────┐
                  │   Production Deploy  │
                  │   (Manual + Approval)│
                  └──────────┬───────────┘
                             │
                             v
                  ┌──────────────────────┐
                  │   Health Checks      │
                  │   Smoke Tests        │
                  └──────────────────────┘
```

## Prerequisites

### 1. GitHub Repository Secrets

You need to configure the following secrets in your GitHub repository settings:

```
# Docker Registry
DOCKER_USERNAME                 # Docker Hub username
DOCKER_PASSWORD                 # Docker Hub password (or token)
REGISTRY_URL                    # Optional: private registry URL
REGISTRY_USERNAME               # Optional: private registry username
REGISTRY_PASSWORD               # Optional: private registry password

# AWS (if using AWS deployment)
AWS_ROLE_TO_ASSUME             # IAM role ARN for deployment
AWS_REGION                      # AWS region (e.g., us-east-1)

# Server Access (if using SSH deployment)
DEPLOY_SSH_KEY                  # SSH private key for server access
STAGING_SERVER_IP               # Staging server IP address
PRODUCTION_SERVER_IP            # Production server IP address

# Kubernetes (if using K8s)
KUBE_CONFIG                     # Kubernetes config file

# Notifications
SLACK_WEBHOOK_URL               # Slack webhook for notifications
SLACK_BOT_TOKEN                 # Optional: Slack bot token

# SonarQube (optional)
SONAR_HOST_URL                  # SonarQube server URL
SONAR_TOKEN                     # SonarQube auth token

# Monitoring
DATADOG_API_KEY                 # Optional: Datadog API key
```

### 2. GitHub Environments

Create two GitHub environments for deployment:

**Staging Environment:**
- Name: `staging`
- Protection rules: Optional (can deploy without approval)

**Production Environment:**
- Name: `production`
- Protection rules: 
  - Required reviewers: At least 2 people
  - Restrict who can deploy: Project maintainers/admins
  - Required status checks: All CI checks must pass

### 3. Secrets Configuration Commands

Set secrets using GitHub CLI:

```bash
# Docker
gh secret set DOCKER_USERNAME --body "your-username"
gh secret set DOCKER_PASSWORD --body "your-token"

# AWS
gh secret set AWS_ROLE_TO_ASSUME --body "arn:aws:iam::ACCOUNT-ID:role/role-name"
gh secret set AWS_REGION --body "us-east-1"

# Slack
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/services/..."
```

## Pipeline Details

### 1. Backend CI (`01-ci-backend.yml`)

**Triggers:**
- Push to `main`, `develop`, or `feature/*` branches (if backend files changed)
- Pull requests to `main` or `develop`
- Manual trigger

**Jobs:**
1. **Build and Test**
   - Checks out code
   - Sets up JDK 17
   - Starts MySQL test database
   - Runs Maven build with JaCoCo coverage
   - Uploads coverage to Codecov
   - Checks for security vulnerabilities
   - Comments on PRs

2. **Code Quality**
   - Runs SonarQube analysis
   - Generates code quality reports

3. **Notify**
   - Sends Slack notifications on success/failure

### 2. Frontend CI (`02-ci-frontend.yml`)

**Triggers:**
- Push to `main`, `develop`, or `feature/*` branches (if frontend files changed)
- Pull requests to `main` or `develop`
- Manual trigger

**Jobs:**
1. **Build and Test**
   - Checks out code
   - Sets up Node.js 20
   - Installs dependencies with npm ci
   - Runs ESLint
   - Builds with Vite
   - Uploads build artifacts
   - Analyzes bundle size

2. **Security Scan**
   - Runs npm audit
   - Checks for vulnerable packages

3. **Lighthouse Audit**
   - Runs Lighthouse performance audit
   - Uploads results

### 3. Docker Build (`03-build-docker.yml`)

**Triggers:**
- Successful completion of CI pipelines on main/develop
- Manual trigger
- Changes to docker files

**Jobs:**
1. **Build Backend Image**
   - Multi-stage Docker build
   - Uses layer caching
   - Pushes to Docker Hub/Registry

2. **Build Frontend Image**
   - Node build stage
   - Nginx production stage
   - Pushes to Docker Hub/Registry

### 4. Deploy to Staging (`04-deploy-staging.yml`)

**Triggers:**
- Manual workflow dispatch
- Successful Docker build on develop branch

**Deployment Methods:**
- **ECS:** Updates ECS services
- **Docker Compose:** SSH deploy to server
- **Kubernetes:** Updates K8s deployment

**Checks:**
- Health checks (30 retries, 30s timeout)
- Smoke tests
- Slack notifications

### 5. Deploy to Production (`05-deploy-production.yml`)

**Triggers:**
- Manual workflow dispatch from main branch only

**Process:**
1. Pre-deployment checks
2. Backup current database
3. Deploy with ECS/SSH/K8s
4. Health checks
5. Smoke tests
6. Create GitHub release
7. Slack notifications

**Requires:**
- Approval from environment reviewers
- All CI checks passed
- Version tag exists

### 6. Rollback (`06-rollback.yml`)

**Triggers:**
- Manual workflow dispatch (emergency only)

**Process:**
1. Backup current state
2. Rollback to target version
3. Verify health
4. Create incident report
5. Slack notifications

## Configuration Examples

### Example 1: Docker Hub Deployment

```bash
# Set secrets
gh secret set DOCKER_USERNAME --body "your-docker-username"
gh secret set DOCKER_PASSWORD --body "your-docker-token"

# Images will be pushed to:
# docker.io/your-docker-username/gearup-backend:latest
# docker.io/your-docker-username/gearup-frontend:latest
```

### Example 2: AWS Deployment

```bash
# Create IAM role for deployment (requires ECR, ECS, RDS access)
gh secret set AWS_ROLE_TO_ASSUME --body "arn:aws:iam::123456789:role/gearup-deploy"
gh secret set AWS_REGION --body "us-east-1"
```

### Example 3: SSH Deployment

```bash
# Generate SSH key (if not exists)
ssh-keygen -t ed25519 -f deploy_key -N ""

# Set secrets
gh secret set DEPLOY_SSH_KEY --body "$(cat deploy_key)"
gh secret set STAGING_SERVER_IP --body "192.168.1.10"
gh secret set PRODUCTION_SERVER_IP --body "prod.example.com"

# Add public key to server
ssh-copy-id -i deploy_key.pub ubuntu@server-ip
```

### Example 4: Slack Notifications

```bash
# Create Slack webhook:
# 1. Go to https://api.slack.com/apps
# 2. Create new app
# 3. Enable Incoming Webhooks
# 4. Add new webhook to #deployments channel

gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/services/..."
```

## Monitoring & Logs

### View Workflow Runs

```bash
# List all runs
gh run list --repo owner/repo

# View specific run
gh run view RUN_ID --repo owner/repo --log

# Watch live logs
gh run watch RUN_ID --repo owner/repo --log
```

### Download Artifacts

```bash
# List artifacts
gh run download RUN_ID --repo owner/repo --list

# Download specific artifact
gh run download RUN_ID --repo owner/repo -n "artifact-name"
```

## Status Badges

Add these to your README.md:

```markdown
![Backend CI](https://github.com/YOUR-ORG/gearup/actions/workflows/01-ci-backend.yml/badge.svg)
![Frontend CI](https://github.com/YOUR-ORG/gearup/actions/workflows/02-ci-frontend.yml/badge.svg)
![Docker Build](https://github.com/YOUR-ORG/gearup/actions/workflows/03-build-docker.yml/badge.svg)
![Deploy Production](https://github.com/YOUR-ORG/gearup/actions/workflows/05-deploy-production.yml/badge.svg)
```

## Troubleshooting

### Issue: "Context access might be invalid: AWS_ROLE_TO_ASSUME"

**Solution:** These are warnings from YAML linting. They're safe to ignore if you've set the secrets. The workflow will work correctly.

### Issue: "Jobs fail with 'Workflow was cancelled'"

**Solution:** This happens when concurrency groups are cancelled. Check if you're running duplicate workflows.

### Issue: "Docker push fails - authentication error"

**Solution:** 
1. Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` are correct
2. Use Docker access token instead of password for Docker Hub
3. Check if registry URL is correct

### Issue: "Deployment times out"

**Solution:**
1. Increase health check retries/timeout in workflow
2. Check server resources and capacity
3. Verify network connectivity to server

## Best Practices

1. **Branch Protection:**
   - Require status checks to pass before merging
   - Require code review approval
   - Dismiss stale PR approvals

2. **Commit Messages:**
   - Use conventional commits (feat:, fix:, etc.)
   - Include issue references
   - Add deployment notes if needed

3. **Testing:**
   - Write tests for critical paths
   - Maintain >80% code coverage
   - Include integration tests

4. **Versioning:**
   - Use semantic versioning (major.minor.patch)
   - Tag releases in git
   - Update CHANGELOG

5. **Monitoring:**
   - Set up error tracking (Sentry, DataDog)
   - Monitor application performance
   - Set up alerting for failures

## Advanced Configuration

### Custom Docker Registry

Modify `03-build-docker.yml`:

```yaml
- name: Log in to custom registry
  uses: docker/login-action@v3
  with:
    registry: ${{ secrets.REGISTRY_URL }}
    username: ${{ secrets.REGISTRY_USERNAME }}
    password: ${{ secrets.REGISTRY_PASSWORD }}
```

### Kubernetes Deployment

Modify `04-deploy-staging.yml`:

```bash
- name: Deploy with Kubernetes
  run: |
    kubectl apply -f k8s/
    kubectl rollout status deployment/gearup-backend -n staging
```

### Matrix Strategy

For testing multiple versions:

```yaml
strategy:
  matrix:
    java-version: ['17', '21']
    node-version: ['18.x', '20.x']
```

## Support & Documentation

- GitHub Actions Docs: https://docs.github.com/en/actions
- Docker Buildx: https://docs.docker.com/build/buildx/
- AWS ECS Deployments: https://aws.amazon.com/ecs/

---

**Last Updated:** November 2024
**Maintainer:** DevOps Team
