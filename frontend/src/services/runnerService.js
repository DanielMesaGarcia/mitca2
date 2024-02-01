import axios from 'axios';

const APII_URL = process.env.REACT_APP_API_URL;
const API_URL = APII_URL+'/runners';
const RACE_URL = APII_URL+'/races';
const USER_URL = APII_URL+'/users';
// aquí estaba originalmente la creación de la variable con la que accedía al dato que me interesaba

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

const getRunners = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const getUserByToken = async (token) => {
  try {
    const response = await axios.post(`${USER_URL}/token`, {token});
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const addRunner = async (runner) => {
  try {
    const response = await axios.post(API_URL, runner);
    return response.data;
  } catch (error) {
    throw new Error(`Error al agregar corredor: ${error.message}`);
  }
};

const updateRunner = async (id, updatedRunner) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedRunner);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar corredor: ${error.message}`);
  }
};

const deleteRunner = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar corredor: ${error.message}`);
  }
};

const addRunnerToRace = async (runnerId, id) => {
  try {
    const response = await axios.patch(`http://localhost:3001/races/${id}`, {
      $push: { runners: runnerId }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al agregar corredor a la carrera: ${error.message}`);
  }
};

const transferRunners = async (runnerBuffer,starter, id) => {
  try {
    const response = await axios.patch(`http://localhost:3001/races`, { runnerBuffer,starter, id });
    return response.data;
  } catch (error) {
    throw new Error(`Error al agregar corredor a la carrera: ${error.message}`);
  }
};

const addRunnerToUser = async (runnerId, id) => {
  try {
    const response = await axios.patch(`${USER_URL}/${id}`, {
      $push: { runners: runnerId }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al agregar corredor a la carrera: ${error.message}`);
  }
};

const getDataByUser = async (id) => {
  try {
    const response = await axios.get(`${USER_URL}/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const RaceListService = {
  getDataById,
  addRunner,
  updateRunner,
  deleteRunner,
  addRunnerToRace,
  getUserByToken,
  transferRunners,
  getDataByUser,
  addRunnerToUser,
  getRunners
};

export default RaceListService;
