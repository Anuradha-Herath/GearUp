import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on role
  const roleRedirects = {
    'ADMIN': '/admin/dashboard',
    'EMPLOYEE': '/employee/dashboard',
    'CUSTOMER': '/customer/dashboard',
    'USER': '/customer/dashboard' // fallback for USER role
  };
  
  const userRole = user?.role?.toUpperCase();
  const redirectPath = roleRedirects[userRole] || '/customer/dashboard';
  
  return <Navigate to={redirectPath} replace />;
};

export default DashboardRedirect;