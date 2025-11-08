---
# Kubernetes Deployment Index

**Last Updated**: November 2024  
**Version**: 1.0  
**Application**: GearUp (AutoServe)  
**Platform**: Windows with Docker Desktop + Kubernetes

---

## 🎯 START HERE

If you're new to Kubernetes deployment, follow this order:

1. **[DOCKER_DESKTOP_SETUP.md](DOCKER_DESKTOP_SETUP.md)** ← Start here!
   - Enable Kubernetes in Docker Desktop
   - Verify system configuration
   - Build Docker images
   - ~30 minutes

2. **[SETUP_SUMMARY.md](SETUP_SUMMARY.md)** ← Read this next
   - Architecture overview
   - File breakdown
   - Understanding the structure
   - ~15 minutes

3. **[DEPLOYMENT_STEPS.md](DEPLOYMENT_STEPS.md)** ← Detailed walkthrough
   - Phase by phase guide
   - Detailed explanations
   - Troubleshooting during deployment
   - ~45 minutes

4. **[KUBECTL_COMMANDS.md](KUBECTL_COMMANDS.md)** ← Keep handy
   - Common kubectl commands
   - Reference guide
   - Copy-paste commands

5. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** ← If something breaks
   - Common issues & solutions
   - Debugging techniques
   - Diagnostic commands

---

## 📁 Kubernetes Manifest Files (In Deployment Order)

```
k8s/
├── 1-namespace.yaml          ← Create isolated namespace
├── 2-configmap.yaml          ← Application configuration
├── 3-secrets.yaml            ← Passwords & API keys (⚠️ Keep secret!)
├── 4-mysql-pvc.yaml          ← Database storage
├── 5-mysql-deployment.yaml   ← MySQL database container
├── 6-mysql-service.yaml      ← Database network endpoint
├── 7-backend-deployment.yaml ← Spring Boot backend
├── 8-backend-service.yaml    ← Backend network endpoint
├── 9-frontend-deployment.yaml ← React frontend
├── 10-frontend-service.yaml  ← Frontend network endpoint
└── 11-frontend-ingress.yaml  ← Advanced routing (optional)
```

---

## 🚀 Quick Start (After Setup)

### Apply all manifests at once:
```powershell
cd k8s
.\deploy.ps1                    # Automated deployment script

# OR manual deployment
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
```

### Access the application:
```powershell
# Terminal 1: Frontend
kubectl port-forward -n gearup svc/frontend 80:80

# Terminal 2: Backend
kubectl port-forward -n gearup svc/backend 8080:8080

# Terminal 3: Database
kubectl port-forward -n gearup svc/mysql 3306:3306
```

Then open:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:3306 (via MySQL client)

---

## 📖 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| **DOCKER_DESKTOP_SETUP.md** | Configure Docker Desktop & enable Kubernetes | 30 min |
| **SETUP_SUMMARY.md** | Overview, architecture, and key concepts | 15 min |
| **DEPLOYMENT_STEPS.md** | Step-by-step deployment guide with explanations | 45 min |
| **KUBECTL_COMMANDS.md** | Reference of useful kubectl commands | 10 min |
| **TROUBLESHOOTING.md** | Common issues and how to fix them | 20 min |
| **README.md** | Quick reference and overview | 5 min |
| **INDEX.md** | This file - navigation guide | 5 min |

---

## 🔑 Key Concepts

### 1. Kubernetes Namespace
- Isolated environment for your application
- All GearUp resources are in `gearup` namespace
- Prevents conflicts with other applications

### 2. ConfigMap
- Stores non-sensitive configuration
- Database name, port, logging levels
- Edit without rebuilding images

### 3. Secrets
- Stores sensitive data (encrypted base64)
- Database passwords, API keys, JWT secrets
- ⚠️ Must be base64-encoded before deployment
- ⚠️ Should NOT be committed to git

### 4. PersistentVolumeClaim (PVC)
- Storage for MySQL database
- Data persists after pod restarts
- 5GB allocated in default setup

### 5. Deployment
- Manages pod replicas
- Ensures pods are always running
- Handles rolling updates

### 6. Pod
- Smallest Kubernetes unit
- Contains one or more containers
- In our setup: one container per pod

### 7. Service
- Stable network endpoint for pods
- Types: ClusterIP (internal), NodePort (external), LoadBalancer
- Our setup uses NodePort for frontend/backend

---

## 🎓 Learning Path

### Beginner
1. Read DOCKER_DESKTOP_SETUP.md
2. Run deployment script
3. Access the application
4. Read SETUP_SUMMARY.md to understand what you deployed

### Intermediate
1. Review each manifest file in k8s/ folder
2. Understand ConfigMap and Secrets
3. Learn basic kubectl commands from KUBECTL_COMMANDS.md
4. Practice scaling and updating deployments

### Advanced
1. Study Ingress configuration (11-frontend-ingress.yaml)
2. Implement Network Policies for security
3. Set up monitoring and logging
4. Configure SSL/TLS with cert-manager
5. Deploy to cloud (AWS/Azure/GCP)

---

## ✅ Verification Checklist

After deployment, verify:

- ✅ All pods are Running
  ```powershell
  kubectl get pods -n gearup
  ```

- ✅ All services have endpoints
  ```powershell
  kubectl get svc -n gearup
  ```

- ✅ Frontend accessible at http://localhost (via port-forward)

- ✅ Backend accessible at http://localhost:8080 (via port-forward)

- ✅ Can login to application

- ✅ No error logs
  ```powershell
  kubectl logs -n gearup -l app=backend
  kubectl logs -n gearup -l app=frontend
  kubectl logs -n gearup -l app=mysql
  ```

---

## 🛠️ Common Operations

### View Everything
```powershell
kubectl get all -n gearup
```

