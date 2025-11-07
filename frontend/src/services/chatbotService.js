const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const chatbotService = {
  sendMessage: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chatbot service error:', error);
      throw error;
    }
  },
};

export default chatbotService;