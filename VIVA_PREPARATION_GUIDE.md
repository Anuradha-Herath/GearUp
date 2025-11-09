# Kubernetes Viva Preparation Guide 🚀

## Overview
Based on your GearUp application's Kubernetes implementation, here are the **likely questions** your examiners will ask, organized by difficulty level.

---

## 📋 BASIC CONCEPTS (Easy - Understanding Level)

### 1. **What is Kubernetes and why do we use it?**
**Expected Answer:**
- Container orchestration platform that automates deployment, scaling, and management of containerized applications
- **Key benefits:**
  - Automated deployment and rollbacks
  - Self-healing (restarts failed containers)
  - Resource optimization
  - Load balancing and service discovery
  - Rolling updates with zero downtime
  - Multi-container management at scale

### 2. **What are the main Kubernetes objects you're using in your deployment?**
**Your Answer (from your implementation):**
- **Namespace** (`1-namespace.yaml`): `gearup` - isolates all resources
- **ConfigMap** (`2-configmap.yaml`): stores non-sensitive config (DB_HOST, SPRING_PROFILE, etc.)
- **Secret** (`3-secrets.yaml`): stores sensitive data (passwords, API keys)
- **PersistentVolumeClaim** (`4-mysql-pvc.yaml`): persistent storage for MySQL
- **Deployment** (MySQL, Backend, Frontend): manages pod replicas
- **Service** (ClusterIP, NodePort): exposes applications
- **Ingress** (optional): external access with HTTP routing

### 3. **What is a Namespace and why did you create "gearup"?**
**Your Answer:**
- Logical partition/isolation of resources within a Kubernetes cluster
- **Why "gearup" namespace?**
  - Keeps all project resources isolated
  - Prevents name conflicts with other applications
  - Easier resource management and cleanup
  - Can apply different policies (RBAC, resource quotas)
  - Multiple teams can use same cluster

### 4. **What is the difference between ConfigMap and Secret?**
**Comparison Table:**

| Aspect | ConfigMap | Secret |
|--------|-----------|--------|
| Purpose | Non-sensitive configuration | Sensitive data |
| Encoding | Plain text | Base64 encoded |
| Visibility | Can be read easily | Should be encrypted at rest |
| Use Cases | DB_HOST, SPRING_PROFILE, PORT numbers | Passwords, API keys, tokens |
| Size Limit | 1MB | 1MB |

**Your Example:**
- **ConfigMap:** `DB_HOST: "mysql"`, `FRONTEND_BASE_URL: "http://localhost:30000"`
- **Secret:** `DB_PASSWORD`, `JWT_SECRET`, `GEMINI_API_KEY`

---

## 🔧 IMPLEMENTATION QUESTIONS (Medium - Application Level)

### 5. **Explain your three-tier architecture deployment:**

**Show this diagram:**
```
┌─────────────────────────────────────────────────────────┐
│            Kubernetes Cluster (gearup namespace)         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │  FRONTEND TIER   │  │  BACKEND TIER    │             │
│  ├──────────────────┤  ├──────────────────┤             │
│  │ Pod: frontend    │  │ Pod: backend     │             │
│  │ Image: React     │  │ Image: Spring    │             │
│  │ Port: 80         │  │ Port: 8080       │             │
│  └──────────────────┘  └──────────────────┘             │
│         │                       │                        │
│         └───────────┬───────────┘                        │
│                     │                                    │
│              ┌──────▼──────┐                            │
│              │ DATABASE    │                            │
│              ├─────────────┤                            │
│              │ Pod: mysql  │                            │
│              │ Port: 3306  │                            │
│              │ Storage: PVC│                            │
│              └─────────────┘                            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**3-Tier Deployment Strategy:**
1. **Frontend (Nginx/React):** 
   - Image: `gearup/frontend:latest`
   - Port: 80 (containerPort)
   - Service Type: NodePort (30001)
   - Resources: 64Mi memory, 50m CPU

2. **Backend (Spring Boot):**
   - Image: `gearup/backend:latest`
   - Port: 8080
   - Service Type: ClusterIP
   - Resources: 512Mi memory, 250m CPU
   - Connects to MySQL via `mysql:3306` DNS

3. **Database (MySQL):**
   - Image: `mysql:5.7`
   - Port: 3306
   - Storage: emptyDir (for dev - should use PVC for prod)
   - Initialized with ConfigMap environment variables

### 6. **How do you pass environment variables to your containers?**

**Answer with examples from your implementation:**

```yaml
# Method 1: From ConfigMap (non-sensitive)
env:
- name: DB_HOST
  valueFrom:
    configMapKeyRef:
      name: gearup-config
      key: DB_HOST

