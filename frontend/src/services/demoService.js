import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const DEMO_URL = API_URL+'/demo/crearDemoData';

const createDemoData = async () => {
    try {
      const response = await axios.get(`${DEMO_URL}`);
      return response;
    } catch (error) {
      console.error('Error creating demo:', error);
      throw error;
    }
};

const DemoService = {
  createDemoData,
};

export default DemoService;
