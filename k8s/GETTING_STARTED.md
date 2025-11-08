# 🚀 GearUp Kubernetes Deployment - Getting Started Guide

**Welcome!** You now have a complete Kubernetes setup for your GearUp application. This file will help you get started quickly.

---

## ⚡ Quick Overview (60 Seconds)

```
What is Kubernetes?
└─ A container orchestration platform that manages your application
   - Runs multiple containers (backend, frontend, database)
   - Ensures they stay running
   - Handles networking between containers
   - Easy scaling and updates

What did we create?
├─ 11 Kubernetes manifest files (YAML configs)
├─ 2 deployment scripts (PowerShell automation)
└─ 7 comprehensive guides

What can you do with it?
├─ Deploy your full stack to Kubernetes
├─ Scale services up/down easily
├─ Update images without downtime
├─ Monitor logs and pod status
└─ Manage secrets and configuration
```

---

## 📋 What's in the k8s/ Folder

### 📄 Configuration Files (The Brain)
```
2-configmap.yaml       ← App configuration (ports, URLs, etc.)
3-secrets.yaml         ← Sensitive data (passwords, keys)
```

### 🗄️ Database (The Storage)
```
4-mysql-pvc.yaml              ← Disk space for MySQL
5-mysql-deployment.yaml       ← MySQL container setup
6-mysql-service.yaml          ← How to connect to MySQL
```

### 🖥️ Backend (The API)
```
7-backend-deployment.yaml     ← Spring Boot container setup
8-backend-service.yaml        ← How to connect to backend
```

### 🎨 Frontend (The UI)
```
9-frontend-deployment.yaml    ← React + Nginx container setup
10-frontend-service.yaml      ← How to connect to frontend
```

### 🌐 Advanced (Optional)
```
11-frontend-ingress.yaml      ← Advanced routing with SSL
```

### 📚 Documentation
```
INDEX.md                       ← Navigation guide (you are here)
DOCKER_DESKTOP_SETUP.md        ← How to enable Kubernetes
SETUP_SUMMARY.md               ← Architecture & concepts
DEPLOYMENT_STEPS.md            ← Step-by-step guide
KUBECTL_COMMANDS.md            ← Command reference
TROUBLESHOOTING.md             ← Problem solving
```

### 🤖 Automation Scripts
```
deploy.ps1                     ← Full automated deployment
quick-deploy.ps1              ← Simple quick deployment
```

---

## 🎯 Your Next Steps (Choose One)

### Option A: I'm in a hurry ⏱️
```
1. Follow DOCKER_DESKTOP_SETUP.md (15 minutes)
2. Run: .\deploy.ps1
3. Wait for deployment
4. Access http://localhost
Done! ✓
```

### Option B: I want to understand everything 🎓
```
1. Read INDEX.md (this helps you navigate)
2. Read SETUP_SUMMARY.md (understand architecture)
3. Follow DEPLOYMENT_STEPS.md (guided walkthrough)
4. Keep KUBECTL_COMMANDS.md handy
5. Refer to TROUBLESHOOTING.md if needed
```

### Option C: I know Kubernetes 🚀
```
1. Check the manifest files (numbered 1-11)
2. Update 3-secrets.yaml with your values
3. Run: kubectl apply -f *.yaml
4. Done!
```

---

## 🏃 Quick Start (TL;DR)

### Step 1: Enable Kubernetes (One-time)
```powershell
# 1. Open Docker Desktop
# 2. Settings → Kubernetes → Check "Enable Kubernetes"
# 3. Click "Apply & Restart"
# 4. Wait 2-3 minutes
# 5. Run this to verify:
kubectl cluster-info
```

### Step 2: Build Docker Images
```powershell
cd "..\..\"  # Go to project root

docker build -f docker/backend.Dockerfile -t gearup/backend:latest .
docker build -f docker/frontend.Dockerfile -t gearup/frontend:latest .
```

### Step 3: Deploy!
```powershell
cd k8s
.\deploy.ps1  # Or run manual kubectl apply commands
```

### Step 4: Access
```powershell
# Open 3 PowerShell windows:

# Window 1
kubectl port-forward -n gearup svc/frontend 80:80

# Window 2
kubectl port-forward -n gearup svc/backend 8080:8080

# Window 3
kubectl port-forward -n gearup svc/mysql 3306:3306

# Then visit:
# Frontend: http://localhost
# Backend:  http://localhost:8080
# MySQL:    localhost:3306
```