# Method 2: From Secret (sensitive)
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: gearup-secrets
      key: DB_PASSWORD

# Method 3: Direct value
env:
- name: SPRING_PROFILES_ACTIVE
  value: "prod"
```

**Your specific variables:**
- **ConfigMap variables:** DB_HOST, DB_PORT, SPRING_PROFILE, FRONTEND_BASE_URL, JWT_EXPIRATION
- **Secret variables:** DB_PASSWORD, JWT_SECRET, GEMINI_API_KEY, SENDGRID_API_KEY

### 7. **How does the backend communicate with the MySQL database?**

**Answer:**
```
JDBC URL: jdbc:mysql://mysql:3306/gearup?useSSL=false&...

Connection Flow:
1. Backend pod is created
2. Looks up DNS hostname "mysql" → resolves to MySQL Service ClusterIP
3. MySQL Service distributes traffic to MySQL pod on port 3306
4. Connection established using DB_USER and DB_PASSWORD from Secret
```

**Key Point:** Uses Kubernetes DNS service discovery - no need for hardcoded IPs!

### 8. **What are Probes and why are they important?**

**Explain both probes in your deployment:**

| Probe Type | Purpose | Your Implementation | Action |
|-----------|---------|-------------------|--------|
| **Liveness** | Is container alive? | HTTP GET to `/actuator/health/liveness` (backend) | Restart if fails |
| **Readiness** | Is container ready for traffic? | HTTP GET to `/actuator/health/readiness` (backend) | Stop sending traffic if fails |

**Timing (Backend):**
- Liveness: Initial 60s delay, then check every 10s, fail after 3 retries
- Readiness: Initial 30s delay, then check every 5s, fail after 3 retries

**Why important:**
- Prevents routing to containers still starting up
- Auto-restarts unhealthy containers
- Ensures high availability

### 9. **How do you ensure persistent data in MySQL?**

**Current implementation:**
```yaml
volumes:
- name: mysql-data
  emptyDir: {}                    # ❌ Data LOST on pod restart!
```

**What you should say for production:**
- Use **PersistentVolumeClaim (PVC)** linked to PersistentVolume
- PVC `4-mysql-pvc.yaml` should specify storage class and size
- Data survives pod restarts and node failures

**Example production fix:**
```yaml
- name: mysql-data
  persistentVolumeClaim:
    claimName: mysql-pvc
```

### 10. **What does your Service definition look like and what are the types?**

**Your Service types:**
```yaml
# Frontend Service (NodePort)
type: NodePort              # Accessible externally on node IP:port
port: 80                    # Service port
targetPort: 80              # Container port
nodePort: 30001             # External access on any node:30001

# Backend Service (ClusterIP)
type: ClusterIP             # Only accessible within cluster (default)
port: 8080

# MySQL Service (ClusterIP)
type: ClusterIP
port: 3306
```

**Service Types Explained:**
- **ClusterIP:** Internal cluster communication (backend ↔ MySQL)
- **NodePort:** External access via node IP:port (frontend)
- **LoadBalancer:** Cloud provider load balancer
- **ExternalName:** Maps to external DNS

---

## 🎯 ADVANCED QUESTIONS (Hard - Problem Solving)

### 11. **Your deployment currently uses "latest" tags. What's wrong with this for production?**

**Problems:**
- ❌ No version tracking
- ❌ Can't rollback to specific versions
- ❌ Caching issues (imagePullPolicy: IfNotPresent)
- ❌ Different environments might run different images

**Solution:**
```yaml
# Use semantic versioning
image: gearup/backend:1.0.0
image: gearup/frontend:1.0.0
image: mysql:5.7.42

