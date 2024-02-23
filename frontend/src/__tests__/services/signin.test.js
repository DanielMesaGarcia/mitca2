import axios from 'axios';
import signInService from '../../services/signInService';

const API_URL = '//localhost:3001/users';

// Mock axios
jest.mock('axios');

describe('signInService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gets user by ID successfully', async () => {
    const userId = '123';
    const mockUserData = { id: userId, name: 'John Doe' };
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    const user = await signInService.getUserById(userId);

    expect(user).toEqual(mockUserData);
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${userId}`);
  });

  it('creates a user successfully', async () => {
    const userData = { email: 'test@example.com', name: 'John Doe' };
    const mappedData = { ...userData, _id: userData.email };
    delete mappedData.email;
    const mockResponse = { success: true };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await signInService.createUser(userData);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(API_URL, mappedData);
  });

  it('logs in successfully', async () => {
    const userData = { email: 'test@example.com', password: 'password' };
    const mockResponse = { token: 'mockToken' };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await signInService.login(userData);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/login`, userData);
  });

  it('creates a company successfully', async () => {
    const userData = { email: 'test@example.com', name: 'John Doe' };
    const companyData = { name: 'Company ABC', location: 'Location XYZ' };
    const mappedData = { ...userData, _id: userData.email };
    delete mappedData.email;
    const mockResponse = { success: true };
    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await signInService.createCompany(userData, companyData);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/companyaccount`, { mappedData, companyData });
  });

  it('throws an error when login fails', async () => {
    const userData = { email: 'test@example.com', password: 'password' };
    const errorMessage = 'Failed to login';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(signInService.login(userData)).rejects.toThrow(errorMessage);
  });

  // Add more test cases for error scenarios if necessary
});
