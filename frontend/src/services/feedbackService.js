const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const feedbackService = {
  // Submit feedback for an appointment
  submitFeedback: async (appointmentId, rating, feedbackText) => {
    const response = await fetch(`${API_BASE_URL}/customer/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        appointmentId,
        rating,
        feedbackText
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit feedback');
    }

    return response.json();
  },

  // Get completed appointments for feedback
  getCompletedAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/feedback/completed-appointments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch completed appointments');
    }

    return response.json();
  },

  // Get feedback for a specific appointment
  getFeedbackByAppointment: async (appointmentId) => {
    const response = await fetch(`${API_BASE_URL}/customer/feedback/appointment/${appointmentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    return response.json();
  },

  // Check if feedback exists for an appointment
  checkFeedbackExists: async (appointmentId) => {
    const response = await fetch(`${API_BASE_URL}/customer/feedback/exists/${appointmentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check feedback existence');
    }

    return response.json();
  },

  // Get all feedback by current customer
  getMyFeedback: async () => {
    const response = await fetch(`${API_BASE_URL}/customer/feedback/my-feedback`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch my feedback');
    }

    return response.json();
  },

  // Update existing feedback
  updateFeedback: async (feedbackId, rating, feedbackText) => {
    const response = await fetch(`${API_BASE_URL}/customer/feedback/${feedbackId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        rating,
        feedbackText
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update feedback');
    }

    return response.json();
  },

  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    const response = await fetch(`${API_BASE_URL}/customer/feedback/${feedbackId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete feedback');
    }

    return response.json();
  }
};

export default feedbackService;