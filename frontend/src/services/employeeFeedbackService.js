const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const employeeFeedbackService = {
  // Get all feedback for employees to view
  getAllFeedback: async () => {
    const response = await fetch(`${API_BASE_URL}/employee/feedback/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all feedback');
    }

    return response.json();
  },

  // Get feedback statistics
  getFeedbackStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/employee/feedback/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback statistics');
    }

    return response.json();
  },

  // Get feedback for a specific service
  getFeedbackByService: async (serviceId) => {
    const response = await fetch(`${API_BASE_URL}/employee/feedback/service/${serviceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch service feedback');
    }

    return response.json();
  },

  // Get feedback by rating
  getFeedbackByRating: async (rating) => {
    const response = await fetch(`${API_BASE_URL}/employee/feedback/rating/${rating}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback by rating');
    }

    return response.json();
  },

  // Get customer details by ID
  getCustomerById: async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/users/${customerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer details');
    }

    return response.json();
  },

  // Get appointment details by ID
  getAppointmentById: async (appointmentId) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch appointment details');
    }

    return response.json();
  },

  // Get enriched feedback with customer and appointment details
  getEnrichedFeedback: async () => {
    try {
      // First get all feedback
      const feedbacks = await employeeFeedbackService.getAllFeedback();
      
      // Enrich each feedback with customer and appointment details
      const enrichedFeedbacks = await Promise.all(
        feedbacks.map(async (feedback) => {
          try {
            // Fetch customer details
            const customer = await employeeFeedbackService.getCustomerById(feedback.customerId);
            
            // Fetch appointment details
            const appointment = await employeeFeedbackService.getAppointmentById(feedback.appointmentId);
            
            return {
              ...feedback,
              customerName: customer.username || customer.name || 'Unknown Customer',
              customerEmail: customer.email,
              vehicle: `${appointment.vehicle?.company || ''} ${appointment.vehicle?.model || ''} ${appointment.vehicle?.year || ''} (${appointment.vehicle?.vehicleNumber || 'N/A'})`.trim(),
              serviceDate: appointment.date,
              serviceType: appointment.service?.title || 'Unknown Service',
              appointmentDetails: appointment
            };
          } catch (error) {
            console.error(`Error enriching feedback ${feedback.id}:`, error);
            // Return feedback with fallback data if enrichment fails
            return {
              ...feedback,
              customerName: 'Unknown Customer',
              vehicle: 'Unknown Vehicle',
              serviceDate: 'Unknown Date',
              serviceType: 'Unknown Service'
            };
          }
        })
      );

      return enrichedFeedbacks;
    } catch (error) {
      console.error('Error getting enriched feedback:', error);
      throw error;
    }
  }
};

export default employeeFeedbackService;