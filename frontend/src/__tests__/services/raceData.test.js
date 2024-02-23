import axios from 'axios';
import RaceListService from '../../services/raceDataService';

const API_URL = process.env.REACT_APP_API_URL;

const RACE_URL = API_URL+'/races';
const STATUS_URL = API_URL+'/status';

// Mock axios
jest.mock('axios');

describe('RaceListService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gets data by ID successfully', async () => {
    const id = '123';
    const mockData = { id: '123', name: 'Race 1' };
    axios.get.mockResolvedValueOnce({ data: mockData });

    const data = await RaceListService.getDataById(id);

    expect(data).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(`${RACE_URL}/${id}`);
  });

  it('deletes race successfully', async () => {
    const id = '123';
    const mockResponse = { success: true };
    axios.delete.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.deleteRace(id);

    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith(`${RACE_URL}/${id}`);
  });

  it('updates status successfully', async () => {
    const id = '123';
    const updatedStatus = { status: 'completed' };
    const mockResponse = { success: true };
    axios.put.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.updateStatus(id, updatedStatus);

    expect(response).toEqual(mockResponse);
    expect(axios.put).toHaveBeenCalledWith(`${STATUS_URL}/${id}`, updatedStatus);
  });

});
