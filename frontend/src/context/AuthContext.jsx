import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // First try local validation (fast)
        const localUser = authService.getCurrentUser();
        
        if (localUser) {
          // If we have a local user, set it immediately for fast loading
          setUser(localUser);
          
          // Then validate with server in background
          try {
            const validatedUser = await authService.validateCurrentUser();
            if (validatedUser) {
              setUser(validatedUser);
            } else {
              // Server validation failed, clear user
              setUser(null);
            }
          } catch (error) {
            // Server validation failed but local token is valid, keep local user
            console.warn('Server validation failed, keeping local user:', error);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const userData = await authService.login(credentials);
    setUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role || 'USER'
    });
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};