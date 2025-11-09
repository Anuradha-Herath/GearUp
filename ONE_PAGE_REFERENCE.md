# ONE-PAGE QUICK REFERENCE
## Print this and keep it with you during the viva!

---

## 🎯 YOUR 3-TIER ARCHITECTURE

```
┌─────────────────────────────────────────┐
│ Frontend (React + Nginx)                │
│ Port 80 → NodePort 30001                │
│ Access: http://localhost:30001          │
└────────────┬────────────────────────────┘
             │
         Service: "frontend"
             │
             ↓
┌─────────────────────────────────────────┐
│ Backend (Spring Boot)                   │
│ Port 8080 → Service: "backend"          │
│ Connects to: jdbc:mysql://mysql:3306    │
└────────────┬────────────────────────────┘
             │
         Service: "backend"
             │
             ↓
┌─────────────────────────────────────────┐
│ MySQL Database                          │
│ Port 3306 → Service: "mysql"            │
│ Credentials from: gearup-secrets        │
└─────────────────────────────────────────┘
```

---

## 📁 FILE DEPLOYMENT ORDER

| # | File | What | Command |
|---|------|------|---------|
| 1 | namespace.yaml | Create workspace | `kubectl apply -f 1-namespace.yaml` |
| 2 | configmap.yaml | Config (DB host, ports) | `kubectl apply -f 2-configmap.yaml` |
| 3 | secrets.yaml | Passwords & API keys | `kubectl apply -f 3-secrets.yaml` |
| 4 | mysql-pvc.yaml | Storage | `kubectl apply -f 4-mysql-pvc.yaml` |
| 5 | mysql-deployment.yaml | MySQL pod | `kubectl apply -f 5-mysql-deployment.yaml` |
| 6 | mysql-service.yaml | MySQL DNS service | `kubectl apply -f 6-mysql-service.yaml` |
| 7 | backend-deployment.yaml | Backend pod | `kubectl apply -f 7-backend-deployment.yaml` |
| 8 | backend-service.yaml | Backend DNS service | `kubectl apply -f 8-backend-service.yaml` |
| 9 | frontend-deployment.yaml | Frontend pod | `kubectl apply -f 9-frontend-deployment.yaml` |
| 10 | frontend-service.yaml | Frontend external access | `kubectl apply -f 10-frontend-service.yaml` |
| 11 | frontend-ingress.yaml | Advanced routing (optional) | `kubectl apply -f 11-frontend-ingress.yaml` |

---

## 🔑 KEY CONCEPTS

| Concept | Purpose | Your Example |
|---------|---------|--------------|
| **Namespace** | Isolate resources | `gearup` |
| **ConfigMap** | Non-secret config | `gearup-config` (DB_HOST, ports) |
| **Secret** | Secret config | `gearup-secrets` (passwords, API keys) |
| **Deployment** | Pod template | MySQL, Backend, Frontend |
| **Service** | Network exposure | mysql:3306, backend:8080, frontend:30001 |
| **Pod** | Running container | mysql-abc123, backend-def456, frontend-ghi789 |
| **Probe** | Health check | Liveness (restart if fails), Readiness (remove from service) |

---

## 💻 ESSENTIAL COMMANDS

```powershell
# Navigate
cd k8s

# Deploy everything in order
kubectl apply -f 1-namespace.yaml
kubectl apply -f 2-configmap.yaml
kubectl apply -f 3-secrets.yaml
kubectl apply -f 4-mysql-pvc.yaml
kubectl apply -f 5-mysql-deployment.yaml
kubectl apply -f 6-mysql-service.yaml
kubectl apply -f 7-backend-deployment.yaml
kubectl apply -f 8-backend-service.yaml
kubectl apply -f 9-frontend-deployment.yaml
kubectl apply -f 10-frontend-service.yaml

# Verify everything
kubectl get all -n gearup

# Check pod status
kubectl get pods -n gearup

# Check services
kubectl get svc -n gearup

# See pod details
kubectl describe pod <pod-name> -n gearup

# View logs
kubectl logs <pod-name> -n gearup

# Port forward if needed
kubectl port-forward svc/frontend 80:80 -n gearup

# Scale deployment
kubectl scale deployment backend -n gearup --replicas=3

# Delete all
kubectl delete namespace gearup
```

---

## 🎤 PRESENTATION FLOW (15 minutes)

