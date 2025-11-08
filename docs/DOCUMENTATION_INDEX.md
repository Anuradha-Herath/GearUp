# 📖 GearUp Deployment - Documentation Index

## 🚀 Start Here

If you just want to **use the application**, go to:
- **Frontend**: http://localhost:30000
- **Backend API**: http://localhost:30080

---

## 📚 Documentation by Purpose

### I want to...

#### 🎯 **Get Started Quickly**
→ Read: [`QUICK_REFERENCE.md`](QUICK_REFERENCE.md)
- Quick commands
- Common tasks
- Troubleshooting

#### 📊 **Understand the Deployment**
→ Read: [`DEPLOYMENT_SUCCESS.md`](DEPLOYMENT_SUCCESS.md)
- Complete architecture
- Configuration details
- How everything works

#### 🔧 **See What Was Fixed**
→ Read: [`DEPLOYMENT_FIX.md`](DEPLOYMENT_FIX.md)
- What the problem was
- How it was fixed
- Technical details

#### ✅ **Verify Everything is Working**
→ Read: [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)
- 180+ verification points
- All completed items
- Health status

#### 📈 **Get Status Report**
→ Read: [`DEPLOYMENT_COMPLETE.md`](DEPLOYMENT_COMPLETE.md)
- Current status
- What you can do now
- Next steps

---

## 📁 File Organization

```
Project Root
│
├─ 📄 QUICK_REFERENCE.md           ← START HERE for commands
├─ 📄 DEPLOYMENT_SUCCESS.md        ← Complete guide
├─ 📄 DEPLOYMENT_COMPLETE.md       ← Status & next steps
├─ 📄 DEPLOYMENT_FIX.md            ← Technical fix details
├─ 📄 DEPLOYMENT_CHECKLIST.md      ← Verification checklist
├─ 📄 README.md                    ← Project overview
│
├─ k8s/                            ← Kubernetes manifests
│  ├─ 1-namespace.yaml
│  ├─ 2-configmap.yaml
│  ├─ 3-secrets.yaml
│  ├─ 7-backend-deployment.yaml    ✅ FIXED
│  ├─ 8-backend-service.yaml
│  ├─ 9-frontend-deployment.yaml
│  └─ 10-frontend-service.yaml
│
├─ docker/                         ← Docker configuration
│  ├─ backend.Dockerfile
│  ├─ frontend.Dockerfile          ✅ Updated to Apache httpd
│  └─ docker-compose.yml
│
├─ database/                       ← Database setup
│  └─ migrations/                  ✅ All 15 executed
│     ├─ V1__Create_users_table.sql
│     ├─ V2__Create_services_table.sql
│     └─ ... (15 files total)
│
├─ backend/                        ← Spring Boot app
│  ├─ src/
│  ├─ pom.xml
│  └─ target/*.jar
│
├─ frontend/                       ← React SPA
│  ├─ src/
│  ├─ package.json
│  └─ vite.config.js
│
├─ run_migrations.ps1              ✅ Created for running migrations
└─ scripts/                        ← Utility scripts
```

---

## 🎯 What's Running Right Now

### Frontend
- **URL**: http://localhost:30000
- **Type**: React SPA
- **Server**: Apache httpd
- **Status**: ✅ Running (1/1 Ready)
- **Accessed via**: NodePort 30000

### Backend
- **URL**: http://localhost:30080
- **Type**: Spring Boot REST API
- **Status**: ✅ Running (1/1 Ready)
- **Accessed via**: NodePort 30080
- **Health**: http://localhost:30080/actuator/health

### Database
- **Type**: MySQL 5.7
- **Port**: 3307 (Docker host)
- **Database**: gearup
- **Tables**: 8 tables with seed data
- **Status**: ✅ Running
- **Accessed via**: Docker Compose

---

## 🔧 Essential Commands

### Check Status
```bash
# All resources in namespace
kubectl get all -n gearup

# Specific pods
kubectl get pods -n gearup

# Service endpoints
kubectl get svc -n gearup
```

### View Logs
```bash
# Backend logs
kubectl logs -n gearup -l app=backend -f

# Frontend logs
kubectl logs -n gearup -l app=frontend -f

# Last 50 lines
kubectl logs -n gearup pod/<pod-name> --tail=50
```

