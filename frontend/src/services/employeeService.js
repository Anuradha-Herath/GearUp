const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

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

  // Appointment management methods
  getPendingAppointments: async () => {
    console.log('Fetching from:', `${API_BASE_URL}/employee/appointments/pending`);
    
    const response = await fetch(`${API_BASE_URL}/employee/appointments/pending`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch pending appointments: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Pending appointments received:', result);
    return result;
  },

  // Debug method to get all appointments
  getAllAppointments: async () => {
    console.log('Fetching all appointments from:', `${API_BASE_URL}/employee/appointments`);
    
    const response = await fetch(`${API_BASE_URL}/employee/appointments`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('All appointments response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch all appointments: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('All appointments received:', result);
    return result;
  },

  getConfirmedAppointments: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/employee/appointments/confirmed`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch confirmed appointments');
    }
    return response.json();
  },

  getAllAppointments: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/employee/appointments`, {
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

  updateAppointmentStatus: async (appointmentId, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/employee/appointments/${appointmentId}/status`, {
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
  }
};

export default employeeService;