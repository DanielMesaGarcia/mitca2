import axios from 'axios';
import RaceListService from '../../services/raceListService';

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

  it('creates a race successfully', async () => {
    const mockRaceData = {
      _id: 1,
      eventDate: '2024-02-22',
      city: 'New York',
      length: '10k',
    };
    const mockImage = new File(['image content'], 'race_image.jpg', { type: 'image/jpeg' });

    axios.post.mockResolvedValueOnce({ data: mockRaceData });

    const createdRace = await RaceListService.createRace(mockImage, mockRaceData);

    expect(createdRace).toEqual(mockRaceData);

    const formData = new FormData();
    formData.append('filename', mockImage);
    formData.append('_id', mockRaceData._id);
    formData.append('eventDate', mockRaceData.eventDate);
    formData.append('city', mockRaceData.city);
    formData.append('length', mockRaceData.length);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/races'), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  });

  it('throws an error when creating a race fails', async () => {
    const mockRaceData = {
      _id: 1,
      eventDate: '2024-02-22',
      city: 'New York',
      length: '10k',
    };
    const mockImage = new File(['image content'], 'race_image.jpg', { type: 'image/jpeg' });
    const errorMessage = 'Failed to create race';

    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(RaceListService.createRace(mockImage, mockRaceData)).rejects.toThrow(errorMessage);
  });
});
