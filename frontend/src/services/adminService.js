const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const adminService = {
  getWeeklyAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/weekly-appointments`);
    return response.json();
  },

  getSuccessRate: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/success-rate`);
    return response.json();
  },

  getFeedbackRating: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/feedback-rating`);
    return response.json();
  },

  getConfirmAppointmentRate: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/confirm-appointment-rate`);
    return response.json();
  },

  getTotalCustomers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/total-customers`);
    return response.json();
  },

  getNewCustomers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/new-customers`);
    return response.json();
  },

  getEmployeeCount: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/employee-count`);
    return response.json();
  },

  // Service Management
  getAllServices: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/services`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return response.json();
  },

  getServiceById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }
    return response.json();
  },

  createService: async (serviceData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/services`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });
    if (!response.ok) {
      throw new Error('Failed to create service');
    }
    return response.json();
  },

  updateService: async (id, serviceData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serviceData)
    });
    if (!response.ok) {
      throw new Error('Failed to update service');
    }
    return response.json();
  },

  deleteService: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete service');
    }
    return response.status === 204;
  },

  // Employee Management
  getAllEmployees: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/employees`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    return response.json();
  },

  getEmployeeById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/employees/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch employee');
    }
    return response.json();
  },

  createEmployee: async (employeeData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/employees`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create employee');
    }
    return response.json();
  },

  updateEmployeeStatus: async (id, isActive) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/employees/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  updateEmployee: async (id, employeeData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update employee');
    }
    return response.json();
  },

  deleteEmployee: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/employees/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete employee');
    }
    return response.json();
  },
};

export default adminService;