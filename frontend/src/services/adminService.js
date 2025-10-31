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
};

export default adminService;