---

## 📊 Architecture Visualization

```
┌─────────────────────────────────────────────┐
│         Your Computer (Windows)              │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │   Docker Desktop                     │   │
│  │   ├─ Kubernetes Cluster              │   │
│  │   │                                  │   │
│  │   │  ┌──────────────────────────┐   │   │
│  │   │  │  gearup namespace        │   │   │
│  │   │  │                          │   │   │
│  │   │  │  ┌────────────────────┐  │   │   │
│  │   │  │  │  Frontend (Nginx)  │←─┼───┼─→ Port 80
│  │   │  │  │  Reacts to requests│  │   │   │
│  │   │  │  └─────────┬──────────┘  │   │   │
│  │   │  │            │             │   │   │
│  │   │  │  ┌─────────▼──────────┐  │   │   │
│  │   │  │  │  Backend (Spring)  │←─┼───┼─→ Port 8080
│  │   │  │  │  Provides APIs     │  │   │   │
│  │   │  │  └─────────┬──────────┘  │   │   │
│  │   │  │            │             │   │   │
│  │   │  │  ┌─────────▼──────────┐  │   │   │
│  │   │  │  │  MySQL (Database)  │←─┼───┼─→ Port 3306
│  │   │  │  │  Stores everything │  │   │   │
│  │   │  │  └────────────────────┘  │   │   │
│  │   │  └──────────────────────────┘  │   │
│  │   └──────────────────────────────────┘   │
│  │                                          │
│  │  ConfigMap & Secrets (Settings)         │
│  │  Persistent Volume (Database storage)   │
│  │                                          │
│  └──────────────────────────────────────┘   │
│                                              │
└─────────────────────────────────────────────┘
```

---

## 🔑 Key Files to Know

### For Configuration
**Edit these when you want to change settings:**
- `2-configmap.yaml` - Non-secret config (database name, ports)
- `3-secrets.yaml` - Secret config (passwords, API keys)

### For Deployment Details
**Understanding what's running:**
- `5-mysql-deployment.yaml` - How MySQL runs
- `7-backend-deployment.yaml` - How backend runs
- `9-frontend-deployment.yaml` - How frontend runs

### For Operations
**Using these to manage:**
- `DEPLOYMENT_STEPS.md` - Deploy for first time
- `KUBECTL_COMMANDS.md` - Run commands
- `TROUBLESHOOTING.md` - Fix problems

---

## ⚙️ System Requirements

### Minimum
- ✅ 4 GB RAM (allocated to Docker)
- ✅ 4 CPU cores
- ✅ 10 GB free disk space
- ✅ Windows 10/11

### Recommended
- ⭐ 8 GB+ RAM
- ⭐ 6+ CPU cores
- ⭐ 20+ GB free disk space
- ⭐ SSD for better performance

---

## 🛠️ Common Commands

```powershell
# Check status
kubectl get pods -n gearup

# Watch in real-time
kubectl get pods -n gearup -w

# View logs
kubectl logs -n gearup -l app=backend -f

# Connect to pod
kubectl exec -it <pod-name> -n gearup -- /bin/bash

# Restart service
kubectl rollout restart deployment/backend -n gearup

# Scale service
kubectl scale deployment/backend --replicas=3 -n gearup

# Delete everything
kubectl delete namespace gearup
```

---

## 📞 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Kubernetes won't enable | See DOCKER_DESKTOP_SETUP.md |
| Images won't build | Check disk space, read TROUBLESHOOTING.md |
| Pods stuck in pending | See TROUBLESHOOTING.md → "Pod Stuck in Pending" |
| Can't connect to database | See TROUBLESHOOTING.md → "Database Connection Issues" |
| Frontend can't reach backend | See TROUBLESHOOTING.md → "Frontend Can't Reach Backend" |
| Something else broken | Check TROUBLESHOOTING.md or KUBERNETES_COMMANDS.md |

---

## 🎓 Learning Resources

### In This Folder
1. **DOCKER_DESKTOP_SETUP.md** - Start here
2. **SETUP_SUMMARY.md** - Learn concepts
3. **DEPLOYMENT_STEPS.md** - Follow steps
4. **KUBECTL_COMMANDS.md** - Reference
5. **TROUBLESHOOTING.md** - Problem solving

