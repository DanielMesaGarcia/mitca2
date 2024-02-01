import axios from 'axios';
const APII_URL = process.env.REACT_APP_API_URL;
const API_URL = APII_URL+'/users';
const SPONSOR_URL = APII_URL+'/sponsors';

// aquí estaba originalmente la creación de la variable con la que accedía al dato que me interesaba

const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const getUsers = async () => {
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
      const response = await axios.post(`${API_URL}/token`, {token});
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

const addUser = async (user) => {
  try {
    const response = await axios.post(API_URL, user);
    return response.data;
  } catch (error) {
    throw new Error(`Error al agregar corredor: ${error.message}`);
  }
};

const updateUser = async (id, updatedUser) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedUser);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar corredor: ${error.message}`);
  }
};

const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar corredor: ${error.message}`);
  }
};

const addUserToRace = async (userId, id) => {
  try {
    const response = await axios.patch(`http://localhost:3001/races/${id}`, {
      $push: { users: userId }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al agregar corredor a la carrera: ${error.message}`);
  }
};

const updateSponsor = async (id, updatedSponsor) => {
  try {
    const response = await axios.put(`${SPONSOR_URL}/${id}`, updatedSponsor);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar corredor: ${error.message}`);
  }
};


const UserService = {
  getUserById,
  getUserByToken,
  addUser,
  updateUser,
  deleteUser,
  addUserToRace,
  updateSponsor,
  getUsers
};

export default UserService;
