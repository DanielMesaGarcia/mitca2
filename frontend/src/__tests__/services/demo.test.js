import axios from 'axios';
import DemoService from '../../services/demoService';

const API_URL = process.env.REACT_APP_API_URL;

const DEMO_URL = API_URL+'/demo/crearDemoData';

// Mock axios
jest.mock('axios');

describe('DemoService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates demo data successfully', async () => {
    const mockResponseData = { message: 'Demo data created successfully' };
    axios.get.mockResolvedValueOnce({ data: mockResponseData });

    const response = await DemoService.createDemoData();

    expect(response).toEqual(mockResponseData);
    expect(axios.get).toHaveBeenCalledWith(`${DEMO_URL}`);
  });

  it('throws an error when creating demo data fails', async () => {
    const errorMessage = 'Failed to create demo data';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(DemoService.createDemoData()).rejects.toThrow(errorMessage);
  });
});