# Set imagePullPolicy correctly
imagePullPolicy: Always        # For "latest" or mutable tags
imagePullPolicy: IfNotPresent  # For immutable versions
```

### 12. **What happens when your backend pod crashes?**

**Auto-recovery mechanism:**
1. Liveness probe fails
2. Kubelet detects failure
3. Pod is automatically restarted (restartPolicy: Always)
4. Readiness probe initially fails (new pod starting)
5. Traffic not routed until readiness probe passes
6. Pod back online

**Show the YAML:**
```yaml
spec:
  restartPolicy: Always         # Always restart failed containers
```

### 13. **Your frontend is currently using emptyDir. Scale this to 3 replicas—what happens?**

**Current YAML:**
```yaml
replicas: 1
```

**If you scale to 3:**
```yaml
replicas: 3  # 3 frontend pods
```

**What happens:**
- 3 separate pod instances created
- Each has its own emptyDir volume (ephemeral, not shared)
- Service load balances traffic across 3 pods
- If pod crashes, new one created
- **Problem:** No shared state - static files OK, but not for stateful apps

**Volume solution needed:**
```yaml
volumes:
- name: nginx-cache
  emptyDir: {}           # OK for ephemeral cache
```

### 14. **How would you update your backend without downtime?**

**Rolling Update Strategy (already in your YAML):**
```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1           # 1 extra pod during update
    maxUnavailable: 0     # Never make pod unavailable
```

**Process:**
1. New backend v1.0.1 image pushed
2. kubectl triggers rolling update
3. New pod created with v1.0.1
4. Readiness probe waits for new pod healthy
5. Service switches traffic to new pod
6. Old pod terminated gracefully (terminationGracePeriodSeconds: 30)
7. Zero downtime!

### 15. **Your secrets are base64 encoded in YAML. Is this secure?**

**Answer: ⚠️ NO, it's NOT truly secure!**

**Issues:**
- Base64 is **encoding, not encryption**
- Anyone with kubectl access can read secrets
- YAML stored in git (if not .gitignored)

**Proper security:**
```bash
# Use Kubernetes secret encryption at rest
# Configure encryption provider in kube-apiserver

# Better: Use external secrets (HashiCorp Vault, Azure Key Vault)
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: vault
spec:
  provider:
    vault:
      server: "https://vault.example.com"
```

### 16. **How would you handle database migrations in Kubernetes?**

**Current approach:** emptyDir (data lost)

**Production approach:**
```yaml
# Option 1: Init container (run once)
spec:
  initContainers:
  - name: db-migrate
    image: liquibase:latest
    command: ["liquibase", "update"]
    
# Option 2: Job resource (one-time task)
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: gearup/backend:1.0.0
        command: ["java", "-cp", ".", "db.migration.Main"]
```

---

## 🚀 DEPLOYMENT & TROUBLESHOOTING (Medium-Hard)

### 17. **Walk us through your deployment process step by step:**

**Your answer:**
```bash
# 1. Navigate to k8s directory
cd k8s

# 2. Create namespace
kubectl apply -f 1-namespace.yaml

# 3. Create ConfigMap (non-sensitive config)
kubectl apply -f 2-configmap.yaml

# 4. Create Secrets (sensitive data - base64 encoded)
kubectl apply -f 3-secrets.yaml

# 5. Create storage
kubectl apply -f 4-mysql-pvc.yaml

# 6. Deploy database
kubectl apply -f 5-mysql-deployment.yaml
kubectl apply -f 6-mysql-service.yaml
kubectl wait --for=condition=ready pod -l app=mysql -n gearup

