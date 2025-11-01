const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const serviceService = {
  getAllServices: async () => {
    const token = localStorage.getItem('token');
    console.log('Fetching services from:', `${API_BASE_URL}/customer/appointments/services`);
    
    const response = await fetch(`${API_BASE_URL}/customer/appointments/services`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Services response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to fetch services');
    }
    return response.json();
  },

  getServiceById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/appointments/services/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }
    return response.json();
  }
};

export default serviceService;