# LIVE DEMO WALKTHROUGH
## Step-by-step guide to show while presenting

---

## ⏱️ TOTAL TIME: 15 minutes
### This script includes ACTUAL COMMANDS to run live

---

## 🎬 PART 1: SETUP (Before viva starts - 3 minutes)

### Step 1: Ensure Docker Desktop is running

**What examiners will see:**
1. Your desktop with Docker Desktop icon in taskbar
2. Docker Desktop running and Kubernetes enabled
3. Docker daemon running normally

**Before viva, run:**
```powershell
# Check Docker and Kubernetes are running
docker ps
kubectl version --short

# Should show:
# Client Version: v1.x.x
# Server Version: v1.x.x
```

### Step 2: Verify your images are built

```powershell
docker images | grep gearup

# Should show:
# gearup/frontend    latest    xxxxx    xx minutes ago    150MB
# gearup/backend     latest    xxxxx    xx minutes ago    380MB
# mysql              5.7       xxxxx    xx weeks ago      372MB
```

**If images not built:**
```powershell
# Build backend
cd backend
docker build -t gearup/backend:latest .

# Build frontend  
cd ../frontend
docker build -t gearup/frontend:latest .

# This takes 5-10 minutes, do this BEFORE viva!
```

### Step 3: Clean namespace (optional - start fresh)

```powershell
# Delete previous deployment (if exists)
kubectl delete namespace gearup

# Wait for deletion
kubectl get namespace gearup --watch

# Ctrl+C to exit watch
```

---

## 🎬 PART 2: PRESENTATION (During viva - 12 minutes)

### Minute 0-1: INTRODUCTION

**SPEAK:**
"Good morning. I'm presenting the Kubernetes deployment of our GearUp automotive service platform. We have three main components - a React frontend, Spring Boot backend, and MySQL database - all containerized with Docker and orchestrated by Kubernetes."

**SHOW ON SCREEN:**
- File explorer showing k8s folder with 11 YAML files
- OR VS Code with k8s folder open

---

### Minute 1-2: DOCKER DESKTOP & ARCHITECTURE

**ACTION 1: Open Docker Desktop**
- Show it's running and Kubernetes is enabled
- Show Settings → Kubernetes is checked
- Show allocated resources (4 CPUs, 4GB RAM)

**SPEAK:**
"Docker Desktop provides a local Kubernetes cluster perfect for development. It includes the Docker engine and a single-node Kubernetes cluster. In production, we'd use cloud services."

**ACTION 2: Draw or show architecture diagram**
- Draw on whiteboard OR show the diagram from presentation script
- Point to three tiers: Frontend, Backend, Database

---

### Minute 2-3: CONFIGMAP

**ACTION 1: Open `2-configmap.yaml` in VS Code**

```powershell
# Alternative: Show in terminal
cat k8s/2-configmap.yaml
```

**SPEAK while scrolling:**
"This is ConfigMap - stores configuration data. Notice the key-value pairs:
- DB_NAME, DB_HOST, DB_PORT - database connection
- SPRING_PROFILE - application profile
- FRONTEND_BASE_URL - for email links
- MySQL character set settings

These are non-sensitive - they can be seen in pod descriptions."

**Show specific lines:**
```yaml
DB_HOST: "mysql"        # Service name (auto-discovered)
FRONTEND_BASE_URL: "http://localhost:30000"
```

**SPEAK:**
"The MySQL is referenced as 'mysql' - that's a service name. Kubernetes DNS will resolve it automatically. No hardcoding IPs!"

---

### Minute 3-4: SECRETS

**ACTION 1: Open `3-secrets.yaml` in VS Code**

```powershell
cat k8s/3-secrets.yaml
```

**SPEAK:**
"This is Secret - stores sensitive data:
- Database passwords
- JWT secret for authentication
- API keys for Gemini and SendGrid
- Email address for sending notifications

Notice they're base64 encoded - that's encoding, not encryption. For production, Kubernetes can encrypt at rest."

**Point to specific entries:**
```yaml
DB_PASSWORD: QW51QDIwMDE=                    # Base64 for "Anu@2001"
JWT_SECRET: ZGV2U2VjcmV0S2V5...
GEMINI_API_KEY: QUl6YVN5RFVGbVlHbkV...
SENDGRID_API_KEY: U0cuQUZPY21ESWpT...
```

**SPEAK:**
"When backend pod starts, it reads these secrets. The pod doesn't have hardcoded passwords - it gets them from the Secret object."

---

### Minute 4-6: DEPLOYMENTS (Key part - spend time here!)

#### Show MySQL Deployment

