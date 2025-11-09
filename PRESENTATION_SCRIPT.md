# Kubernetes & Docker Desktop - Presentation Script
## Viva Presentation Guide (5-10 minutes)

---

## 🎬 PART 1: INTRODUCTION (1 minute)

**Script to read out loud:**

"Good morning/afternoon. Today I'll present the Kubernetes deployment of our GearUp application - an automotive service booking platform.

Our project has three main components:
- **Frontend**: React web application
- **Backend**: Spring Boot REST API
- **Database**: MySQL database

All three are containerized with Docker and deployed on Kubernetes running in Docker Desktop.

Let me walk you through:
1. The overall architecture
2. Docker containerization
3. Kubernetes deployment and configuration
4. How everything connects

Let's start!"

---

## 🎬 PART 2: SHOW DOCKER DESKTOP (1-2 minutes)

**What to do:**
1. Open Docker Desktop application
2. Show the Kubernetes section

**Script:**

"First, let me show you Docker Desktop. [CLICK to open Docker Desktop]

Docker Desktop is a development environment that includes:
- Docker for containerization
- Kubernetes cluster running locally

[POINT to Settings → Kubernetes section]

See here? Kubernetes is enabled with 1 node running locally. This is perfect for development. In production, you'd use cloud services like AWS EKS, Azure AKS, or Google GKE.

[POINT to Resources]

We've allocated:
- 4 CPUs
- 4GB RAM
- This is shared between Docker and Kubernetes

Let me now show you the Kubernetes manifests in our project."

---

## 🎬 PART 3: FILE STRUCTURE OVERVIEW (1 minute)

**In VS Code - Open the k8s folder**

**Script:**

"[OPEN k8s folder in VS Code or file explorer]

Here's our Kubernetes configuration. Notice we have 11 YAML files, numbered in order because they must be deployed in sequence:

- **1-namespace.yaml** → Creates isolated workspace
- **2-configmap.yaml** → Non-sensitive configuration
- **3-secrets.yaml** → Sensitive data (passwords, API keys)
- **4-mysql-pvc.yaml** → Storage volume
- **5-6** → MySQL database deployment and service
- **7-8** → Backend deployment and service
- **9-10** → Frontend deployment and service
- **11** → Ingress (optional - for external routing)

Each file is a Kubernetes object. Think of them as building blocks.

Let me show you each one..."

---

## 🎬 PART 4: KUBERNETES OBJECTS EXPLAINED (5-7 minutes)

### **Show File 1: Namespace**
[OPEN `1-namespace.yaml` in VS Code]

**Script:**

"**Namespace** - Think of this as a separate workspace.

[READ from screen:]
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: gearup
```

This creates a namespace called 'gearup'. All our resources live here, separate from other applications. This is important because:
- Multiple teams can use the same Kubernetes cluster
- Resources are isolated - easier to manage and delete
- No naming conflicts with other projects

To apply: `kubectl apply -f 1-namespace.yaml`"

---

### **Show File 2: ConfigMap**
[OPEN `2-configmap.yaml` in VS Code]

**Script:**

"**ConfigMap** - This stores configuration data that's not secret.

[SCROLL through and POINT to different entries:]

See these key-value pairs?
```yaml
DB_NAME: "gearup"
DB_HOST: "mysql"
DB_PORT: "3306"
SPRING_PROFILE: "prod"
FRONTEND_BASE_URL: "http://localhost:30000"
```

These are **non-sensitive configuration values**:
- Database connection details
- Application settings
- Port numbers

Think of it like an environment configuration file. All our containers read from this ConfigMap when they start.

Why ConfigMap and not hardcode?
- Easy to change without rebuilding images
- Same image works in dev, staging, and production with different ConfigMaps"

---

### **Show File 3: Secret**
[OPEN `3-secrets.yaml` in VS Code]

**Script:**

"**Secret** - This stores sensitive data that must be protected.

[POINT to the data section:]

```yaml
DB_ROOT_PASSWORD: QW51QDIwMDE=
DB_USER: Z2VhcnVwX3VzZXI=
DB_PASSWORD: QW51QDIwMDE=
JWT_SECRET: ZGV2U2VjcmV0S2V5...
GEMINI_API_KEY: QUl6YVN5RFVGbVlHbkVMd2JJ...
SENDGRID_API_KEY: U0cuQUZPY21ESWpTLWF3RFM1...
```

These are **base64 encoded** sensitive values:
- Database passwords
- JWT secret keys
- External API keys (Gemini, SendGrid)

Notice they're base64 encoded - that's encoding, NOT encryption. For production, Kubernetes can encrypt secrets at rest.

Why separate from ConfigMap?
- Different access controls
- Won't accidentally be logged
- Audit trail for who accessed secrets"

---

### **Show File 4: PersistentVolumeClaim**
[OPEN `4-mysql-pvc.yaml` in VS Code]

**Script:**

"**PersistentVolumeClaim (PVC)** - This is storage that persists.

In Kubernetes, pods are temporary - if a pod crashes, a new one replaces it. But data in the pod's storage is lost!

A PVC creates persistent storage:
- Data survives pod restarts
- Database can be backed up
- Multiple pods can access same data

Currently, we use `emptyDir` for development [POINT if visible], but in production, you'd use PVC with a real storage backend."

---

### **Show File 5 & 6: MySQL Deployment & Service**
[OPEN `5-mysql-deployment.yaml` in VS Code]

**Script:**

"**Deployment** - This is the recipe for creating pods.

[SCROLL through key sections:]

```yaml
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: mysql
        image: mysql:5.7
        ports:
        - containerPort: 3306
