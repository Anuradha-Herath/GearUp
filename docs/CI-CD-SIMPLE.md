# GearUp Simplified CI/CD Pipeline

## Overview

This is a simplified CI/CD pipeline with only essential features:
- **Backend CI**: Build & Test (Java/Maven)
- **Frontend CI**: Build & Lint (React/Node)
- **Docker Build**: Build and push Docker images
- **Deploy to Staging**: Manual deployment to staging
- **Deploy to Production**: Manual deployment with approval

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
  │   Build &   │    │  Build &    │   │   & Push     │
  │    Test     │    │    Lint     │   │              │
  └──────┬──────┘    └──────┬──────┘   └──────┬───────┘
         │                  │                 │
         └──────────────────┼─────────────────┘
                            │
                            v
                  ┌──────────────────────┐
                  │   Deploy Staging     │
                  │   (Manual)           │
                  └──────────┬───────────┘
                             │
                             v
                  ┌──────────────────────┐
                  │   Deploy Production  │
                  │   (Manual + Approval)│
                  └──────────────────────┘
```

## What's Removed (Simplified)

- ❌ Slack notifications
- ❌ SonarQube code quality analysis
- ❌ Test coverage uploads (Codecov)
- ❌ Security scanning (OWASP dependency check)
- ❌ Lighthouse performance audits
- ❌ PR comments with test results
- ❌ Build artifact uploads
- ❌ Database backups
- ❌ Deployment checklists

## What Remains (Essential)

### 1. Backend CI (`01-ci-backend.yml`)
**Job: build-and-test**
- Checkout code
- Setup JDK 17
- Start MySQL test database
- Build with Maven
- Run tests

### 2. Frontend CI (`02-ci-frontend.yml`)
**Job: build-and-test**
- Checkout code
- Setup Node.js 20
- Install dependencies
- Run ESLint
- Build with Vite

### 3. Docker Build (`03-build-docker.yml`)
**Jobs:**
- `prepare`: Generate image tags
- `build-backend`: Build and push backend Docker image
- `build-frontend`: Build and push frontend Docker image

### 4. Deploy to Staging (`04-deploy-staging.yml`)
**Deployment Methods (choose one):**
- ECS (if using AWS ECS)
- Docker Compose (if using SSH deployment)
- Kubernetes (if using K8s)

**Steps:**
- Deploy application
- Health checks
- Smoke tests

### 5. Deploy to Production (`05-deploy-production.yml`)
**Process:**
1. Pre-deployment checks (verify version tag)
2. Approval (requires human approval)
3. Deploy to production
4. Health checks
5. Smoke tests
6. Create GitHub release

## Required Secrets

```
# Docker Registry
DOCKER_USERNAME                 # Docker Hub username
DOCKER_PASSWORD                 # Docker Hub password/token

# Deployment (choose based on your infrastructure)
# Option 1: AWS ECS
AWS_ROLE_TO_ASSUME             # IAM role ARN
AWS_REGION                      # AWS region

# Option 2: SSH
DEPLOY_SSH_KEY                  # SSH private key
STAGING_SERVER_IP               # Staging server IP
PRODUCTION_SERVER_IP            # Production server IP

# Option 3: Kubernetes
KUBE_CONFIG                     # Kubernetes config file
```

## Setup Instructions

### 1. Set GitHub Secrets

```bash
# Docker credentials
gh secret set DOCKER_USERNAME --body "your-username"
gh secret set DOCKER_PASSWORD --body "your-token"

# Choose ONE of the deployment options:

# Option 1: AWS ECS
gh secret set AWS_ROLE_TO_ASSUME --body "arn:aws:iam::ACCOUNT:role/role-name"
gh secret set AWS_REGION --body "us-east-1"

# Option 2: SSH
gh secret set DEPLOY_SSH_KEY --body "$(cat deploy_key)"
gh secret set STAGING_SERVER_IP --body "192.168.1.10"
gh secret set PRODUCTION_SERVER_IP --body "prod.example.com"

# Option 3: Kubernetes
gh secret set KUBE_CONFIG --body "$(cat ~/.kube/config)"
```

### 2. Create GitHub Environments (for production approval)

```bash
# Go to: Repository Settings > Environments > New environment
# Create "production" environment with:
# - Required reviewers: At least 2 people
# - Required status checks: All CI checks pass
```

### 3. Update Workflow Files if Needed

Edit the deployment URLs in:
- `04-deploy-staging.yml`: Update `staging.gearup.example.com`
- `05-deploy-production.yml`: Update `gearup.example.com`

## How to Use

### Triggering Builds

**Backend/Frontend CI:**
- Automatically runs on push to `main`, `develop`, or `feature/*` branches
- Can be manually triggered via GitHub Actions UI

**Docker Build:**
- Automatically runs after successful CI on `main` or `develop`
- Can be manually triggered

**Staging Deploy:**
- Manual trigger only via `workflow_dispatch`

**Production Deploy:**
- Manual trigger from `main` branch only
- Requires production environment approval

### Monitoring Pipelines

```bash
# View all workflow runs
gh run list

# View specific run details
gh run view RUN_ID --log

# Watch live logs
gh run watch RUN_ID --log
```

## Troubleshooting

### Build Fails: "Context access might be invalid"
This is a YAML linting warning. The workflow will still work if the secrets are configured.

### Build Fails: "Secret not found"
Ensure the secret is set in GitHub Settings > Secrets and Variables > Actions.

### Deployment Fails: Connection Timeout
- Check server IP address is correct
- Verify SSH key or AWS credentials
- Ensure network connectivity to the server

### Docker Build Fails: Authentication Error
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` are correct
- Use Docker access token instead of password for Docker Hub

## Status Badges

Add to your README.md:

```markdown
![Backend CI](https://github.com/YOUR-ORG/gearup/actions/workflows/01-ci-backend.yml/badge.svg)
![Frontend CI](https://github.com/YOUR-ORG/gearup/actions/workflows/02-ci-frontend.yml/badge.svg)
![Docker Build](https://github.com/YOUR-ORG/gearup/actions/workflows/03-build-docker.yml/badge.svg)
![Deploy Production](https://github.com/YOUR-ORG/gearup/actions/workflows/05-deploy-production.yml/badge.svg)
```

## Additional Resources

- GitHub Actions: https://docs.github.com/en/actions
- Docker: https://docs.docker.com/
- Maven: https://maven.apache.org/
- Node.js: https://nodejs.org/

---

**Last Updated:** November 2024
**Simplified Version**
