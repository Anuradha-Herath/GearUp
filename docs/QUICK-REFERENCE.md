# ==============================================================================
# GitHub Actions Quick Reference
# ==============================================================================

## Setting Repository Secrets

### Using GitHub CLI
```bash
# Authenticate with GitHub
gh auth login

# Set individual secrets
gh secret set SECRET_NAME --body "secret_value"

# Set from file
gh secret set SECRET_NAME < secret_file.txt

# List all secrets
gh secret list
```

### Using GitHub Web Interface
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Enter name and value
4. Click "Add secret"

## Common Secrets to Configure

```bash
# Docker
gh secret set DOCKER_USERNAME --body "your-username"
gh secret set DOCKER_PASSWORD --body "your-token"

# Slack
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/services/..."

# AWS
gh secret set AWS_ROLE_TO_ASSUME --body "arn:aws:iam::ACCOUNT:role/ROLE"
gh secret set AWS_REGION --body "us-east-1"

# SSH
gh secret set DEPLOY_SSH_KEY --body "$(cat ~/.ssh/deploy_key)"
gh secret set STAGING_SERVER_IP --body "staging.example.com"
gh secret set PRODUCTION_SERVER_IP --body "prod.example.com"
```

## Triggering Workflows Manually

### Using GitHub CLI
```bash
# List workflows
gh workflow list

# Run specific workflow
gh workflow run 05-deploy-production.yml \
  -f version=v1.0.0 \
  -f approval_required=true

# Watch execution
gh run watch
```

### Using GitHub Web Interface
1. Go to Actions tab
2. Select workflow on the left
3. Click "Run workflow" button
4. Fill in required inputs
5. Click "Run workflow"

## Environment Variables in Workflows

### Set per-job
```yaml
jobs:
  build:
    env:
      JAVA_VERSION: 17
      NODE_VERSION: 20
```

### Set per-step
```yaml
- name: Build
  env:
    MAVEN_OPTS: "-Xmx2048m"
  run: mvn clean build
```

### Access secrets
```yaml
- name: Login
  env:
    DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
  run: echo $DOCKER_PASSWORD | docker login
```

## Workflow Triggers

### On Push
```yaml
on:
  push:
    branches: [main, develop]
    paths: [backend/**]
```

### On Pull Request
```yaml
on:
  pull_request:
    branches: [main]
```

### On Schedule (Cron)
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

### Manual Trigger
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        type: choice
        options: [staging, production]
```

### On Workflow Completion
```yaml
on:
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches: [main]
```

## Matrix Strategy

### Testing multiple versions
```yaml
strategy:
  matrix:
    java-version: ['17', '21']
    node-version: ['18.x', '20.x']

steps:
  - uses: actions/setup-java@v4
    with:
      java-version: ${{ matrix.java-version }}
```

### Excluding configurations
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node: [16, 18, 20]
    exclude:
      - os: macos-latest
        node: 16
```

## Using Service Containers

```yaml
services:
  mysql:
    image: mysql:8.0
    env:
      MYSQL_ROOT_PASSWORD: root
    options: >-
      --health-cmd="mysqladmin ping"
      --health-interval=10s
      --health-timeout=5s
      --health-retries=3

steps:
  - run: mysql -h mysql -u root -proot
```

## Artifacts

### Upload
```yaml
- uses: actions/upload-artifact@v3
  with:
    name: build-output
    path: target/
    retention-days: 5
```

### Download
```bash
gh run download RUN_ID -n artifact-name
```

## Caching

### Cache dependencies
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.m2/repository
    key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
    restore-keys: ${{ runner.os }}-maven-
```

### Cache with actions/setup
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'npm'
    cache-dependency-path: 'frontend/package-lock.json'
```

## Conditional Execution

### If condition
```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: ./deploy.sh

- name: Notify
  if: failure()
  run: notify.sh
```

### Job dependencies
```yaml
jobs:
  test:
    # runs first
  deploy:
    needs: test
    if: success()
    # runs after test succeeds
```

## Secrets and Environment Variables

### Mask sensitive data
```yaml
- name: Display secret
  run: |
    echo "::add-mask::${{ secrets.SECRET }}"
    echo "Secret is: ${{ secrets.SECRET }}"
```

### Set output variable
```yaml
- id: version
  run: echo "number=1" >> $GITHUB_OUTPUT

- run: echo ${{ steps.version.outputs.number }}
```

## GitHub Context

### Common context variables
```yaml
${{ github.actor }}           # User who triggered workflow
${{ github.ref }}             # Branch/tag ref
${{ github.sha }}             # Commit SHA
${{ github.event_name }}      # Event type (push, pull_request, etc)
${{ github.repository }}      # owner/repo
${{ github.workspace }}       # Working directory
${{ github.run_id }}          # Workflow run ID
${{ runner.os }}              # OS of runner
```

## Debugging

### Enable debug logging
```bash
gh secret set ACTIONS_STEP_DEBUG --body "true"
```

### In workflow file
```yaml
- run: |
    echo "Debug mode enabled"
    set -x
    ./build.sh
```

## Performance Tips

1. **Use caching** - Cache dependencies and build artifacts
2. **Use matrix** - Run tests in parallel on multiple versions
3. **Use concurrency** - Cancel previous runs on new push
4. **Limit runners** - Only run jobs when necessary
5. **Use self-hosted** - For long/resource-intensive jobs

## Common Commands

```bash
# Clone repo with workflows
git clone https://github.com/owner/repo.git

# Create new workflow file
touch .github/workflows/new-workflow.yml

# Validate workflow locally (requires act)
act push

# View logs for specific job
gh run view RUN_ID --log | grep JOB_NAME
```

## Resources

- Actions Marketplace: https://github.com/marketplace?type=actions
- Official Docs: https://docs.github.com/en/actions
- Status Badges: https://github.com/YOUR-ORG/repo/actions/workflows/WORKFLOW.yml
