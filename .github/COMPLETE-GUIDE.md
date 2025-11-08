# GearUp CI/CD Pipeline - Complete Implementation Guide

## 📋 Overview

Your GearUp project now has a **production-grade CI/CD pipeline** with comprehensive GitHub Actions workflows. This pipeline automates testing, building, and deployment processes.

---

## 🎯 What Was Created

### Workflow Files (6 total)

| File | Purpose | Triggers |
|------|---------|----------|
| `01-ci-backend.yml` | Backend testing & quality checks | Push/PR to backend/ |
| `02-ci-frontend.yml` | Frontend testing & security scan | Push/PR to frontend/ |
| `03-build-docker.yml` | Build & push Docker images | After successful CI |
| `04-deploy-staging.yml` | Deploy to staging environment | Manual or after Docker build |
| `05-deploy-production.yml` | Production deployment | Manual only (main branch) |
| `06-rollback.yml` | Emergency rollback | Manual only |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Overview and quick start |
| `CI-CD-SETUP.md` | Detailed setup instructions |
| `QUICK-REFERENCE.md` | GitHub Actions syntax reference |

### Setup Scripts

| File | Purpose |
|------|---------|
| `setup-secrets.sh` | Bash script to configure secrets |
| `setup-secrets.ps1` | PowerShell script for Windows |

---

## 🚀 Quick Start (5 Minutes)

### 1. Run Setup Script

**On macOS/Linux:**
```bash
cd .github
bash setup-secrets.sh
```

**On Windows PowerShell:**
```powershell
cd .github
.\setup-secrets.ps1
```

### 2. Select Option 1 (Essential Secrets)

Required:
- Docker Hub username
- Docker Hub token (not password)
- Slack webhook URL

### 3. Create GitHub Environments

Go to your repository:
1. **Settings** → **Environments**
2. Click **New environment**
3. Create `staging` (optional protection)
4. Create `production` (required protection rules)

For production, enable:
- ✅ Required reviewers (2+ people)
- ✅ Restrict deployments to main branch
- ✅ Restrict who can deploy (admins only)

### 4. Test It

```bash
# Make a change
git checkout -b feature/test
echo "# Test" >> README.md
git add .
git commit -m "test: ci pipeline"
git push origin feature/test

# Create PR
gh pr create --fill
```

Watch the GitHub Actions tab! 🎉

---

## 📊 Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Push Code                       │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        v            v            v
    ┌─────────┐  ┌─────────┐  ┌──────────┐
    │ Backend │  │Frontend │  │   Code   │
    │   CI    │  │   CI    │  │  Quality │
    │(Maven)  │  │ (Node)  │  │  Checks  │
    └────┬────┘  └────┬────┘  └────┬─────┘
         │             │            │
         └─────────────┼────────────┘
                       │
            ┌──────────v──────────┐
            │   All Checks Pass?  │
            └──────────┬──────────┘
                       │ YES
            ┌──────────v──────────┐
            │   Build Docker      │
            │   Images            │
            └──────────┬──────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       v               v               v
    ┌─────────┐   ┌─────────┐   ┌──────────┐
    │ Staging │   │   Dev   │   │ Docs     │
    │ Deploy  │   │ Deploy  │   │ Deploy   │
    │(Manual) │   │(Auto)   │   │(Manual)  │
    └────┬────┘   └────┬────┘   └────┬─────┘
         │             │            │
         └─────────────┼────────────┘
                       │
    ┌──────────────────v──────────────────┐
    │    Approve (if prod deployment)    │
    │    Requires 2 reviewers              │
    └──────────────────┬──────────────────┘
                       │ APPROVED
            ┌──────────v──────────┐
            │ Database Backup     │
            │ & Verify            │
            └──────────┬──────────┘
                       │
            ┌──────────v──────────┐
            │   Production Deploy │
            │   (ECS/SSH/K8s)     │
            └──────────┬──────────┘
                       │
            ┌──────────v──────────┐
            │   Health Checks     │
            │   Smoke Tests       │
            └──────────┬──────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        v                             v
     SUCCESS                        FAILURE
        │                             │
        v                             v
    Release                    Create Rollback
    GitHub Release             Incident Report
    Slack ✅                    Slack 🚨
