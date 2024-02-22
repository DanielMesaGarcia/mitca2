import axios from 'axios';
import RaceListService from '../services/raceListService.js';

// Mock axios requests
jest.mock('axios');

describe('RaceListService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches races successfully', async () => {
    const mockData = [{ id: 1, name: 'Race 1' }, { id: 2, name: 'Race 2' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const races = await RaceListService.getRaces();

    expect(races).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/races'));
  });

  it('throws an error when fetching races fails', async () => {
    const errorMessage = 'Failed to fetch races';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(RaceListService.getRaces()).rejects.toThrow(errorMessage);
  });

});
