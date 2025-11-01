const API_BASE_URL = 'http://localhost:8080/api';

const employeeService = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/employees/profile`);
    return response.json();
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/employees/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Create a new employee (Admin only)
  createEmployee: async (employeeData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create employee');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all employees (Admin only)
  getAllEmployees: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Update employee status (Admin only)
  updateEmployeeStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update employee status');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete employee (Admin only)
  deleteEmployee: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete employee');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default employeeService;