**ACTION: Open `5-mysql-deployment.yaml`**

**SPEAK:**
"This is a Deployment - describes how to create MySQL pods."

**Show key sections one by one:**

1. **REPLICAS:**
```yaml
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
```
"We run 1 MySQL pod. Later we can change this to 3 for high availability."

2. **IMAGE:**
```yaml
containers:
- name: mysql
  image: mysql:5.7
  imagePullPolicy: IfNotPresent
```
"Uses MySQL 5.7 image. IfNotPresent means use local image if available."

3. **PORT:**
```yaml
ports:
- containerPort: 3306
  name: mysql
```
"MySQL listens on port 3306 inside the container."

4. **ENVIRONMENT VARIABLES:**
```yaml
env:
- name: MYSQL_ROOT_PASSWORD
  valueFrom:
    secretKeyRef:
      name: gearup-secrets
      key: DB_ROOT_PASSWORD
```
"Gets password from Secret gearup-secrets, key DB_ROOT_PASSWORD"

**Scroll to show more variables from ConfigMap and Secret**

5. **PROBES:**
```yaml
livenessProbe:
  exec:
    command: [mysqladmin, ping]
  initialDelaySeconds: 30
  periodSeconds: 10
```
**SPEAK:** "Probes check if pod is healthy. This uses 'mysqladmin ping' command. If fails, pod is restarted. Waits 30 seconds before first check, then checks every 10 seconds."

---

#### Show Backend Deployment

**ACTION: Open `7-backend-deployment.yaml`**

**SPEAK:**
"Backend deployment - Spring Boot API server."

**Show key differences:**

```yaml
image: gearup/backend:latest
ports:
- containerPort: 8080
```
"Backend on port 8080 - our REST API port."

**Show environment variables:**
```yaml
- name: DATABASE_URL
  value: "jdbc:mysql://mysql:3306/gearup?useSSL=false..."
```

**SPEAK:**
"IMPORTANT: Notice DATABASE_URL has 'mysql:3306' - that's the Service name! Kubernetes DNS resolves 'mysql' to the MySQL Service IP. No hardcoding needed!"

```yaml
- name: SENDGRID_API_KEY
  valueFrom:
    secretKeyRef:
      name: gearup-secrets
      key: SENDGRID_API_KEY
```

"Gets API key from Secret"

**Show probes:**
```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 60
```

**SPEAK:** "Backend uses HTTP health checks - hits /actuator/health/liveness endpoint. 60 second initial delay because Spring Boot takes time to start."

---

#### Show Frontend Deployment

**ACTION: Open `9-frontend-deployment.yaml`**

**SPEAK:**
"Frontend - React app served by Nginx."

```yaml
image: gearup/frontend:latest
ports:
- containerPort: 80
```

"Nginx listens on port 80. Much lighter weight than backend."

```yaml
resources:
  requests:
    memory: "64Mi"
  limits:
    memory: "256Mi"
```

**SPEAK:** "Frontend uses minimal resources - just static files. Only 64MB memory request!"

---

### Minute 6-7: SERVICES

**ACTION: Open `10-frontend-service.yaml`**

```powershell
cat k8s/10-frontend-service.yaml
```

**SPEAK:**
"Services expose pods. This one makes frontend accessible from outside."

```yaml
kind: Service
metadata:
  name: frontend
type: NodePort
ports:
- port: 80
  nodePort: 30001
selector:
  app: frontend
```

**Point to each part:**
- "type: NodePort" = accessible from outside the cluster
- "port: 80" = internal port
- "nodePort: 30001" = external port on localhost
- "selector: app: frontend" = selects which pods to expose

**SPEAK:** "With this Service, we access frontend at: http://localhost:30001"

---

**ACTION: Open `6-mysql-service.yaml`**

```yaml
kind: Service
metadata:
  name: mysql
type: ClusterIP
ports:
- port: 3306
selector:
  app: mysql
```

**SPEAK:** 
"This Service is ClusterIP - only accessible inside cluster. Name is 'mysql'. When backend connects to 'mysql:3306', Kubernetes DNS resolves it to this Service's IP. The Service then routes to the MySQL pod."

---

### Minute 7-8: DEPLOYMENT PROCESS (LIVE COMMANDS!)

**ACTION: Open PowerShell/Terminal**

```powershell
cd k8s
```

**SPEAK:** "Now let me deploy everything. First, apply namespace:"

```powershell
kubectl apply -f 1-namespace.yaml
```

**Show output:**
```
namespace/gearup created
```

**SPEAK:** "Namespace created."

---

**Next step:**

```powershell
kubectl apply -f 2-configmap.yaml
```