```

This says: 'Create 1 pod running MySQL 5.7 image on port 3306'

[SCROLL to environment variables section:]

```yaml
env:
- name: MYSQL_ROOT_PASSWORD
  valueFrom:
    secretKeyRef:
      name: gearup-secrets
      key: DB_ROOT_PASSWORD
```

The environment variables come from:
- ConfigMap (non-sensitive)
- Secret (sensitive)

This links everything together!

[SHOW livenessProbe and readinessProbe:]

```yaml
livenessProbe:
  exec:
    command: [mysqladmin, ping]
  initialDelaySeconds: 30
  periodSeconds: 10
```

Probes check: 'Is this pod healthy?' If not, Kubernetes restarts it automatically."

---

[OPEN `6-mysql-service.yaml`]

**Script:**

"**Service** - This exposes the MySQL pod to other pods.

```yaml
kind: Service
metadata:
  name: mysql
spec:
  type: ClusterIP
  ports:
  - port: 3306
    targetPort: 3306
  selector:
    app: mysql
```

The Service name 'mysql' becomes a DNS hostname inside the cluster!

So when backend tries to connect to database:
```
Connection string: jdbc:mysql://mysql:3306/gearup
                              ↑
                    Resolves to MySQL Service
```

No hardcoding IPs needed - Kubernetes DNS does the magic!"

---

### **Show File 7 & 8: Backend Deployment & Service**
[OPEN `7-backend-deployment.yaml` in VS Code]

**Script:**

"**Backend Deployment** - Spring Boot API

```yaml
image: gearup/backend:latest
ports:
- containerPort: 8080
```

The backend:
- Runs Spring Boot application
- Listens on port 8080
- Gets database credentials from Secret
- Gets API keys from Secret
- Gets configuration from ConfigMap

[SCROLL to environment variables:]

Notice it reads:
- DATABASE_URL pointing to 'mysql' service
- All passwords and API keys from gearup-secrets
- Configuration from gearup-config

The connection flow:
1. Backend pod starts
2. Spring Boot reads DATABASE_URL: jdbc:mysql://mysql:3306/gearup
3. Kubernetes DNS resolves 'mysql' to MySQL Service IP
4. Connection established!"

---

[OPEN `8-backend-service.yaml`]

**Script:**

"**Backend Service** - Exposes backend to frontend

```yaml
type: ClusterIP
port: 8080
selector:
  app: backend
```

ClusterIP means: Only pods inside the cluster can access this service.

So:
- Frontend can reach backend via `http://backend:8080`
- Requests are load-balanced to backend pod(s)"

---

### **Show File 9 & 10: Frontend Deployment & Service**
[OPEN `9-frontend-deployment.yaml` in VS Code]

**Script:**

"**Frontend Deployment** - React application

```yaml
image: gearup/frontend:latest
ports:
- containerPort: 80
```

The frontend:
- Runs Nginx server
- Serves React build on port 80
- Much lighter weight than backend

[SCROLL to resources:]

```yaml
resources:
  requests:
    memory: "64Mi"    # Very small!
    cpu: "50m"
```

Frontend needs minimal resources - it's just serving static files."

---

[OPEN `10-frontend-service.yaml`]

**Script:**

"**Frontend Service** - Exposes frontend to users

```yaml
type: NodePort
port: 80
nodePort: 30001
```

**NodePort** means: Accessible from outside the cluster!

Access via: `http://localhost:30001`

Traffic flow:
1. Browser → localhost:30001
2. Routes to frontend Service
3. Service sends to frontend pod
4. Nginx serves React app
5. React app calls http://backend:8080"

---

## 🎬 PART 5: DEPLOYMENT FLOW DIAGRAM (1-2 minutes)

**Draw/Show this on screen or paper:**

