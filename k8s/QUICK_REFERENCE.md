# 🎯 QUICK REFERENCE - Everything You Need to Know

## WHERE TO START

```
Are you completely new to Kubernetes?
└─ START HERE: k8s/00-START-HERE.md

Do you want to deploy ASAP?
└─ START HERE: k8s/DOCKER_DESKTOP_SETUP.md

Do you already know Kubernetes?
└─ START HERE: k8s/ (review manifest files)

Need help navigating?
└─ START HERE: k8s/INDEX.md
```

---

## 📋 THE 3-STEP DEPLOYMENT

### STEP 1: SETUP (20-30 min)
```
cd k8s
# Read: DOCKER_DESKTOP_SETUP.md
# Enable Kubernetes in Docker Desktop
# Build Docker images
```

### STEP 2: CONFIGURE (5 min)
```
Edit: 3-secrets.yaml
Add your actual:
  - Database password
  - JWT secret
  - API keys
```

### STEP 3: DEPLOY (10 min)
```
cd k8s
.\deploy.ps1

# Or manually:
kubectl apply -f *.yaml
```

---

## 🗂️ ALL FILES CREATED

### Documentation (In k8s/ folder)
```
00-START-HERE.md              ← START HERE!
GETTING_STARTED.md
INDEX.md
DOCKER_DESKTOP_SETUP.md
SETUP_SUMMARY.md
DEPLOYMENT_STEPS.md
KUBECTL_COMMANDS.md
TROUBLESHOOTING.md
README.md
DEPLOYMENT_COMPLETE.md
```

### Kubernetes Configs (In k8s/ folder)
```
1-namespace.yaml
2-configmap.yaml
3-secrets.yaml                 ← EDIT THIS!
4-mysql-pvc.yaml
5-mysql-deployment.yaml
6-mysql-service.yaml
7-backend-deployment.yaml
8-backend-service.yaml
9-frontend-deployment.yaml
10-frontend-service.yaml
11-frontend-ingress.yaml
```

### Scripts (In k8s/ folder)
```
deploy.ps1                      ← RUN THIS!
quick-deploy.ps1
```

---

## ⚡ QUICK COMMANDS

### Deploy Everything
```powershell
cd k8s
.\deploy.ps1
```

### Check Status
```powershell
kubectl get pods -n gearup
kubectl get svc -n gearup
kubectl get all -n gearup
```

### View Logs
```powershell
kubectl logs -n gearup -l app=backend -f
kubectl logs -n gearup -l app=frontend -f
kubectl logs -n gearup -l app=mysql -f
```

### Access Services
```powershell
# Terminal 1: Frontend
kubectl port-forward -n gearup svc/frontend 80:80

# Terminal 2: Backend
kubectl port-forward -n gearup svc/backend 8080:8080

# Terminal 3: Database
kubectl port-forward -n gearup svc/mysql 3306:3306
```

---

## 📊 WHAT GETS DEPLOYED

```
Namespace: gearup
├── Frontend Pod (React + Nginx)
│   └─ Service: frontend (NodePort 30000)
├── Backend Pod (Spring Boot)
│   └─ Service: backend (NodePort 30080)
├── MySQL Pod (Database)
│   ├─ Service: mysql (ClusterIP)
│   └─ Storage: 5GB PersistentVolumeClaim
├── ConfigMap: gearup-config
└── Secret: gearup-secrets
```

---

## 🎯 FILE PURPOSES AT A GLANCE

| File | Purpose | Edit? |
|------|---------|-------|
| 00-START-HERE.md | Read this first! | No |
| DOCKER_DESKTOP_SETUP.md | Setup instructions | No |
| DEPLOYMENT_STEPS.md | Detailed guide | No |
| 3-secrets.yaml | Your passwords & keys | **YES** |
| 2-configmap.yaml | Application config | No (optional) |
| 1-11.yaml | K8s manifests | No (understand) |
| deploy.ps1 | Run to deploy | No |

---

## ✅ SUCCESS CHECKLIST

After deployment:
- [ ] Can access frontend at http://localhost
- [ ] Can access backend API at http://localhost:8080
- [ ] Can log into the application
- [ ] All pods show "Running" and "Ready"
- [ ] No error logs in kubectl logs
- [ ] Database is persisting data

---

