import React from 'react';
import { useAuth } from '../context/AuthContext';
import usePermissions from '../hooks/usePermissions';

const RoleGuard = ({ 
  children, 
  requiredRole, 
  requiredRoles, 
  fallback = null,
  allowedRoles,
  adminOnly = false,
  employeeOnly = false,
  customerOnly = false 
}) => {
  const { isAuthenticated } = useAuth();
  const { hasRole, hasAnyRole, isAdmin, isEmployee, isCustomer } = usePermissions();

  // If not authenticated, return fallback
  if (!isAuthenticated) {
    return fallback;
  }

  // Check for specific role requirements
  if (adminOnly && !isAdmin()) return fallback;
  if (employeeOnly && !isEmployee()) return fallback;
  if (customerOnly && !isCustomer()) return fallback;

  // Check for single required role
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback;
  }

  // Check for multiple required roles (user must have ALL)
  if (requiredRoles && !requiredRoles.every(role => hasRole(role))) {
    return fallback;
  }

  // Check for allowed roles (user must have at least ONE)
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return fallback;
  }

  // All checks passed, render children
  return children;
};

export default RoleGuard;