import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirect = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to their appropriate dashboard
  if (isAuthenticated && user) {
    const roleRedirects = {
      'ADMIN': '/admin/dashboard',
      'EMPLOYEE': '/employee/dashboard',
      'CUSTOMER': '/customer/dashboard',
      'USER': '/customer/dashboard' // fallback for USER role
    };
    
    const userRole = user?.role?.toUpperCase();
    const redirectPath = roleRedirects[userRole] || '/customer/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  // If not authenticated, show the children (login/signup page)
  return children;
};

export default AuthRedirect;