```
┌─────────────────────────────────────────────────────────┐
│        Docker Desktop with Kubernetes Cluster            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         gearup Namespace                         │   │
│  ├──────────────────────────────────────────────────┤   │
│  │                                                  │   │
│  │  ┌─────────────────┐  ┌──────────────────────┐  │   │
│  │  │ gearup-config   │  │  gearup-secrets      │  │   │
│  │  │ ConfigMap       │  │  Secret              │  │   │
│  │  │                 │  │                      │  │   │
│  │  │ DB_HOST: mysql  │  │ DB_PASSWORD: ***     │  │   │
│  │  │ DB_PORT: 3306   │  │ JWT_SECRET: ***      │  │   │
│  │  │ SPRING: prod    │  │ API_KEYS: ***        │  │   │
│  │  └─────────────────┘  └──────────────────────┘  │   │
│  │           ↓                     ↓                │   │
│  │     ┌─────────────────────────────────────┐     │   │
│  │     │   Kubernetes Pods                   │     │   │
│  │     ├─────────────────────────────────────┤     │   │
│  │     │                                     │     │   │
│  │     │  Frontend Pod          Backend Pod  │     │   │
│  │     │  ┌──────────────┐     ┌──────────┐ │     │   │
│  │     │  │ Nginx/React  │────→│ Spring   │ │     │   │
│  │     │  │ Port 80      │     │ Port 8080│ │     │   │
│  │     │  └──────────────┘     └────┬─────┘ │     │   │
│  │     │        │                   │       │     │   │
│  │     │        └───────────┬───────┘       │     │   │
│  │     │                    ↓               │     │   │
│  │     │            MySQL Pod               │     │   │
│  │     │            ┌──────────┐            │     │   │
│  │     │            │ MySQL    │            │     │   │
│  │     │            │ Port 3306│            │     │   │
│  │     │            └──────────┘            │     │   │
│  │     │                                     │     │   │
│  │     └─────────────────────────────────────┘     │   │
│  │              ↓        ↓        ↓                 │   │
│  │        Services (DNS Resolution)                │   │
│  │     frontend:80  backend:8080  mysql:3306      │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                       ↑                                   │
│                       │                                   │
│         Accessible: localhost:30001                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Script:**

"This diagram shows how everything connects:

1. **ConfigMap & Secret** sit at the top - they're the configuration
2. **Three pods** are created: Frontend, Backend, MySQL
3. **Services** connect them via DNS names
4. **Frontend Service** is NodePort - accessible from outside
5. **Backend & MySQL Services** are ClusterIP - internal only

Data flow:
- User clicks on frontend (localhost:30001)
- Frontend runs React in browser
- React calls backend API (http://backend:8080)
- Backend queries MySQL database (jdbc:mysql://mysql:3306)
- MySQL responds with data
- Everything flows back to user

All configuration comes from ConfigMap and Secrets - no hardcoded values!"

---

## 🎬 PART 6: KEY KUBERNETES CONCEPTS (2 minutes)

**Script:**

"Let me highlight three key Kubernetes concepts that make this work:

### **1. Container Orchestration**
Instead of manually managing containers, Kubernetes:
- Automatically starts containers if they crash
- Load balances traffic across multiple replicas
- Updates containers without downtime
- Manages resource allocation

[EXAMPLE from your YAML:]
```yaml
restartPolicy: Always  # Auto-restart if crashes
replicas: 1            # Can scale to 3, 5, etc.
```

### **2. Service Discovery**
Kubernetes has built-in DNS:
```
Backend pod needs to connect to MySQL
Instead of: jdbc:mysql://172.17.0.5:3306
It uses:   jdbc:mysql://mysql:3306
           ↑
    Service name (auto-discovered)
```

### **3. Health Checks (Probes)**
Kubernetes monitors pod health:

```yaml
livenessProbe:    # Is container alive?
readinessProbe:   # Is container ready for traffic?
```

If a probe fails:
- Readiness probe: Pod removed from service (no traffic)
- Liveness probe: Pod is restarted

This ensures only healthy pods receive traffic!"

---

## 🎬 PART 7: DEPLOYMENT PROCESS (1-2 minutes)

**Show commands in PowerShell/Terminal:**

**Script:**

"To deploy this entire system:

[OPEN Terminal or PowerShell]

```powershell
cd k8s

# Step 1: Create namespace (isolated workspace)
kubectl apply -f 1-namespace.yaml

# Step 2: Create configuration
kubectl apply -f 2-configmap.yaml

# Step 3: Create secrets (sensitive data)
kubectl apply -f 3-secrets.yaml

# Step 4: Create storage
kubectl apply -f 4-mysql-pvc.yaml

# Step 5-6: Deploy MySQL
kubectl apply -f 5-mysql-deployment.yaml
kubectl apply -f 6-mysql-service.yaml

# Step 7-8: Deploy Backend
kubectl apply -f 7-backend-deployment.yaml
kubectl apply -f 8-backend-service.yaml

