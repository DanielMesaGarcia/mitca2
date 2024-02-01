import axios from 'axios';

const APII_URL = process.env.REACT_APP_API_URL;
const API_URL = APII_URL+'/races';
const API_URL_route = APII_URL+'/routes';
const API_URL_status = APII_URL+'/status';
const getRaces = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching races: ${error.message}`);
  }
};
const createRace = async (image, raceData) => {
  try {
    const formData = new FormData();
    formData.append('filename', image);
    formData.append('_id', raceData._id);
    formData.append('eventDate', raceData.eventDate);
    formData.append('city', raceData.city);
    formData.append('length', raceData.length);

    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error creating race: ${error.message}`);
  }
};

const createRoute = async (routeData) => {
  try {
    const response = await axios.post(API_URL_route, routeData);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating race: ${error.message}`);
  }
};

const createStatus = async (statusData) => {
  try {
    const response = await axios.post(API_URL_status, statusData);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating race: ${error.message}`);
  }
};

const updateRace = async (raceId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${raceId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating race: ${error.message}`);
  }
};

const deleteRace = async (raceId) => {
  try {
    const response = await axios.delete(`${API_URL}/${raceId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error deleting race: ${error.message}`);
  }
};

const RaceListService = {
  getRaces,
  createRace,
  updateRace,
  deleteRace,
  createRoute,
  createStatus,
};


export default RaceListService;
