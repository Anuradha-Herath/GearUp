# Quick Cheat Sheet - Kubernetes Presentation
## Keep this handy during your viva!

---

## 🎯 3-SECOND ANSWERS (If asked quickly)

**Q: What is Kubernetes?**
A: "Container orchestration platform that automates deployment, scaling, and management of containerized applications."

**Q: What's a Pod?**
A: "Smallest unit in Kubernetes. One or more containers running together."

**Q: What's a Service?**
A: "Exposes pods to other pods or external users via DNS or IP."

**Q: What's a ConfigMap?**
A: "Stores non-sensitive configuration data as key-value pairs."

**Q: What's a Secret?**
A: "Stores sensitive data like passwords and API keys (base64 encoded)."

**Q: Why Namespace?**
A: "Isolates resources. Multiple teams can use same cluster without conflicts."

**Q: What's a Deployment?**
A: "Describes desired state of pods (how many replicas, which image, etc.)."

**Q: Liveness vs Readiness Probe?**
A: "Liveness: Is container alive? → Restart if fails. Readiness: Is container ready for traffic? → Remove from service if fails."

---

## 📊 YOUR NUMBERS (Memorize These!)

**File order:** 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11

**Replicas:** 1 (can scale to 3+)

**Namespace:** gearup

**ConfigMap name:** gearup-config

**Secret name:** gearup-secrets

**MySQL port:** 3306
**Backend port:** 8080
**Frontend port:** 80 → NodePort 30001

**Resource limits (Backend):**
- Request: 512Mi memory, 250m CPU
- Limit: 1Gi memory, 1000m CPU

**Probes (Backend):**
- Liveness: /actuator/health/liveness (initial 60s, every 10s)
- Readiness: /actuator/health/readiness (initial 30s, every 5s)

---

## 🔗 CONNECTIONS TO REMEMBER

```
Frontend (port 80)
    ↓
    └→ Backend Service (backend:8080)
        ↓
        └→ MySQL Service (mysql:3306)
```

**How they find each other:**
```
Backend container reads DATABASE_URL: jdbc:mysql://mysql:3306/gearup
                                                   ↑
                            Kubernetes DNS resolves this to Service IP
```

---

## 📝 FILE PURPOSES (Quick Ref)

| File # | Name | Purpose |
|--------|------|---------|
| 1 | namespace.yaml | Create 'gearup' workspace |
| 2 | configmap.yaml | DB host, ports, settings |
| 3 | secrets.yaml | Passwords, API keys |
| 4 | mysql-pvc.yaml | Persistent storage |
| 5 | mysql-deployment.yaml | MySQL pod recipe |
| 6 | mysql-service.yaml | MySQL DNS service |
| 7 | backend-deployment.yaml | Spring Boot pod recipe |
| 8 | backend-service.yaml | Backend DNS service |
| 9 | frontend-deployment.yaml | Nginx/React pod recipe |
| 10 | frontend-service.yaml | Frontend external access |
| 11 | frontend-ingress.yaml | Advanced routing (optional) |

---

## 💻 COMMANDS TO SHOW LIVE

```powershell
# Most important commands (memorize these!)

# Deploy everything
kubectl apply -f 1-namespace.yaml

# See everything running
kubectl get all -n gearup

# See just pods
kubectl get pods -n gearup

# See services
kubectl get svc -n gearup

# See a specific pod's config
kubectl describe pod mysql-xyz123 -n gearup

# See pod logs
kubectl logs <pod-name> -n gearup

# Enter a pod (debug)
kubectl exec -it <pod-name> -n gearup -- /bin/bash

# Scale deployment
kubectl scale deployment backend -n gearup --replicas=3

# Watch pods
kubectl get pods -n gearup -w
```

---

## 🎬 PRESENTATION FLOW (Copy-Paste Structure)

**1. Intro (30 sec)**
"Today I present GearUp app deployed on Kubernetes in Docker Desktop. Three components: Frontend, Backend, Database."

**2. Architecture (1 min)**
[SHOW DIAGRAM] "Three-tier architecture..."

**3. Docker Desktop (1 min)**
[OPEN Docker Desktop] "Kubernetes enabled here with 4CPUs, 4GB RAM"

**4. ConfigMap (1 min)**
[OPEN 2-configmap.yaml] "Stores non-sensitive config like..."

**5. Secrets (1 min)**
[OPEN 3-secrets.yaml] "Base64 encoded sensitive data..."

**6. Deployments (2 min)**
[OPEN 5-mysql-deployment.yaml] "MySQL pod recipe. Replicas: 1, Image: mysql:5.7, Gets config from ConfigMap and Secret"
[OPEN 7-backend-deployment.yaml] "Backend. Spring Boot on 8080. Connects to MySQL service"
[OPEN 9-frontend-deployment.yaml] "Frontend. React served by Nginx on port 80"