# Step 9-10: Deploy Frontend
kubectl apply -f 9-frontend-deployment.yaml
kubectl apply -f 10-frontend-service.yaml
```

Each command creates Kubernetes objects. They build on each other - that's why the order matters!

[OPTIONAL: Run one command live]

```powershell
kubectl get all -n gearup
```

This shows all the resources we just created!"

---

## 🎬 PART 8: VERIFICATION & DEBUGGING (1 minute)

**Script:**

"To verify everything is working:

```powershell
# Check pod status
kubectl get pods -n gearup

# Should show:
# NAME                       READY   STATUS    RESTARTS   AGE
# mysql-xyz123              1/1     Running   0          2m
# backend-abc456            1/1     Running   0          1m
# frontend-def789           1/1     Running   0          1m

# Check services
kubectl get svc -n gearup

# Access the application
http://localhost:30001

# If something breaks, check logs:
kubectl logs -n gearup -l app=backend
kubectl describe pod mysql-xyz123 -n gearup
```

The `1/1` in READY column means the pod is healthy.

If a pod is not ready, we check:
- Logs to see what went wrong
- Events from describe command
- ConfigMap/Secret are correctly created"

---

## 🎬 PART 9: PRODUCTION CONSIDERATIONS (1-2 minutes)

**Script:**

"Our current setup is for **development**. Here are improvements for **production**:

### **1. Replicas for High Availability**
Currently: replicas: 1 (single point of failure)
Production: replicas: 3-5 (if one crashes, others continue)

### **2. Persistent Storage**
Currently: emptyDir (data lost if pod crashes)
Production: PersistentVolume + backup strategy

### **3. Image Versioning**
Currently: image: gearup/backend:latest
Production: image: gearup/backend:1.2.3 (exact version)

### **4. Secret Encryption**
Currently: base64 encoded (just encoding, not encryption)
Production: Encrypted at rest, use external vault (HashiCorp Vault, Azure Key Vault)

### **5. Resource Limits**
Currently: Already configured ✓
Production: Monitor actual usage, adjust limits

### **6. Monitoring & Logging**
Currently: None
Production: Prometheus + Grafana for metrics, ELK for logs

### **7. Ingress Controller**
Currently: NodePort (works, but basic)
Production: Ingress controller + Load Balancer for traffic routing

### **8. Helm Charts**
Currently: Individual YAML files
Production: Package everything as Helm chart for versioning"

---

## 🎬 CLOSING (30 seconds)

**Script:**

"To summarize:

✅ **What we built:**
- Kubernetes deployment of 3-tier application
- All three components (frontend, backend, database) containerized
- Proper separation of concerns using ConfigMaps and Secrets
- Health checks for automatic recovery
- Service discovery using Kubernetes DNS

✅ **Key achievements:**
- Complete infrastructure as code (all in YAML)
- Replicable across different environments
- Easy to update and rollback
- Production-ready foundation

🚀 **What makes this Kubernetes:**
- Container orchestration - no manual pod management
- Self-healing - crashed containers auto-restart
- Service discovery - containers find each other via DNS
- Declarative configuration - we describe desired state, K8s ensures it

Thank you! Any questions?"

---

## 📝 QUICK REFERENCE - Commands to Show Live

```powershell
# Navigate to k8s folder
cd k8s

# Deploy everything (run ONE file at a time to show progression)
kubectl apply -f 1-namespace.yaml
kubectl apply -f 2-configmap.yaml
# ... etc

# Watch pods come up
kubectl get pods -n gearup -w

# Check everything
kubectl get all -n gearup

# View ConfigMap
kubectl get configmap gearup-config -n gearup -o yaml

# View Secret (base64 encoded)
kubectl get secret gearup-secrets -n gearup -o yaml

# Check logs
kubectl logs -n gearup -l app=backend --tail=50

# Check pod details
kubectl describe pod mysql-xyz -n gearup

# Port forward (if services not NodePort)
kubectl port-forward svc/backend 8080:8080 -n gearup

# Access app
# Open browser: http://localhost:30001
```

---

## 🎤 TIPS FOR PRESENTING

✅ **DO:**
- Speak slowly and clearly
- Point at screen while talking
- Open VS Code and show actual files
- Use the diagram to explain architecture
- Have a terminal ready to run commands
- Practice 1-2 times before viva

❌ **DON'T:**
- Read verbatim from slides
- Go too fast
- Skip the "why" - always explain purpose
- Assume they know Kubernetes (explain basics)
- Get stuck on one file - keep moving

**Timing:**
- Intro: 1 min
- Docker Desktop: 1 min
- File structure: 1 min
- YAML files (detailed): 5-6 min
- Deployment process: 1-2 min
- Verification: 1 min
- Production considerations: 1-2 min
- Closing: 30 sec

**Total: 12-14 minutes** (great for 15-20 min slot)

---

**Good luck with your presentation! 💪**
