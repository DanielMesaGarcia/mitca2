// messageService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const messageService = {
  getAllMessages: async () => {
    try {
      const response = await axios.get(`${API_URL}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  sendMessage: async (messageData) => {
    try {
      const response = await axios.post(`${API_URL}/messages`, messageData);
      console.log(`${API_URL}/messages`)
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  deleteRace: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/messages/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar mensaje: ${error.message}`);
    }
  }
};

export default messageService;