### Test Connectivity
```bash
# Test backend health
curl http://localhost:30080/actuator/health

# From within Kubernetes
kubectl run -it --rm test --image=curlimages/curl --restart=Never -n gearup -- \
  curl http://backend:8080/actuator/health
```

---

## ❓ FAQ

**Q: Can I access the frontend?**  
A: Yes! Open http://localhost:30000 in your browser.

**Q: Is the backend working?**  
A: Yes! The backend is running at http://localhost:30080. Check health: http://localhost:30080/actuator/health

**Q: Where is my data stored?**  
A: MySQL database is running in Docker. Data persists in the `mysql-data` volume.

**Q: Can I scale the application?**  
A: Yes! Use `kubectl scale deployment backend --replicas=3 -n gearup` for high availability.

**Q: How do I restart services?**  
A: Use `kubectl rollout restart deployment/<name> -n gearup`

**Q: Where are the API endpoints?**  
A: Backend is at http://localhost:30080. Frontend connects to it automatically.

**Q: Can I access the database directly?**  
A: Yes! Docker container is `gearup-mysql-dev` on port 3307.

**Q: What if something breaks?**  
A: Check `QUICK_REFERENCE.md` for troubleshooting section.

---

## 📋 Verification Checklist

- [x] Frontend accessible at http://localhost:30000
- [x] Backend responding at http://localhost:30080
- [x] Database tables created (8 tables)
- [x] Seed data populated
- [x] Health checks passing
- [x] Pod readiness: 1/1 for both services
- [x] Network connectivity verified
- [x] Services exposed via NodePort

---

## 🎓 Learning Resources

### Understanding the Deployment

1. **Kubernetes Basics**: Read `DEPLOYMENT_SUCCESS.md` → Architecture Overview
2. **Docker Concepts**: Review `docker/backend.Dockerfile` and `docker/frontend.Dockerfile`
3. **Database**: Check `database/migrations/` to see schema
4. **Configuration**: See `k8s/2-configmap.yaml` and `k8s/3-secrets.yaml`

### Troubleshooting

1. **Pod not starting?**: `kubectl logs -n gearup -l app=<service> --tail=100`
2. **Connection issues?**: `kubectl describe pod <pod-name> -n gearup`
3. **Database problems?**: `docker logs gearup-mysql-dev`

---

## 🚨 Troubleshooting Quick Links

- **Backend CrashLoopBackOff**: See `DEPLOYMENT_FIX.md` - similar issues fixed
- **Cannot connect to server**: Check backend health: `curl http://localhost:30080/actuator/health`
- **Database tables missing**: Run `powershell -ExecutionPolicy Bypass -File run_migrations.ps1`
- **Port already in use**: Kill existing process with `netstat -ano` and `taskkill`

---

## 📞 Support Information

**All issues have been resolved** ✅

### Known Working
- Frontend UI displays correctly
- Backend API responds to requests
- Database has all tables and seed data
- Services communicate properly
- Health checks passing
- Logging available

### If You Need Help
1. Check the relevant documentation file above
2. Review the troubleshooting section in `QUICK_REFERENCE.md`
3. Check pod logs: `kubectl logs -n gearup -l app=<service> -f`
4. Verify connectivity: See `DEPLOYMENT_SUCCESS.md` → Health Checks

---

## 🎉 Summary

Your GearUp application is:
- ✅ **Deployed** on Kubernetes
- ✅ **Running** and healthy
- ✅ **Accessible** via web browser and API
- ✅ **Connected** to database
- ✅ **Documented** comprehensively
- ✅ **Ready to use** immediately

**For the quickest start, go to `QUICK_REFERENCE.md`**

---

## 📊 Documentation Files at a Glance

| Document | Purpose | Best For |
|----------|---------|----------|
| `QUICK_REFERENCE.md` | Quick commands and troubleshooting | Getting things done fast |
| `DEPLOYMENT_SUCCESS.md` | Complete guide and architecture | Understanding everything |
| `DEPLOYMENT_FIX.md` | Technical details of fixes | Learning what was fixed |
| `DEPLOYMENT_COMPLETE.md` | Current status and next steps | Planning and operations |
| `DEPLOYMENT_CHECKLIST.md` | Comprehensive verification | Validation and auditing |
| `README.md` | Project overview | Project context |

---

**Choose a document above and start!** 📖