```

---

## 🔐 Security & Best Practices

### Included Security Features

✅ **Secret Management**
- No credentials in code
- GitHub Secrets management
- Automatic masking

✅ **Code Quality**
- Automated testing (backend + frontend)
- Code coverage tracking (JaCoCo)
- Linting (ESLint)
- Security scanning (npm audit)

✅ **Deployment Safety**
- Staging environment for testing
- Production requires approval
- Database backups before deploy
- Automatic rollback capability
- Health checks & smoke tests

✅ **Audit Trail**
- Git history
- GitHub Actions logs
- Deployment releases
- Incident reports

### Recommended Additional Setup

1. **Branch Protection Rules**
   - Settings → Branches → Add rule for main
   - ✅ Require status checks to pass
   - ✅ Require PR reviews (2+ people)
   - ✅ Dismiss stale reviews

2. **CODEOWNERS**
   Create `.github/CODEOWNERS`:
   ```
   * @frontend-lead @backend-lead
   /frontend/ @frontend-lead
   /backend/ @backend-lead
   ```

3. **Dependabot** (for dependency updates)
   - Settings → Code Security & Analysis
   - Enable Dependabot alerts
   - Enable Dependabot security updates

---

## 🛠️ Configuration Guide

### Docker Hub Setup

```bash
# 1. Go to https://hub.docker.com/settings/security
# 2. Create new access token
# 3. Set secrets
gh secret set DOCKER_USERNAME --body "your-username"
gh secret set DOCKER_PASSWORD --body "dckr_pat_..."
```

### AWS Deployment (Optional)

```bash
# 1. Create IAM role for GitHub Actions
# 2. Get role ARN
gh secret set AWS_ROLE_TO_ASSUME --body "arn:aws:iam::123456789:role/gearup-deploy"
gh secret set AWS_REGION --body "us-east-1"
```

### SSH Deployment (Optional)

```bash
# 1. Generate SSH key
ssh-keygen -t ed25519 -f ~/.ssh/gearup_deploy -N ""

# 2. Add to server
ssh-copy-id -i ~/.ssh/gearup_deploy.pub ubuntu@server-ip

