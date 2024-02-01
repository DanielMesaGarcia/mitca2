import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const RACE_URL = API_URL+'/races';
const STATUS_URL = API_URL+'/status';

const getDataById = async (id) => {
    try {
      const response = await axios.get(`${RACE_URL}/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
};

const deleteRace = async (id) => {
  try {
    const response = await axios.delete(`${RACE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar carrera: ${error.message}`);
  }
};

const updateStatus = async (id, updatedStatus) => {
  try {
    const response = await axios.put(`${STATUS_URL}/${id}`, updatedStatus);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar corredor: ${error.message}`);
  }
};

const RaceListService = {
  getDataById,
  deleteRace,
  updateStatus,
};

export default RaceListService;