**SPEAK:** "ConfigMap created."

---

```powershell
kubectl apply -f 3-secrets.yaml
```

**SPEAK:** "Secrets created."

---

**Deploy MySQL:**

```powershell
kubectl apply -f 4-mysql-pvc.yaml
kubectl apply -f 5-mysql-deployment.yaml
kubectl apply -f 6-mysql-service.yaml
```

**SPEAK:** "MySQL storage, deployment, and service created."

---

**Deploy Backend:**

```powershell
kubectl apply -f 7-backend-deployment.yaml
kubectl apply -f 8-backend-service.yaml
```

**SPEAK:** "Backend deployment and service created."

---

**Deploy Frontend:**

```powershell
kubectl apply -f 9-frontend-deployment.yaml
kubectl apply -f 10-frontend-service.yaml
```

**SPEAK:** "Frontend deployment and service created."

---

### Minute 8-10: VERIFICATION (Show it working!)

**ACTION 1: Check all resources**

```powershell
kubectl get all -n gearup
```

**Expected output:**
```
NAME                            READY   STATUS    RESTARTS   AGE
pod/mysql-abcd1234-xyz          1/1     Running   0          2m
pod/backend-efgh5678-abc        1/1     Running   0          1m
pod/frontend-ijkl9012-def       1/1     Running   0          1m

NAME                   TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)
service/mysql          ClusterIP   10.96.x.x       <none>        3306/TCP
service/backend        ClusterIP   10.96.x.x       <none>        8080/TCP
service/frontend       NodePort    10.96.x.x       <none>        80:30001/TCP

NAME                       READY   UP-TO-DATE   AVAILABLE
deployment.apps/mysql     1/1     1            1
deployment.apps/backend   1/1     1            1
deployment.apps/frontend  1/1     1            1
```

**SPEAK:** "All pods are Running with READY 1/1 - that means they're healthy. Three services: MySQL and Backend are ClusterIP (internal), Frontend is NodePort (external)."

---

**ACTION 2: Check pod details**

```powershell
kubectl describe pod -l app=backend -n gearup
```

**Scroll to show:**
- Pod name
- Image: gearup/backend:latest
- Environment variables from ConfigMap and Secret
- Probes configuration
- Status: Running

---

**ACTION 3: Check logs (if backend is ready)**

```powershell
kubectl logs -n gearup -l app=backend --tail=20
```

**SPEAK:** "Backend logs show the Spring Boot application started successfully. You see 'APPLICATION STARTED' message."

---

**ACTION 4: Show ConfigMap in pod**

```powershell
kubectl exec -n gearup -it $(kubectl get pod -n gearup -l app=backend -o jsonpath='{.items[0].metadata.name}') -- env | grep DB_
```

**Expected output:**
```
DB_HOST=mysql
DB_PORT=3306
DB_NAME=gearup
```

**SPEAK:** "The ConfigMap values are injected as environment variables into the pod. When the Spring Boot app starts, it reads DB_HOST='mysql' - a service name, not an IP!"

---

### Minute 10-11: DATA FLOW EXPLANATION

**Draw on paper or point to diagram:**

```
User Browser
    ↓
http://localhost:30001
    ↓
Frontend Service (NodePort 30001)
    ↓
Frontend Pod (Nginx)
    ↓
React App (in browser)
    ↓
Calls: http://backend:8080
    ↓
Backend Service (ClusterIP)
    ↓
Backend Pod (Spring Boot)
    ↓
Reads DATABASE_URL: jdbc:mysql://mysql:3306/gearup
    ↓
MySQL Service (ClusterIP)
    ↓
MySQL Pod
    ↓
Returns data
    ↓
Back through the chain to browser
```

**SPEAK:**
"This is the complete data flow. Notice:
1. Frontend is accessible from outside (NodePort)
2. Backend and MySQL are internal (ClusterIP) - hidden from external users
3. All communication uses service names (frontend, backend, mysql) - Kubernetes DNS handles IP resolution
4. All configuration comes from ConfigMap and Secrets - no hardcoding"

---

### Minute 11-12: PRODUCTION IMPROVEMENTS

**SPEAK:**
"For production, several improvements:

1. **High Availability**: Scale replicas to 3
```powershell
kubectl scale deployment backend -n gearup --replicas=3
```
Now if one pod crashes, two others still run.

2. **Persistent Storage**: Use PersistentVolume instead of emptyDir. MySQL data survives pod restarts.

3. **Image Versioning**: Use specific versions
```yaml
image: gearup/backend:1.2.3
```
Not 'latest' - so we can rollback if needed.

