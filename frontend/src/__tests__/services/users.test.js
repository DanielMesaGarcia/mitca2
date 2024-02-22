import axios from 'axios';
import UserService from '../../services/userService';

// Mock axios
jest.mock('axios');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gets a user by ID successfully', async () => {
    const id = '123';
    const mockData = { id: '123', name: 'John Doe' };
    axios.get.mockResolvedValueOnce({ data: mockData });

    const user = await UserService.getUserById(id);

    expect(user).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(`${UserService.API_URL}/${id}`);
  });

  it('gets users successfully', async () => {
    const mockUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
    axios.get.mockResolvedValueOnce({ data: mockUsers });

    const users = await UserService.getUsers();

    expect(users).toEqual(mockUsers);
    expect(axios.get).toHaveBeenCalledWith(UserService.API_URL);
  });

  it('adds a user successfully', async () => {
    const user = { name: 'New User' };
    const mockResponse = { success: true };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await UserService.addUser(user);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(UserService.API_URL, user);
  });

  it('updates a user successfully', async () => {
    const id = '123';
    const updatedUser = { name: 'Updated User' };
    const mockResponse = { success: true };
    axios.put.mockResolvedValueOnce({ data: mockResponse });

    const response = await UserService.updateUser(id, updatedUser);

    expect(response).toEqual(mockResponse);
    expect(axios.put).toHaveBeenCalledWith(`${UserService.API_URL}/${id}`, updatedUser);
  });

  it('deletes a user successfully', async () => {
    const id = '123';
    const mockResponse = { success: true };
    axios.delete.mockResolvedValueOnce({ data: mockResponse });

    const response = await UserService.deleteUser(id);

    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith(`${UserService.API_URL}/${id}`);
  });

  it('adds a user to a race successfully', async () => {
    const userId = '123';
    const raceId = '456';
    const mockResponse = { success: true };
    axios.patch.mockResolvedValueOnce({ data: mockResponse });

    const response = await UserService.addUserToRace(userId, raceId);

    expect(response).toEqual(mockResponse);
    expect(axios.patch).toHaveBeenCalledWith(`https://localhost:3001/races/${raceId}`, {
      $push: { users: userId }
    });
  });

  it('updates a sponsor successfully', async () => {
    const id = '123';
    const updatedSponsor = { name: 'Updated Sponsor' };
    const mockResponse = { success: true };
    axios.put.mockResolvedValueOnce({ data: mockResponse });

    const response = await UserService.updateSponsor(id, updatedSponsor);

    expect(response).toEqual(mockResponse);
    expect(axios.put).toHaveBeenCalledWith(`${UserService.SPONSOR_URL}/${id}`, updatedSponsor);
  });

  it('gets a user by token successfully', async () => {
    const token = '123';
    const mockData = { id: '456', name: 'John Doe' };
    axios.post.mockResolvedValueOnce({ data: mockData });

    const user = await UserService.getUserByToken(token);

    expect(user).toEqual(mockData);
    expect(axios.post).toHaveBeenCalledWith(`${UserService.API_URL}/token`, { token });
  });
});