# 3. Set secrets
gh secret set DEPLOY_SSH_KEY --body "$(cat ~/.ssh/gearup_deploy)"
gh secret set STAGING_SERVER_IP --body "staging.example.com"
gh secret set PRODUCTION_SERVER_IP --body "prod.example.com"
```

### Slack Notifications

```bash
# 1. Go to https://api.slack.com/apps
# 2. Create App → From scratch
# 3. Name: GearUp, Workspace: your-workspace
# 4. Features → Incoming Webhooks → On
# 5. Add New Webhook to Workspace → Select #deployments
# 6. Copy webhook URL
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/..."
```

---

## 📈 Workflow Details

### Backend CI Workflow

**What it does:**
1. Sets up Java 17
2. Starts MySQL test database
3. Runs `mvn clean verify`
4. Runs tests with coverage (JaCoCo)
5. Checks dependencies (OWASP)
6. Uploads coverage to Codecov
7. Runs SonarQube analysis
8. Sends Slack notification

**Runs on:** Push/PR to `backend/**` or manually

**Duration:** ~5-10 minutes

### Frontend CI Workflow

**What it does:**
1. Sets up Node.js 20
2. Installs dependencies (`npm ci`)
3. Runs linter (ESLint)
4. Builds with Vite
5. Runs security audit (`npm audit`)
6. Performs Lighthouse audit
7. Analyzes bundle size
8. Sends Slack notification

**Runs on:** Push/PR to `frontend/**` or manually

**Duration:** ~3-5 minutes

### Docker Build Workflow

**What it does:**
1. Waits for CI to pass
2. Builds backend Docker image (multi-stage)
3. Builds frontend Docker image (Node → Nginx)
4. Pushes to Docker Hub/Registry
5. Tags with: latest, branch, commit hash
6. Uses layer caching for speed

**Runs on:** Successful CI or manually

**Duration:** ~10-15 minutes

### Staging Deployment

**What it does:**
1. Deploys to staging environment
2. Supports: Docker Compose, ECS, Kubernetes
3. Runs health checks (30 retries)
4. Runs smoke tests
5. Creates GitHub release
6. Sends Slack notification

**Runs on:** Manual trigger or after Docker build on develop

**Duration:** ~5-10 minutes

### Production Deployment

**What it does:**
1. Pre-deployment checks
2. Backs up database
3. Deploys to production
4. Runs health checks
5. Runs smoke tests
6. Creates GitHub release
7. Sends Slack notification

**Requires:** Approval from environment reviewers

**Duration:** ~10-15 minutes

### Rollback Workflow

**What it does:**
1. Backs up current production state
2. Restores to previous version
3. Verifies health
4. Creates incident report
5. Sends Slack notification

**Runs on:** Manual trigger (emergency)

**Duration:** ~5-10 minutes

---

## 📊 Monitoring & Insights

### GitHub Actions Dashboard

1. **Actions Tab**
   - View all workflow runs
   - See pass/fail status
   - Download logs and artifacts
   - Re-run specific jobs

2. **Workflow Badges**
   Add to README.md:
   ```markdown
   ![Backend CI](https://github.com/YOUR-ORG/gearup/actions/workflows/01-ci-backend.yml/badge.svg)
   ![Frontend CI](https://github.com/YOUR-ORG/gearup/actions/workflows/02-ci-frontend.yml/badge.svg)
   ![Docker Build](https://github.com/YOUR-ORG/gearup/actions/workflows/03-build-docker.yml/badge.svg)
   ![Deploy Prod](https://github.com/YOUR-ORG/gearup/actions/workflows/05-deploy-production.yml/badge.svg)
   ```

### Slack Notifications

- **CI Success/Failure** - Per workflow
- **Docker Build Complete** - With image tags
- **Deployment Status** - Staging and production
- **Rollback Events** - With reason
- **Action Buttons** - Quick links to workflows/apps

### Code Coverage

- **Codecov Integration** - View coverage trends
- **Upload artifacts** - Test reports in Actions

---

## 🚨 Troubleshooting

### Workflows Not Running

**Problem:** Workflows don't trigger on push

**Solution:**
1. Check `.github/workflows/*.yml` exists
2. Verify correct YAML syntax
3. Check branch protection rules aren't blocking
4. Push to monitored branch (main, develop)

### Secrets Not Found

**Problem:** "Context access might be invalid"

**Solution:**
```bash
# List secrets
gh secret list

# Re-add secret
gh secret set SECRET_NAME --body "value"

# Verify in workflow
# Use: ${{ secrets.SECRET_NAME }}
```

### Docker Push Fails

**Problem:** Authentication error

**Solution:**
- Use Docker Hub **token**, not password
- Create at: https://hub.docker.com/settings/security
- Format: `dckr_pat_xxxxx`

### Health Checks Timeout

**Problem:** Deployment hangs on health checks

**Solution:**
1. Verify app is actually healthy
2. Check health check endpoint
3. Increase retries in workflow (30 → 60)
4. Increase timeout (10s → 30s)

### SSH Deployment Fails

**Problem:** "Permission denied (publickey)"

**Solution:**
1. Verify public key on server: `~/.ssh/authorized_keys`
2. Check SSH key permissions: `chmod 600 deploy_key`
3. Verify server IP/hostname
4. Test manually: `ssh -i deploy_key ubuntu@server`

---

## 📚 Additional Resources

### Official Docs
- [GitHub Actions](https://docs.github.com/en/actions)
- [Docker BuildX](https://docs.docker.com/build/buildx/)
- [Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

### Helpful Tools
- [GitHub CLI](https://cli.github.com/)
- [act](https://github.com/nektos/act) - Run workflows locally
- [GitHub Actions Visual Editor](https://github.com/actions/github-script)

### Templates Available
- AWS ECS deployment
- Kubernetes deployment
- Azure App Service
- Google Cloud Run
- Heroku deployment

---

## 🔄 Maintenance

### Regular Tasks

**Weekly:**
- Review workflow logs
- Check for failed deployments
- Monitor performance metrics

**Monthly:**
- Review and update dependencies
- Check for security vulnerabilities
- Review code coverage trends

**Quarterly:**
- Update GitHub Actions versions
- Review and update workflow files
- Assess deployment process improvements

---

## 💡 Next Steps

1. ✅ **Run setup script** - Configure secrets
2. ✅ **Create environments** - staging + production
3. ✅ **Set branch protection** - main branch
4. ✅ **Add CODEOWNERS** - Review requirements
5. ✅ **Enable Dependabot** - Security updates
6. ✅ **Configure monitoring** - Error tracking
7. ✅ **Test deployment** - Dry run to staging
8. ✅ **Production deployment** - After verification

---

## 📞 Support

### Getting Help

1. Check `.github/CI-CD-SETUP.md` for detailed setup
2. Review `.github/QUICK-REFERENCE.md` for syntax
3. Check workflow logs in GitHub Actions
4. Review individual workflow files (comments included)

### Common Issues

| Issue | Solution |
|-------|----------|
| Secrets not working | Run setup script again, verify with `gh secret list` |
| Workflows not running | Check YAML syntax, verify branch names |
| Tests failing | Check test output in workflow logs |
| Docker push fails | Verify Docker credentials and token |
| Deployment hangs | Increase health check retries/timeout |

---

## 🎉 You're All Set!

Your CI/CD pipeline is ready to:

✅ Automatically test code on every push
✅ Build Docker images on success
✅ Deploy to staging for testing
✅ Deploy to production with approval
✅ Rollback if issues occur
✅ Notify team via Slack
✅ Track deployments with releases

**Happy deploying!** 🚀

---

**Last Updated:** November 2024
**Version:** 1.0
**Status:** Production Ready
