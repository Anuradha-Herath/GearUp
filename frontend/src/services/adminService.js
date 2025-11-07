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

  // Customer Management
  getAllCustomers: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/customers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    return response.json();
  },

  getCustomerById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch customer');
    }
    return response.json();
  },

  updateCustomerStatus: async (id, isActive) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/customers/${id}/status`, {
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

  updateCustomer: async (id, customerData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update customer');
    }
    return response.json();
  },

  deleteCustomer: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete customer');
    }
    return response.json();
  },

  // Appointment Management
  getAllAppointments: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/appointments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return response.json();
  },

  getAppointmentById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/appointments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch appointment');
    }
    return response.json();
  },

  getAppointmentsByStatus: async (status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/appointments/status/${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch appointments by status');
    }
    return response.json();
  },

  updateAppointmentStatus: async (id, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/appointments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      throw new Error('Failed to update appointment status');
    }
    return response.json();
  },

  getAppointmentStatistics: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/appointments/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch appointment statistics');
    }
    return response.json();
  },

  // Analytics endpoints
  getDashboardOverview: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/analytics/overview`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard overview');
    }
    return response.json();
  },

  getAppointmentStatusDistribution: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/analytics/appointments/status-distribution`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch appointment status distribution');
    }
    return response.json();
  },

  getDailyAppointmentTrends: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/analytics/appointments/daily-trends`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch daily appointment trends');
    }
    return response.json();
  },

  getMonthlyAppointmentTrends: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/analytics/appointments/monthly-trends`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch monthly appointment trends');
    }
    return response.json();
  },

  getServicePopularity: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/analytics/services/popularity`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch service popularity');
    }
    return response.json();
  },

  getCustomerActivity: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/analytics/customers/activity`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch customer activity');
    }
    return response.json();
  },

  getDailyAppointmentsCurrentMonth: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/analytics/appointments/daily-current-month`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch daily appointments');
    }
    return response.json();
  },

  getRevenueByService: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/analytics/revenue/by-service`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch revenue by service');
    }
    return response.json();
  },
};

export default adminService;