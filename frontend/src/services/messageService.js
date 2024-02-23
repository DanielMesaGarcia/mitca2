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
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  deleteMessage: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/messages/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar mensaje: ${error.message}`);
    }
  },

  updateMessage: async (id, newMessage) => {
    try {
      const response = await axios.put(`${API_URL}/messages/${id}`, { message: newMessage });
      return response.data;
    } catch (error) {
      throw new Error(`Error al actualizar mensaje: ${error.message}`);
    }
  }
};

export default messageService;