# 7. Deploy backend
kubectl apply -f 7-backend-deployment.yaml
kubectl apply -f 8-backend-service.yaml
kubectl wait --for=condition=ready pod -l app=backend -n gearup

# 8. Deploy frontend
kubectl apply -f 9-frontend-deployment.yaml
kubectl apply -f 10-frontend-service.yaml

# 9. Verify
kubectl get all -n gearup
```

### 18. **Backend pod is in CrashLoopBackOff. How do you debug?**

**Debugging steps:**

```bash
# 1. Get pod status
kubectl get pods -n gearup -l app=backend
# STATUS: CrashLoopBackOff

# 2. Describe pod for events
kubectl describe pod <pod-name> -n gearup
# Shows: ImagePullBackOff, CrashLoopBackOff, FailedProbe, etc.

# 3. Check logs (most important!)
kubectl logs <pod-name> -n gearup
# See actual Java/application errors

# 4. Get previous logs (if container restarted)
kubectl logs <pod-name> -n gearup --previous

# 5. Interactive debug
kubectl exec -it <pod-name> -n gearup -- /bin/bash
# Check environment variables, file system

# 6. Check environment variables
kubectl exec <pod-name> -n gearup -- env | grep DATABASE

# 7. Check if ConfigMap/Secret mounted correctly
kubectl exec <pod-name> -n gearup -- ls -la /etc/config
kubectl exec <pod-name> -n gearup -- cat /etc/secrets/db-password
```

**Common causes & fixes:**
- Image not found → Fix image name/tag in Deployment
- Database connection failed → Check MySQL pod, DB_HOST, credentials
- Memory exceeded → Check pod logs, increase `limits.memory`
- Port binding failed → Check if port already in use

### 19. **How do you check if all services are running correctly?**

```bash
# Check all resources
kubectl get all -n gearup

# More detailed view
kubectl get pods,svc,deployment -n gearup

# Check pod readiness
kubectl get pods -n gearup -o wide
# Look at READY column (1/1 means ready)

# Check service endpoints
kubectl get endpoints -n gearup
# Should show IP addresses of pods

# Check specific service
kubectl describe svc backend -n gearup
# Shows Endpoints pointing to pod IPs

# Health checks
kubectl get pod frontend-xyz -n gearup -o jsonpath='{.status.conditions[*]}'
```

### 20. **How would you scale your backend to 3 replicas for high availability?**

```bash
# Method 1: kubectl command
kubectl scale deployment backend -n gearup --replicas=3

# Method 2: Edit deployment YAML
kubectl edit deployment backend -n gearup
# Change replicas: 1 → replicas: 3

# Method 3: Apply new YAML
# Edit 7-backend-deployment.yaml:
# spec:
#   replicas: 3

kubectl apply -f 7-backend-deployment.yaml

# Verify
kubectl get pods -n gearup -l app=backend
# Should show 3 running pods
```

---

## 💡 BONUS QUESTIONS & HELM

### 21. **What is Helm and how would you use it for your deployment?**

**What is Helm:**
- Package manager for Kubernetes
- Like `apt-get` for Linux or `pip` for Python
- Templates your YAML files with variables

**Benefits:**
- Reusable chart across different environments
- Version control for deployments
- Easy rollbacks
- Share with community

**Your deployment as Helm chart:**

```
gearup-chart/
├── Chart.yaml                 # Chart metadata
├── values.yaml               # Default values
├── values-dev.yaml           # Dev environment overrides
├── values-prod.yaml          # Prod environment overrides
└── templates/
    ├── namespace.yaml
    ├── configmap.yaml
    ├── secrets.yaml
    ├── mysql-deployment.yaml
    ├── backend-deployment.yaml
    └── frontend-deployment.yaml
```

**Example values.yaml:**
```yaml
replicaCount: 1
image:
  repository: gearup/backend
  tag: latest
database:
  host: mysql
  port: 3306
```

**Deployment:**
```bash
# Dev environment
helm install gearup ./gearup-chart -f values-dev.yaml