**7. Services (1 min)**
[OPEN 6-mysql-service.yaml] "ClusterIP - internal. MySQL pod accessed via dns 'mysql:3306'"
[OPEN 8-backend-service.yaml] "ClusterIP - internal. Backend via 'backend:8080'"
[OPEN 10-frontend-service.yaml] "NodePort - external. Access via localhost:30001"

**8. Data flow (1 min)**
"User → localhost:30001 → Frontend Service → Nginx pod → React app in browser → calls backend:8080 → Backend Service → Spring Boot pod → queries mysql:3306 → MySQL pod"

**9. Deployment (30 sec)**
[OPEN Terminal] "Run: kubectl apply -f 1-namespace.yaml"
[SHOW command] "Then 2-configmap, 3-secrets, 4-pvc, 5-mysql, 6-mysql-svc, 7-backend, 8-backend-svc, 9-frontend, 10-frontend-svc"

**10. Verify (1 min)**
[RUN] "kubectl get all -n gearup"
"All pods show 1/1 READY means healthy"

**11. Production (1 min)**
"For prod: 3+ replicas for HA, PersistentVolume for storage, encrypt secrets, version images, add monitoring"

**12. Closing (30 sec)**
"Built complete K8s deployment using ConfigMap, Secret, Deployments, Services. Self-healing, auto-restart, DNS discovery."

---

## ⚠️ COMMON QUESTIONS & ANSWERS

**Q: Why do you need both ConfigMap and Secret?**
A: "ConfigMap for non-sensitive (DB_HOST, SPRING_PROFILE). Secret for sensitive (passwords, API keys). Different security levels."

**Q: What if a pod crashes?**
A: "Liveness probe fails → Kubelet detects → Pod automatically restarts (restartPolicy: Always)"

**Q: How does backend find MySQL?**
A: "Uses Kubernetes DNS. Backend reads DATABASE_URL: jdbc:mysql://mysql:3306. DNS resolves 'mysql' to MySQL Service IP."

**Q: Why NodePort for frontend but ClusterIP for backend?**
A: "Frontend is user-facing (needs external access). Backend is internal only. ClusterIP is simpler and more secure."

**Q: What's the difference between Deployment and Pod?**
A: "Pod is instance. Deployment manages replicas of Pods. If pod crashes, Deployment creates new one."

**Q: Can you scale to multiple replicas?**
A: "Yes. Change replicas: 1 → replicas: 3. Service load-balances across all 3."

**Q: Is base64 encoding secure?**
A: "No, it's just encoding. For production, use encryption at rest or external vault."

**Q: Why YAML files need to be in order?**
A: "Dependencies. Secrets must exist before Deployment uses them. MySQL Service must exist before Backend tries to connect."

---

## 🚨 THINGS TO EMPHASIZE

✅ **Self-healing** - Crashes auto-restart
✅ **Service discovery** - DNS makes containers discoverable  
✅ **Declarative** - We say "desired state", K8s ensures it
✅ **Portable** - Same YAML works locally and in cloud
✅ **Scalable** - Add replicas without code changes
✅ **Configuration management** - ConfigMap + Secret separate config from code

---

## 📱 VISUALS TO DRAW/SHOW

**Option 1: Simple Architecture**
```
Frontend (port 80)
    ↓
Backend (port 8080)
    ↓
MySQL (port 3306)
```

**Option 2: Service Layer**
```
Frontend Pod
    ↓
Frontend Service (NodePort 30001)
    ↓
Backend Service (ClusterIP)
    ↓
Backend Pod
    ↓
MySQL Service (ClusterIP)
    ↓
MySQL Pod
```

**Option 3: Full with ConfigMap/Secret**
```
ConfigMap ──→ All Pods
Secret ──────→ All Pods
Namespace ──→ Isolates Everything
    ├─ Deployment → Pods
    ├─ Service → DNS
    └─ Storage → Persistence
```

---

## ⏱️ TIMING CHECKPOINTS

- **5 min mark:** Should be halfway through Deployments explanation
- **10 min mark:** Should be at Verification step
- **14 min mark:** Should be wrapping up with Production considerations
- **15 min mark:** Q&A ready

---

## 🔄 IF STUCK OR NERVOUS

**Pause & remember:**
- Kubernetes is container orchestration
- You have 3 components: Frontend, Backend, Database
- ConfigMap and Secret manage configuration
- Services expose pods
- Everything works together via DNS

**Fall back to basics:**
"Kubernetes manages containers. My deployment has three containers..."
"The ConfigMap has non-sensitive config, Secret has passwords..."
"Services let containers talk to each other..."

---

## ✅ PRE-VIVA CHECKLIST

- [ ] Read presentation script once
- [ ] Practice 1-2 times (time yourself)
- [ ] Have VS Code open with k8s folder
- [ ] Have Docker Desktop running
- [ ] Have Terminal/PowerShell ready
- [ ] Memorize the 3-second answers
- [ ] Know the 3-tier architecture cold
- [ ] Understand ConfigMap vs Secret difference
- [ ] Know what Probes do
- [ ] Be ready to run: `kubectl get all -n gearup`

---

**💪 You got this! You have a solid implementation. Just explain it clearly!**