## 🛑 BEFORE YOU START

Make sure you have:
- [ ] Docker Desktop installed
- [ ] Kubernetes enabled in Docker Desktop
- [ ] 4GB+ RAM allocated to Docker
- [ ] 10GB+ free disk space
- [ ] Internet connection
- [ ] 45 minutes of time

---

## 📖 WHICH FILE TO READ?

```
"I'm new to Kubernetes"
└─ Read: GETTING_STARTED.md then SETUP_SUMMARY.md

"I want to deploy now"
└─ Read: DOCKER_DESKTOP_SETUP.md then run .\deploy.ps1

"I want details"
└─ Read: DEPLOYMENT_STEPS.md (step by step)

"I need commands"
└─ Read: KUBECTL_COMMANDS.md (reference)

"Something broke"
└─ Read: TROUBLESHOOTING.md (solutions)

"I'm lost"
└─ Read: INDEX.md (navigation guide)
```

---

## 🚀 WHAT HAPPENS WHEN YOU RUN DEPLOY.PS1

```
1. Checks Docker & kubectl
2. Builds backend image
3. Builds frontend image
4. Creates namespace
5. Creates ConfigMap
6. Creates Secrets
7. Creates storage
8. Deploys MySQL ⏳ Waits...
9. Deploys backend ⏳ Waits...
10. Deploys frontend ⏳ Waits...
11. Verifies everything
12. Shows success! ✓
```

---

## 💾 FOLDER STRUCTURE

```
GearUp/
├── k8s/
│   ├── 00-START-HERE.md          ← YOU ARE HERE
│   ├── DOCKER_DESKTOP_SETUP.md
│   ├── SETUP_SUMMARY.md
│   ├── DEPLOYMENT_STEPS.md
│   ├── KUBECTL_COMMANDS.md
│   ├── TROUBLESHOOTING.md
│   ├── README.md
│   ├── GETTING_STARTED.md
│   ├── INDEX.md
│   ├── DEPLOYMENT_COMPLETE.md
│   │
│   ├── 1-namespace.yaml
│   ├── 2-configmap.yaml
│   ├── 3-secrets.yaml
│   ├── 4-mysql-pvc.yaml
│   ├── 5-mysql-deployment.yaml
│   ├── 6-mysql-service.yaml
│   ├── 7-backend-deployment.yaml
│   ├── 8-backend-service.yaml
│   ├── 9-frontend-deployment.yaml
│   ├── 10-frontend-service.yaml
│   ├── 11-frontend-ingress.yaml
│   │
│   ├── deploy.ps1
│   └── quick-deploy.ps1
│
├── KUBERNETES_SETUP_COMPLETE.md  ← Summary file
├── docker/
├── backend/
└── frontend/
```

---

## ⏱️ TIME BREAKDOWN

```
Reading guides           : 30-60 min
Setting up Docker/K8s   : 20-30 min
Building images         : 10-15 min
Deploying               : 5-10 min
Testing                 : 5 min
─────────────────────────────────
TOTAL                   : 70-120 min
```

---

## 🔑 KEY FILES

**MUST EDIT:**
- `3-secrets.yaml` - Add your real passwords & keys

**SHOULD READ:**
- `DOCKER_DESKTOP_SETUP.md` - Setup instructions
- `DEPLOYMENT_STEPS.md` - How to deploy
- `KUBECTL_COMMANDS.md` - Commands to use

**REFER TO IF NEEDED:**
- `TROUBLESHOOTING.md` - Fix problems
- Manifest files (1-11.yaml) - Understand configuration

---

## 🎯 YOUR NEXT ACTION

**Right now, do this:**

1. Navigate to your k8s/ folder
2. Open: `00-START-HERE.md`
3. Follow the recommendations
4. Open: `DOCKER_DESKTOP_SETUP.md`
5. Follow all the steps

**That's it! The guides will take it from there.**

---

## ✨ YOU HAVE EVERYTHING YOU NEED

✅ Complete setup instructions  
✅ All Kubernetes manifest files  
✅ Deployment automation  
✅ Troubleshooting guides  
✅ Command references  
✅ Architecture documentation  

**Start reading and deploying! 🚀**

---

**Status: READY TO DEPLOY**  
**Location: k8s/ folder**  
**Next Step: Read 00-START-HERE.md**