### External
- **Official Kubernetes**: https://kubernetes.io/docs/
- **Docker Desktop**: https://docs.docker.com/desktop/
- **kubectl Cheat Sheet**: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

---

## ✨ What You Can Do Now

✅ Deploy your application to Kubernetes  
✅ Scale services up and down  
✅ Update application code without downtime  
✅ Monitor logs and pod status  
✅ Manage configuration and secrets  
✅ Handle database persistence  
✅ Run multiple instances for high availability  

---

## 🎉 Success Looks Like

When everything is working:

```
$ kubectl get pods -n gearup
NAME                        READY   STATUS    RESTARTS   AGE
frontend-5d4c6d6f5f-xxxxx   1/1     Running   0          5m
backend-7b8c4d6f5f-xxxxx    1/1     Running   0          5m
mysql-9d8c4d6f5f-xxxxx      1/1     Running   0          10m

$ kubectl get svc -n gearup
NAME       TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)
frontend   NodePort   10.96.0.1       <none>        80:30000/TCP
backend    NodePort   10.96.0.2       <none>        8080:30080/TCP
mysql      ClusterIP  10.96.0.3       <none>        3306/TCP

✓ All pods Running
✓ All services have endpoints
✓ Frontend accessible at http://localhost
✓ Backend accessible at http://localhost:8080
✓ Can log into application
✓ No errors in logs
```

---

## 🚨 Common Mistakes to Avoid

❌ Don't forget to enable Kubernetes before deploying  
❌ Don't skip building Docker images  
❌ Don't commit 3-secrets.yaml to git  
❌ Don't allocate less than 4GB RAM to Docker  
❌ Don't expect pods to work before MySQL is ready  
❌ Don't use localhost inside Kubernetes (use service names)  

---

## 📝 File Reading Order

```
First time deploying?
    ↓
Read: DOCKER_DESKTOP_SETUP.md (set up environment)
    ↓
Read: SETUP_SUMMARY.md (understand what you're deploying)
    ↓
Follow: DEPLOYMENT_STEPS.md (deploy step by step)
    ↓
Reference: KUBECTL_COMMANDS.md (manage your deployment)
    ↓
If problems: TROUBLESHOOTING.md (fix issues)
```

---

## 💡 Pro Tips

1. **Keep a terminal open** watching pods:
   ```powershell
   kubectl get pods -n gearup -w
   ```

2. **Use aliases** for frequently used commands:
   ```powershell
   Set-Alias k kubectl
   Set-Alias kgp { kubectl get pods -n gearup }
   ```

3. **Save port-forwards to files** for easy access:
   ```powershell
   Start-Job { kubectl port-forward -n gearup svc/frontend 80:80 }
   ```

4. **Check logs regularly** during troubleshooting:
   ```powershell
   kubectl logs -n gearup -l app=backend -f
   ```

---

## 🎯 Your Personal Deployment Checklist

```
□ Read this file (Getting Started Guide)
□ Follow DOCKER_DESKTOP_SETUP.md
□ Build Docker images
□ Update 3-secrets.yaml with your actual values
□ Run deployment (script or manual kubectl apply)
□ Check all pods are running
□ Test frontend at http://localhost
□ Test backend at http://localhost:8080
□ Login to application
□ Check logs for errors
□ Read KUBECTL_COMMANDS.md to learn operations
□ Bookmark TROUBLESHOOTING.md for later
□ You're done! 🎉
```

---

## 📞 Still Confused?

**Not sure where to start?**
→ Open `INDEX.md` for navigation

**Want step-by-step instructions?**
→ Open `DEPLOYMENT_STEPS.md`

**System setup questions?**
→ Open `DOCKER_DESKTOP_SETUP.md`

**Something broke?**
→ Open `TROUBLESHOOTING.md`

**Need a command?**
→ Open `KUBECTL_COMMANDS.md`

**Want to understand architecture?**
→ Open `SETUP_SUMMARY.md`

---

## 🏁 Ready to Deploy?

**Start here**: Open `DOCKER_DESKTOP_SETUP.md` and follow the steps!

You've got everything you need. The guides are detailed and easy to follow.

**Good luck! 🚀**

---

**Created**: November 2024  
**Version**: 1.0  
**Application**: GearUp (AutoServe)  
**Platform**: Windows + Docker Desktop + Kubernetes
