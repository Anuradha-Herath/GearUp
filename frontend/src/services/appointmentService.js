const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const appointmentService = {
  // Customer appointment endpoints
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

  createAppointment: async (appointmentData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/appointments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }
    return response.json();
  },

  updateAppointment: async (id, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete appointment');
    }
  },

  // Get available services
  getAvailableServices: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/appointments/services`, {
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

  // Get customer vehicles
  getMyVehicles: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/appointments/vehicles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }
    return response.json();
  },

  // Legacy methods for backward compatibility
  getAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    return response.json();
  },
};

export default appointmentService;