### View Logs
```powershell
# All services
kubectl logs -n gearup --all-containers=true -f

# Specific service
kubectl logs -n gearup -l app=backend -f
```

### Restart Pods
```powershell
kubectl rollout restart deployment/backend -n gearup
kubectl rollout restart deployment/frontend -n gearup
kubectl rollout restart deployment/mysql -n gearup
```

### Scale Backend
```powershell
kubectl scale deployment/backend --replicas=3 -n gearup
```

### Delete Everything
```powershell
kubectl delete namespace gearup
```

---

## 📞 Getting Help

### During Setup
- Follow DOCKER_DESKTOP_SETUP.md step-by-step
- Check system requirements
- Ensure Docker Desktop is running

### During Deployment
- Follow DEPLOYMENT_STEPS.md
- Use quick-deploy.ps1 script
- Check TROUBLESHOOTING.md

### When Something Breaks
- Check pod logs: `kubectl logs -n gearup <pod-name>`
- Describe pod: `kubectl describe pod <pod-name> -n gearup`
- Check events: `kubectl get events -n gearup`
- Read TROUBLESHOOTING.md

### Useful Commands
```powershell
# Check cluster status
kubectl cluster-info

# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n gearup

# Describe any resource
kubectl describe <resource> <name> -n gearup

# Edit any resource
kubectl edit <resource> <name> -n gearup
```

---

## 🔐 Security Notes

### For Development
Current setup is suitable for local development:
- Basic ConfigMap and Secrets
- No SSL/TLS
- No Network Policies
- Wide resource limits

### For Production
Before deploying to production:
- ✅ Use external secrets management (HashiCorp Vault, AWS Secrets Manager)
- ✅ Enable SSL/TLS with cert-manager
- ✅ Implement Network Policies
- ✅ Set up RBAC (Role-Based Access Control)
- ✅ Configure resource quotas
- ✅ Enable audit logging
- ✅ Use private container registry
- ✅ Implement pod security policies
- ✅ Set up monitoring and alerting

---

## 📊 File Structure

```
GearUp/
├── k8s/                          ← You are here
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
│   ├── deploy.ps1               ← Automated deployment script
│   ├── quick-deploy.ps1         ← Simple deployment script
│   ├── README.md
│   ├── SETUP_SUMMARY.md
│   ├── DEPLOYMENT_STEPS.md
│   ├── DOCKER_DESKTOP_SETUP.md
│   ├── KUBECTL_COMMANDS.md
│   ├── TROUBLESHOOTING.md
│   └── INDEX.md                 ← This file
├── docker/
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── docker-compose.yml
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
└── database/
    ├── migrations/
    └── ...
```

---

## 🎯 Decision Tree

### What should I read?
```
Are you new to Kubernetes?
├─ YES → Read DOCKER_DESKTOP_SETUP.md first
└─ NO → Go to SETUP_SUMMARY.md

Do you want step-by-step deployment?
├─ YES → Follow DEPLOYMENT_STEPS.md
└─ NO → Use deploy.ps1 script

Something not working?
├─ YES → Check TROUBLESHOOTING.md
└─ NO → Great! Read KUBECTL_COMMANDS.md for next steps

Want to customize the setup?
├─ YES → Edit manifest files, read comments in each
└─ NO → Keep defaults, they work for most cases
```

---

## ⏱️ Time Estimates

| Task | Time | Prerequisites |
|------|------|----------------|
| Docker Desktop Setup | 15 min | Docker Desktop installed |
| Enable Kubernetes | 5 min | Docker Desktop setup complete |
| Build Docker Images | 10 min | Kubernetes running |
| Deploy to Kubernetes | 5 min | Images built |
| Verify Deployment | 2 min | Deployment complete |
| **Total** | **37 min** | - |

---

## 🚀 Next Steps

1. **Right now**: Open DOCKER_DESKTOP_SETUP.md
2. **Then**: Complete all steps in that guide
3. **Next**: Return here and follow DEPLOYMENT_STEPS.md
4. **Finally**: Use KUBECTL_COMMANDS.md as your reference

---

## 📝 Notes

- All manifests are in YAML format
- Files are numbered for deployment order
- Namespace is hardcoded as `gearup`
- Using local Docker images (not from registry)
- Development-friendly resource limits
- Comments explain each setting in manifests

---

## 💡 Pro Tips

1. **Use tab completion** in PowerShell:
   ```powershell
   # Enable kubectl completion
   kubectl completion powershell | Out-String | Invoke-Expression
   ```

2. **Create aliases** for common commands:
   ```powershell
   Set-Alias -Name k -Value kubectl
   Set-Alias -Name kgp -Value { kubectl get pods -n gearup }
   ```

3. **Keep a terminal open** for watching pods:
   ```powershell
   kubectl get pods -n gearup -w
   ```

4. **Port-forward in background** (PowerShell):
   ```powershell
   Start-Job { kubectl port-forward -n gearup svc/frontend 80:80 }
   Get-Job
   ```

---

## 📚 Additional Resources

- **Kubernetes Official Docs**: https://kubernetes.io/docs/
- **Docker Desktop Docs**: https://docs.docker.com/desktop/kubernetes/
- **kubectl Cheat Sheet**: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- **Spring Boot on Kubernetes**: https://spring.io/guides/gs/spring-boot-docker/

---

## ✨ You've Got This!

Don't worry if this seems overwhelming at first. The guides are detailed and easy to follow. Start with DOCKER_DESKTOP_SETUP.md and follow one step at a time.

**Questions?** Check TROUBLESHOOTING.md or read the detailed comments in manifest files.

**Good luck!** 🍀

---

**Created**: November 2024  
**For**: GearUp Application  
**Environment**: Windows + Docker Desktop + Kubernetes
