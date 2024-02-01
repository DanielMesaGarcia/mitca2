import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // Replace with your API base URL

const UserService = {
  login: async (userData) => {
    try {
        
      const response = await axios.post(`${API_URL}/users/login`, userData);
  
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
