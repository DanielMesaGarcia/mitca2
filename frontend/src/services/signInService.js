import axios from 'axios';
const APII_URL = process.env.REACT_APP_API_URL;
const API_URL = APII_URL+'/users'; // Replace with your actual API URL

const signInService = {
  getUserById: (userId) => {
    return axios.get(`${API_URL}/${userId}`).then((response) => response.data);
  },

  createUser: (userData) => {
    const mappedData = { ...userData, _id: userData.email };
    delete mappedData.email; // Remove the 'email' key from the mapped data

    return axios.post(API_URL, mappedData).then((response) => response.data);
  },

  login: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCompany: async (userData, companyData) => {
    try {
      const mappedData = { ...userData, _id: userData.email };
      delete mappedData.email;
      const response = await axios.post(`${API_URL}/companyaccount`, {mappedData, companyData});
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default signInService;