| Time | What | How Long |
|------|------|----------|
| 0:00-1:00 | **Intro** - "3-tier app, Kubernetes, Docker Desktop" | 1 min |
| 1:00-2:00 | **Docker Desktop** - Open and show Kubernetes enabled | 1 min |
| 2:00-3:00 | **Architecture Diagram** - Draw 3 tiers, Services | 1 min |
| 3:00-4:00 | **ConfigMap** - Show 2-configmap.yaml, explain config | 1 min |
| 4:00-5:00 | **Secret** - Show 3-secrets.yaml, explain sensitive data | 1 min |
| 5:00-7:00 | **Deployments** - Show MySQL, Backend, Frontend YAMLs (detailed) | 2 min |
| 7:00-8:00 | **Services** - Show how containers connect via DNS | 1 min |
| 8:00-9:30 | **Live Deploy** - Run kubectl commands to deploy | 1.5 min |
| 9:30-10:00 | **Verify** - Show `kubectl get all -n gearup` | 0.5 min |
| 10:00-11:00 | **Data Flow** - Explain how user → frontend → backend → MySQL | 1 min |
| 11:00-12:00 | **Production** - Mention replicas, encryption, versioning | 1 min |
| 12:00-15:00 | **Q&A** - Answer questions | 3 min |

---

## ⚠️ IF ASKED QUICKLY

**Q: Kubernetes is?**
A: Container orchestration platform. Automates deployment, scaling, and management.

**Q: ConfigMap vs Secret?**
A: ConfigMap = non-sensitive (DB_HOST). Secret = sensitive (passwords).

**Q: Why Service?**
A: Exposes pods. Backend finds MySQL via Service DNS name "mysql:3306".

**Q: How database data persists?**
A: PersistentVolume. Currently using emptyDir for dev (loses data).

**Q: What if pod crashes?**
A: Liveness probe fails → Kubelet restarts pod automatically.

**Q: Scale to 3 replicas?**
A: `kubectl scale deployment backend -n gearup --replicas=3`

**Q: NodePort vs ClusterIP?**
A: NodePort = external (frontend). ClusterIP = internal (MySQL, backend).

**Q: How frontend talks to backend?**
A: Service DNS. Frontend calls "http://backend:8080". K8s DNS resolves to Service IP.

**Q: Base64 secure?**
A: NO. It's encoding not encryption. For production, use encryption at rest.

**Q: Which file deployed first?**
A: 1-namespace. All resources depend on namespace existing.

---

## 📊 YOUR NUMBERS (Memorize!)

- **Namespace:** `gearup`
- **ConfigMap:** `gearup-config`
- **Secret:** `gearup-secrets`
- **Replicas (current):** 1 (each pod)
- **Frontend port:** 80 (internal) → 30001 (external)
- **Backend port:** 8080
- **MySQL port:** 3306
- **Probes (Backend):**
  - Liveness: HTTP GET /actuator/health/liveness, initial 60s, then every 10s
  - Readiness: HTTP GET /actuator/health/readiness, initial 30s, then every 5s
- **Backend resources:**
  - Request: 512Mi memory, 250m CPU
  - Limit: 1Gi memory, 1000m CPU

---

## ✅ VIVA DAY CHECKLIST

**Morning of viva:**
- [ ] Docker Desktop running and Kubernetes enabled
- [ ] All Docker images built locally
- [ ] Namespace cleaned (kubectl delete namespace gearup)
- [ ] Terminal ready to run kubectl commands
- [ ] VS Code open with k8s folder
- [ ] This cheat sheet printed/available
- [ ] Presentation script reviewed
- [ ] Spoke through demo once

**During viva:**
- [ ] Start with architecture diagram
- [ ] Show VS Code → files one by one
- [ ] Run kubectl commands live
- [ ] Explain connections and how DNS works
- [ ] Mention production improvements
- [ ] Answer questions confidently

---

## 🚀 BONUS POINTS TO MENTION

✅ "We use Kubernetes DNS - no hardcoded IPs"
✅ "Self-healing - auto-restart failed containers"
✅ "Service discovery via DNS names"
✅ "Infrastructure as Code - reproducible"
✅ "Can scale replicas instantly"
✅ "ConfigMap and Secret separate config from code"
✅ "Health probes ensure reliability"
✅ "Rolling updates for zero downtime"

---

## 📱 DRAW THIS IF NEEDED

**Simple:**
```
Frontend → Backend → MySQL
```

**With Services:**
```
Frontend:30001 → Frontend Service → Backend Service:8080 → MySQL Service:3306
```

**With ConfigMap/Secret:**
```
        ConfigMap ─┐
                    ├─→ All Pods
        Secret ────┘

Namespace {
  Pod: Frontend
  Pod: Backend  
  Pod: MySQL
  Service: frontend (NodePort 30001)
  Service: backend (ClusterIP 8080)
  Service: mysql (ClusterIP 3306)
}
```

---

## 💪 REMEMBER

- You built a **working** Kubernetes deployment ✅
- It has **3 components** properly connected ✅
- It uses **ConfigMap + Secret** correctly ✅
- It has **health checks** configured ✅
- It demonstrates **real Kubernetes knowledge** ✅

**You're well-prepared. Speak clearly, explain the "why", and you'll ace this! 🎯**

---

**Print this page. Keep it with you. Reference it if needed. YOU GOT THIS! 💪**
