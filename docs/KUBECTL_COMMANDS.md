# Quick Reference - Useful kubectl Commands

## Connection & Setup
- **Check cluster info**: `kubectl cluster-info`
- **Get nodes**: `kubectl get nodes`
- **Get current context**: `kubectl config current-context`
- **Get all namespaces**: `kubectl get namespaces`

## View Resources
```powershell
# Get all resources in namespace
kubectl get all -n gearup

# Get specific resource types
kubectl get pods -n gearup
kubectl get deployments -n gearup
kubectl get services -n gearup
kubectl get configmaps -n gearup
kubectl get secrets -n gearup
kubectl get pvc -n gearup

# Get with detailed info
kubectl get pods -n gearup -o wide

# Watch resources in real-time
kubectl get pods -n gearup -w
```

## Pod Management
```powershell
# Get pod details
kubectl describe pod <pod-name> -n gearup

# View pod logs
kubectl logs <pod-name> -n gearup
kubectl logs <pod-name> -n gearup -f                    # Follow logs
kubectl logs <pod-name> -n gearup --tail=100           # Last 100 lines
kubectl logs <pod-name> -n gearup --previous            # Previous pod logs

# Execute command in pod
kubectl exec -it <pod-name> -n gearup -- /bin/bash
kubectl exec <pod-name> -n gearup -- env               # View environment variables

# Port forward to pod
kubectl port-forward pod/<pod-name> 8080:8080 -n gearup

# Delete pod (will be recreated by deployment)
kubectl delete pod <pod-name> -n gearup
```

## Service Management
```powershell
# View services
kubectl get svc -n gearup

# Get service details
kubectl describe svc <service-name> -n gearup

# Port forward to service
kubectl port-forward svc/backend 8080:8080 -n gearup
kubectl port-forward svc/frontend 80:80 -n gearup

# Get service IP
kubectl get svc <service-name> -n gearup -o jsonpath='{.spec.clusterIP}'
```

## Deployment Management
```powershell
# View deployments
kubectl get deployments -n gearup

# Get deployment details
kubectl describe deployment <deployment-name> -n gearup

# View deployment status
kubectl rollout status deployment/<deployment-name> -n gearup

# View rollout history
kubectl rollout history deployment/<deployment-name> -n gearup

# Restart deployment
kubectl rollout restart deployment/<deployment-name> -n gearup

# Scale deployment
kubectl scale deployment <deployment-name> --replicas=3 -n gearup

# Update image
kubectl set image deployment/<deployment-name> <container>=<new-image>:tag -n gearup
```

## Configuration Management
```powershell
# View ConfigMap
kubectl get configmap -n gearup
kubectl describe configmap <configmap-name> -n gearup
kubectl get configmap <configmap-name> -n gearup -o yaml

# View Secrets
kubectl get secrets -n gearup
kubectl describe secret <secret-name> -n gearup
kubectl get secret <secret-name> -n gearup -o yaml

# Edit resource
kubectl edit <resource-type> <resource-name> -n gearup
```

## Database Management
```powershell
# Connect to MySQL pod
$pod = kubectl get pods -n gearup -l app=mysql -o jsonpath='{.items[0].metadata.name}'
kubectl exec -it $pod -n gearup -- mysql -u gearup_user -p

# Inside MySQL:
# show databases;
# use gearup;
# show tables;
# select * from users;
```

## Debugging
```powershell
# Check events
kubectl get events -n gearup

# Describe pod for events
kubectl describe pod <pod-name> -n gearup

# Check resource usage
kubectl top nodes
kubectl top pods -n gearup

# Get pod YAML
kubectl get pod <pod-name> -n gearup -o yaml

# Check pod labels
kubectl get pods -n gearup --show-labels
```

## Cleanup
```powershell
# Delete specific resource
kubectl delete pod <pod-name> -n gearup
kubectl delete service <service-name> -n gearup
kubectl delete deployment <deployment-name> -n gearup

# Delete all in namespace
kubectl delete all -n gearup

# Delete namespace (removes everything)
kubectl delete namespace gearup

# Delete resource from file
kubectl delete -f 10-frontend-service.yaml
```

## Common Patterns
```powershell
# Stream logs from all pods with label
kubectl logs -n gearup -l app=backend -f

# Get logs from multiple containers
kubectl logs -n gearup <pod-name> -c <container-name>

# Apply all yamls in directory
kubectl apply -f k8s/

# Get JSON output
kubectl get pods -n gearup -o json

# Custom output
kubectl get pods -n gearup -o custom-columns=NAME:.metadata.name,STATUS:.status.phase
```