# Production
helm install gearup ./gearup-chart -f values-prod.yaml
```

### 22. **Your frontend has only 1 replica. What about high availability?**

**Current state:**
```yaml
replicas: 1  # Single point of failure!
```

**HA Solution:**
```yaml
replicas: 3  # At least 3 replicas

# Add pod disruption budget
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: frontend-pdb
spec:
  minAvailable: 2           # Always keep 2 pods running
  selector:
    matchLabels:
      app: frontend
```

**Benefits:**
- If 1 pod crashes → 2 still running
- Traffic distributed via Service load balancer
- Zero downtime during updates

### 23. **What resource limits do you have and are they appropriate?**

**Your current limits (Backend):**
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

**Explanation:**
- **Requests:** Minimum resources guaranteed (scheduler reserves these)
- **Limits:** Maximum resources pod can use (killed if exceeded)

**Are they appropriate?**
- ✅ Good for development
- ⚠️ For production: benchmark your app first
  - Use monitoring tools (Prometheus, Grafana)
  - Analyze actual memory/CPU usage
  - Set realistic limits (usually 1.5-2x requests)

---

## 🎤 HOW TO PRESENT IN VIVA

### Structure Your Answer:
1. **Start with the big picture** → 3-tier architecture
2. **Explain each component** → Namespace, ConfigMap, Secret, Deployments, Services
3. **Show actual YAML** → Point to your files
4. **Discuss trade-offs** → Why certain choices for dev vs production
5. **Mention improvements** → What would you do differently for production

### Sample Response Flow:

**Q: "Explain your Kubernetes deployment"**

**A:** "Our GearUp application is deployed in a three-tier Kubernetes architecture:

1. **Frontend Tier** - React app served by Nginx in a pod
2. **Backend Tier** - Spring Boot API on port 8080
3. **Database Tier** - MySQL 5.7 database

All resources are isolated in the `gearup` namespace. Configuration is managed through a **ConfigMap** containing non-sensitive variables like database host and Spring profile. Sensitive data like API keys and database credentials are stored in a **Secret** with base64 encoding.

Each tier is managed by a **Deployment**:
- MySQL deployment with 1 replica, MySQL image
- Backend deployment with 1 replica, auto-restart on failure
- Frontend deployment with 1 replica, Nginx image

Services expose these:
- **ClusterIP** for internal communication (backend to MySQL)
- **NodePort** for external access (frontend on port 30001)

Both backend and frontend have **liveness and readiness probes** to ensure high availability. Probes check HTTP endpoints for backend and... [continue with specific examples from your YAML]"

---

## 📊 QUICK REFERENCE TABLE

| Concept | Your Implementation | Production Ready? |
|---------|-------------------|-------------------|
| **Namespace** | gearup | ✅ Yes |
| **ConfigMap** | gearup-config | ✅ Yes |
| **Secret** | gearup-secrets (base64) | ⚠️ Should encrypt at rest |
| **Storage** | emptyDir | ❌ Use PVC for persistence |
| **Replicas** | 1 (all services) | ❌ Use 3+ for HA |
| **Probes** | Liveness + Readiness | ✅ Yes, good |
| **Resource Limits** | Configured | ✅ Good for dev |
| **Rolling Updates** | Configured | ✅ Yes |
| **Image Tags** | latest | ❌ Use versions |
| **Helm** | Not yet | 📝 Bonus: implement it |

---

## 📝 FINAL TIPS FOR VIVA

1. **Know your YAML** - Be ready to explain each line
2. **Understand the why** - Not just what, but why each choice
3. **Mention production considerations** - Show you understand beyond the assignment
4. **Practice kubectl commands** - Be ready to run them live
5. **Draw diagrams** - Visual explanation of pod communication
6. **Discuss trade-offs** - Why dev setup differs from production
7. **Know your limits** - What would you improve next?

---

**Good luck with your viva! 🎯**

You have a solid implementation. Focus on explaining the "why" behind each Kubernetes object and how they work together. Examiners love when students show they understand the bigger picture beyond just copying YAML files.
