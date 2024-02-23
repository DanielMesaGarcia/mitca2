import axios from 'axios';
import RaceListService from '../../services/sponsorService';

// Mock axios
jest.mock('axios');

describe('RaceListService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gets data by ID successfully', async () => {
    const id = '123';
    const mockData = { id: '123', name: 'Race' };
    axios.get.mockResolvedValueOnce({ data: mockData });

    const data = await RaceListService.getDataById(id);

    expect(data).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(`${RaceListService.RACE_URL}/${id}`);
  });

  it('gets sponsors successfully', async () => {
    const mockSponsors = [{ id: 1, name: 'Sponsor 1' }, { id: 2, name: 'Sponsor 2' }];
    axios.get.mockResolvedValueOnce({ data: mockSponsors });

    const sponsors = await RaceListService.getSponsors();

    expect(sponsors).toEqual(mockSponsors);
    expect(axios.get).toHaveBeenCalledWith(RaceListService.API_URL);
  });

  it('adds a sponsor successfully', async () => {
    const sponsor = { name: 'New Sponsor' };
    const mockResponse = { success: true };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.addSponsor(sponsor);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(RaceListService.API_URL, sponsor);
  });

  it('updates a sponsor successfully', async () => {
    const id = '123';
    const updatedSponsor = { name: 'Updated Sponsor' };
    const mockResponse = { success: true };
    axios.put.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.updateSponsor(id, updatedSponsor);

    expect(response).toEqual(mockResponse);
    expect(axios.put).toHaveBeenCalledWith(`${RaceListService.API_URL}/${id}`, updatedSponsor);
  });

  it('deletes a sponsor successfully', async () => {
    const id = '123';
    const mockResponse = { success: true };
    axios.delete.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.deleteSponsor(id);

    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith(`${RaceListService.API_URL}/${id}`);
  });

  it('deletes a sponsor using CRUD endpoint successfully', async () => {
    const id = '123';
    const mockResponse = { success: true };
    axios.delete.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.deleteSponsorCRUD(id);

    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith(`${RaceListService.API_URL}/CRUD/${id}`);
  });

  it('adds a sponsor to a race successfully', async () => {
    const sponsorId = '123';
    const raceId = '456';
    const mockResponse = { success: true };
    axios.patch.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.addSponsorToRace(sponsorId, raceId);

    expect(response).toEqual(mockResponse);
    expect(axios.patch).toHaveBeenCalledWith(`https://localhost:3001/races/${raceId}`, {
      $push: { sponsors: sponsorId }
    });
  });

  it('gets a user by token successfully', async () => {
    const token = '123';
    const mockData = { id: '456', name: 'John Doe' };
    axios.post.mockResolvedValueOnce({ data: mockData });

    const user = await RaceListService.getUserByToken(token);

    expect(user).toEqual(mockData);
    expect(axios.post).toHaveBeenCalledWith(`${RaceListService.USER_URL}/token`, { token });
  });

  it('deletes a sponsor from a race successfully', async () => {
    const raceId = '123';
    const userSponsorId = '456';
    const mockResponse = { success: true };
    axios.delete.mockResolvedValueOnce({ data: mockResponse });

    const response = await RaceListService.deleteFromRace(raceId, userSponsorId);

    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith(`${RaceListService.RACE_URL}/sponsor/${raceId}`, {
      data: { userSponsorId }
    });
  });
});
