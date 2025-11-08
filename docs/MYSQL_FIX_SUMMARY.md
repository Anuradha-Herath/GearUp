# MySQL Kubernetes Fix - Summary

## Root Cause Analysis

### Issue
MySQL pod was in **CrashLoopBackOff** status with the error:
```
[ERROR] setgid: Operation not permitted
[ERROR] Aborting
```

### Root Cause
The security context in the MySQL deployment had incompatible settings:
- `allowPrivilegeEscalation: true` (allowing privilege escalation)
- `capabilities: drop: ALL` (dropping ALL Linux capabilities)

This combination causes MySQL to fail when trying to change its process group (setgid), which is required for the MySQL daemon initialization process, especially on Docker Desktop with Kubernetes.

## Solution Applied

### Changes Made to `5-mysql-deployment.yaml`

Updated the `securityContext` from:
```yaml
securityContext:
  runAsNonRoot: false
  runAsUser: 0
  allowPrivilegeEscalation: true
  capabilities:
    drop:
    - ALL
```

To:
```yaml
securityContext:
  runAsNonRoot: false
  runAsUser: 0
  allowPrivilegeEscalation: false      # Disabled privilege escalation
  capabilities:
    drop:
    - NET_RAW
    - ALL
    add:                               # Added necessary capabilities
    - CHOWN
    - DAC_OVERRIDE
    - SETGID        # Required for MySQL to change group
    - SETUID
    - SETFCAP
    - SETPCAP
    - NET_BIND_SERVICE
    - SYS_CHROOT
```

### Why This Works
1. **SETGID capability**: Allows MySQL to change process group (required for daemon initialization)
2. **Other capabilities**: Provide MySQL with the minimum necessary permissions to:
   - Change file ownership (CHOWN)
   - Override permission checks (DAC_OVERRIDE)
   - Bind to network ports (NET_BIND_SERVICE)
   - Manage file capabilities (SETFCAP, SETPCAP)
   - Use chroot (SYS_CHROOT)

3. **Disabled privilege escalation**: More secure, as MySQL doesn't need to escalate privileges further

## Deployment Steps Taken

1. ✅ Deleted the broken MySQL deployment
2. ✅ Applied the fixed configuration
3. ✅ Verified MySQL pod is now Running (1/1 Ready)
4. ✅ Confirmed no error messages in logs

## Current Status

**MySQL Pod Status**: ✅ **RUNNING**
```
mysql-f5cccb4db-vhjnr       1/1     Running        0               14s
```

**Last Log Entry**: `mysqld: ready for connections.`

## Verification

You can verify MySQL is working with:
```bash
# Check pod status
kubectl -n gearup get pods | grep mysql

# Check logs
kubectl -n gearup logs -f <mysql-pod-name>

# Test database connectivity
kubectl -n gearup exec -it <mysql-pod-name> -- mysql -u root -p<password> -e "SHOW DATABASES;"
```

## Notes
- The fix maintains the required security while allowing MySQL to function properly
- This configuration is suitable for both development and production environments
- The MySQL image runs as root (user 0) as required by the official MySQL Docker image
