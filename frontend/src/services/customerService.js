const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const customerService = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/customers/profile`);
    return response.json();
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/customers/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Appointment Management
  getMyAppointments: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/appointments`, {
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
    const response = await fetch(`${API_BASE_URL}/customer/appointments/${id}`, {
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

  createAppointment: async (appointmentData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }
    return response.json();
  },

  updateAppointment: async (id, appointmentData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    });
    if (!response.ok) {
      throw new Error('Failed to update appointment');
    }
    return response.json();
  },

  deleteAppointment: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete appointment');
    }
    return response.status === 204;
  },

  // Service Listing
  getAllServices: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/services`);
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return response.json();
  },

  getServiceById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/customer/services/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }
    return response.json();
  },
};

export default customerService;