import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user's actual role
    const roleRedirects = {
      'ADMIN': '/admin/dashboard',
      'EMPLOYEE': '/employee/dashboard',
      'CUSTOMER': '/customer/dashboard',
      'USER': '/customer/dashboard' // fallback for USER role
    };
    
    const userRole = user?.role?.toUpperCase();
    const redirectPath = roleRedirects[userRole] || '/';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;