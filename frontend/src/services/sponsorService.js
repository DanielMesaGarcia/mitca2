import axios from 'axios';

const APII_URL = process.env.REACT_APP_API_URL;
const API_URL = APII_URL+'/sponsors';
const RACE_URL = APII_URL+'/races';
const USER_URL = APII_URL+'/users';

// aquí estaba originalmente la creación de la variable con la que accedía al dato que me interesaba

const getDataById = async (id) => {
  try {
    //aquí tenía que estar realmente, ya al cambiar de página se ejecuta este método, pero existía la posibilidad de
    //que la variable almacenada en el almacenamiento local siguiera con los datos de otra página y este método se
    //ejecutara con los datos de la variable de la página anterior en vez de la actual
    
    const response = await axios.get(`${RACE_URL}/${id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const getSponsors = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const addSponsor = async (sponsor) => {
  try {
    const response = await axios.post(API_URL, sponsor);
    return response.data;
  } catch (error) {
    throw new Error(`Error al agregar corredor: ${error.message}`);
  }
};

const updateSponsor = async (id, updatedSponsor) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedSponsor);
    return response.data;
  } catch (error) {
    throw new Error(`Error al actualizar corredor: ${error.message}`);
  }
};

const deleteSponsor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar corredor: ${error.message}`);
  }
};

const deleteSponsorCRUD = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/CRUD/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error al eliminar corredor: ${error.message}`);
  }
};

const addSponsorToRace = async (sponsorId, id) => {
  try {
    const response = await axios.patch(`http://localhost:3001/races/${id}`, {
      $push: { sponsors: sponsorId }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al agregar corredor a la carrera: ${error.message}`);
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

const deleteFromRace = async (id, userSponsorId) => {
  try {
    const response = await axios.delete(`${RACE_URL}/sponsor/${id}`, {
      data: { userSponsorId }, // Pasar el parámetro en el cuerpo de la solicitud
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


const RaceListService = {
  getDataById,
  addSponsor,
  updateSponsor,
  deleteSponsor,
  addSponsorToRace,
  getUserByToken,
  deleteFromRace,
  getSponsors,
  deleteSponsorCRUD
};

export default RaceListService;
