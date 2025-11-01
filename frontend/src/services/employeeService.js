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
    console.log('Fetching confirmed appointments from:', `${API_BASE_URL}/employee/appointments/confirmed`);
    
    const response = await fetch(`${API_BASE_URL}/employee/appointments/confirmed`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Confirmed appointments response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch confirmed appointments: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Confirmed appointments received:', result);
    return result;
  },

  // Updated getAllAppointments method (was duplicated)
  getAllAppointmentsForManagement: async () => {
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

  updateAppointmentStatus: async (appointmentId, status) => {
    console.log(`Updating appointment ${appointmentId} status to ${status}`);
    console.log('Update URL:', `${API_BASE_URL}/employee/appointments/${appointmentId}/status`);
    
    const response = await fetch(`${API_BASE_URL}/employee/appointments/${appointmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    
    console.log('Update status response:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error updating status:', errorText);
      throw new Error(`Failed to update appointment status: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Status update result:', result);
    return result;
  }
};

export default employeeService;