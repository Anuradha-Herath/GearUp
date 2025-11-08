# Kubernetes Deployment Guide for GearUp Application

This guide provides step-by-step instructions to deploy the GearUp application (Frontend, Backend, and MySQL Database) on Kubernetes.

## Prerequisites

### 1. **Docker Desktop Configuration**
- ✅ Docker Desktop installed with Kubernetes enabled
- ✅ Resources allocated: At least 4 CPUs and 4GB RAM for Kubernetes
- ✅ Docker images built and available locally

### 2. **Local Machine Setup**
- ✅ `kubectl` command-line tool installed
- ✅ `docker` command-line tool installed
- ✅ Access to your project workspace

### 3. **Environment Variables Prepared**
- Database credentials (DB_USER, DB_PASSWORD)
- JWT secret key
- API keys (Gemini, SendGrid)
- Frontend base URL

## Folder Structure

```
k8s/
├── README.md                          # This file
├── 1-namespace.yaml                   # Create isolated namespace
├── 2-configmap.yaml                   # Application configuration
├── 3-secrets.yaml                     # Sensitive data
├── 4-mysql-pvc.yaml                   # Database persistent storage
├── 5-mysql-deployment.yaml            # MySQL database
├── 6-mysql-service.yaml               # MySQL service
├── 7-backend-deployment.yaml          # Spring Boot backend
├── 8-backend-service.yaml             # Backend service
├── 9-frontend-deployment.yaml         # React frontend
├── 10-frontend-service.yaml           # Frontend service
├── 11-frontend-ingress.yaml           # Ingress for frontend (optional)
└── DEPLOYMENT_STEPS.md                # Step-by-step deployment guide
```

## Quick Start

```bash
# Navigate to k8s directory
cd k8s

# Apply all manifests in order
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

# Verify deployments
kubectl get deployments -n gearup
kubectl get pods -n gearup
kubectl get services -n gearup
```

## Monitoring

```bash
# Watch pod status
kubectl get pods -n gearup -w

# Check pod logs
kubectl logs -n gearup -l app=backend --tail=100
kubectl logs -n gearup -l app=frontend --tail=100
kubectl logs -n gearup -l app=mysql --tail=100

# Access port-forwards
kubectl port-forward -n gearup svc/backend 8080:8080
kubectl port-forward -n gearup svc/frontend 80:80
kubectl port-forward -n gearup svc/mysql 3306:3306
```

## Important Notes

1. **Images**: Ensure Docker images are built and available before deployment
2. **Secrets**: Update `3-secrets.yaml` with actual values (base64 encoded)
3. **Namespace**: All resources are deployed in `gearup` namespace
4. **Storage**: MySQL uses PersistentVolumeClaim for data persistence
5. **Resource Limits**: Configured for development; adjust for production

## Cleanup

```bash
# Delete all resources in gearup namespace
kubectl delete namespace gearup

# Or delete specific manifests
kubectl delete -f 10-frontend-service.yaml
kubectl delete -f 9-frontend-deployment.yaml
# ... and so on
```

## Troubleshooting

### Pod not starting?
```bash
kubectl describe pod <pod-name> -n gearup
kubectl logs <pod-name> -n gearup
```

### Service not accessible?
```bash
kubectl get svc -n gearup
kubectl port-forward svc/<service-name> <local-port>:<service-port> -n gearup
```

### Database connection issues?
```bash
kubectl exec -it <mysql-pod> -n gearup -- mysql -u gearup_user -p
```

## Next Steps

1. Review each manifest file
2. Update `3-secrets.yaml` with your actual secrets
3. Build Docker images
4. Follow deployment steps in `DEPLOYMENT_STEPS.md`
5. Verify all services are running
6. Access the application through port-forward or NodePort