4. **Secret Encryption**: Encrypt secrets at rest, or use external vault (HashiCorp Vault, Azure Key Vault).

5. **Monitoring**: Add Prometheus and Grafana to monitor metrics.

6. **Ingress Controller**: Use advanced routing instead of NodePort.

7. **Helm Charts**: Package everything for easier deployment across environments."

---

### Minute 12-13: TROUBLESHOOTING DEMO (Optional - if time)

**If pod was unhealthy, show debugging:**

```powershell
# If pod is CrashLoopBackOff:
kubectl describe pod mysql-xyz -n gearup

# Shows events - what went wrong
# Then check logs:
kubectl logs mysql-xyz -n gearup

# Shows error messages
```

---

### Minute 13-14: SUMMARY

**SPEAK:**
"To summarize what we built:

✅ **Three-tier architecture**
- Frontend: React + Nginx
- Backend: Spring Boot
- Database: MySQL

✅ **Kubernetes deployment**
- Namespace for isolation
- ConfigMap for configuration
- Secrets for sensitive data
- Services for networking
- Health checks for reliability

✅ **Key Kubernetes benefits**
- Self-healing: Crashed containers auto-restart
- Service discovery: Containers find each other via DNS
- Orchestration: Automated pod management
- Scalability: Can add replicas instantly

✅ **Infrastructure as Code**
- All configuration in YAML
- Reproducible across environments
- Easy to version control
- Ready for cloud deployment"

---

### Minute 14-15: Q&A READY

**SPEAK:**
"Thank you for attention. I'm ready for questions."

**Be ready for:**
- "How would you scale this?"
  - Answer: `kubectl scale deployment backend -n gearup --replicas=3`
- "What if MySQL pod crashes?"
  - Answer: Liveness probe fails, Kubernetes restarts it automatically
- "How does backend find MySQL?"
  - Answer: Service discovery via DNS. Backend reads 'mysql:3306' and DNS resolves to Service IP

---

## 🔧 TROUBLESHOOTING (If something goes wrong during presentation)

### "Pod is not running"

```powershell
# Check why
kubectl describe pod <pod-name> -n gearup

# If ImagePullBackOff:
# → Image not found, need to build it

# If CrashLoopBackOff:
# → Application crashed, check logs
kubectl logs <pod-name> -n gearup

# If Pending:
# → Not enough resources, check kubelet
```

### "Service endpoint is empty"

```powershell
# Check endpoints
kubectl get endpoints -n gearup

# Should show pod IPs. If empty:
# → Pod not ready yet, wait a minute
# → Check pod status: kubectl get pods -n gearup
```

### "Can't access frontend at localhost:30001"

```powershell
# Check service
kubectl get svc frontend -n gearup

# Verify NodePort is 30001
# Then verify service has endpoints:
kubectl get endpoints frontend -n gearup
```

### "Lost internet connection during presentation"

**No problem!**
- You already have everything running (hopefully)
- Just show status without running new commands
- Explain what would happen if you ran the commands

---

## ✅ FINAL CHECKLIST (Night before viva)

- [ ] Read through this entire script once
- [ ] Ensure Docker Desktop is installed and Kubernetes enabled
- [ ] Build Docker images for backend and frontend
- [ ] Test full deployment: `kubectl apply -f k8s/*.yaml`
- [ ] Verify all pods are Running: `kubectl get pods -n gearup`
- [ ] Test frontend access: http://localhost:30001
- [ ] Check backend logs: `kubectl logs -n gearup -l app=backend`
- [ ] Clean up: `kubectl delete namespace gearup`
- [ ] Have VS Code open with k8s folder ready
- [ ] Have PowerShell/Terminal ready
- [ ] Practice speaking through the entire script (should take 12-15 min)
- [ ] Memorize the 3-second answers from cheat sheet
- [ ] Get good sleep! 😴

---

## 🎤 SPEAKING TIPS

✅ **Pace yourself:** Slow down. Take 15 minutes minimum.
✅ **Point at screen:** Don't just read code. Point and explain.
✅ **Use your hands:** Draw diagrams, gesture to architecture.
✅ **Pause for thought:** Don't rush. Let things sink in.
✅ **Eye contact:** Look at examiners occasionally, not just screen.
✅ **Show enthusiasm:** You built something cool! Be proud.
✅ **Admit if unsure:** "That's a good question, let me think..." is OK.
✅ **Don't memorize word-for-word:** Speak naturally, use notes.

---

**GOOD LUCK! YOU'VE GOT THIS! 🚀**

Remember: You built a working Kubernetes deployment. That's impressive. Just explain it clearly and you'll do great!
