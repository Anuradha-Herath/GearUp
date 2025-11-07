import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role) => {
    if (!isAuthenticated || !user) return false;
    return user.role?.toUpperCase() === role?.toUpperCase();
  };

  const hasAnyRole = (roles) => {
    if (!isAuthenticated || !user) return false;
    return roles.some(role => hasRole(role));
  };

  const isAdmin = () => hasRole('ADMIN');
  const isEmployee = () => hasRole('EMPLOYEE');
  const isCustomer = () => hasRole('CUSTOMER') || hasRole('USER');

  const canAccessAdminRoutes = () => isAdmin();
  const canAccessEmployeeRoutes = () => isEmployee() || isAdmin();
  const canAccessCustomerRoutes = () => isCustomer() || isEmployee() || isAdmin();

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isEmployee,
    isCustomer,
    canAccessAdminRoutes,
    canAccessEmployeeRoutes,
    canAccessCustomerRoutes,
    userRole: user?.role
  };
};

export default usePermissions;