const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

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
};

export default adminService;