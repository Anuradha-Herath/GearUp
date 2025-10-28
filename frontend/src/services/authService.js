const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const authService = {
  login: async (credentials) => {
    try {
      // Normalize payload to support backends expecting either `email` or `username`
      const payload = {
        username: credentials.username || credentials.email, // fallback for older backends
        email: credentials.email || credentials.username,
        password: credentials.password,
      };

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.text();
          errorMessage = errorData || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role || 'USER'
        }));
      }
      return data;
    } catch (error) {
      // If it's a network error, provide a more helpful message
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:8080');
      }
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Signup failed');
      }

      return await response.text();
    } catch (error) {
      // If it's a network error, provide a more helpful message
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:8080');
      }
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // You might want to validate the token with the backend
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;