import axios from 'axios';
import RaceListService from '../../services/runnerService';

const APII_URL = process.env.REACT_APP_API_URL;
const API_URL = APII_URL+'/runners';
const RACE_URL = APII_URL+'/races';

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

  it('gets runners successfully', async () => {
    const mockRunners = [{ id: 1, name: 'Runner 1' }, { id: 2, name: 'Runner 2' }];
    axios.get.mockResolvedValueOnce({ data: mockRunners });

    const runners = await RaceListService.getRunners();

    expect(runners).toEqual(mockRunners);
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}`);
  });

  it('adds a runner successfully', async () => {
    const runner = { name: 'New Runner' };
    const mockResponse = { success: true };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.addRunner(runner);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(API_URL, runner);
  });

  it('updates a runner successfully', async () => {
    const id = '123';
    const updatedRunner = { name: 'Updated Runner' };
    const mockResponse = { success: true };
    axios.put.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.updateRunner(id, updatedRunner);

    expect(response).toEqual(mockResponse);
    expect(axios.put).toHaveBeenCalledWith(`${API_URL}/${id}`, updatedRunner);
  });

  it('deletes a runner successfully', async () => {
    const id = '123';
    const mockResponse = { success: true };
    axios.delete.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.deleteRunner(id);

    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith(`${API_URL}/${id}`);
  });

  // Test other methods similarly
});
