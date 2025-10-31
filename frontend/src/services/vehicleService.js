const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const vehicleService = {
  getMyVehicles: async () => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
    console.log('Fetching vehicles from:', `${API_BASE_URL}/customer/vehicles`);
    
    const response = await fetch(`${API_BASE_URL}/customer/vehicles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to fetch vehicles');
    }
    return response.json();
  },

  getVehicleById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/vehicles/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch vehicle');
    }
    return response.json();
  },

  createVehicle: async (vehicleData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/vehicles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicleData)
    });
    if (!response.ok) {
      throw new Error('Failed to create vehicle');
    }
    return response.json();
  },

  updateVehicle: async (id, vehicleData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/vehicles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicleData)
    });
    if (!response.ok) {
      throw new Error('Failed to update vehicle');
    }
    return response.json();
  },

  deleteVehicle: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/customer/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete vehicle');
    }
    return response.status === 204;
  },
};

export default vehicleService;
