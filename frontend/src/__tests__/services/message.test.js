import axios from 'axios';
import messageService from '../../services/messageService';

// Mock axios
jest.mock('axios');

describe('messageService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all messages successfully', async () => {
    const mockData = [{ id: 1, text: 'Message 1' }, { id: 2, text: 'Message 2' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const messages = await messageService.getAllMessages();

    expect(messages).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/messages'));
  });

  it('throws an error when fetching messages fails', async () => {
    const errorMessage = 'Failed to fetch messages';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(messageService.getAllMessages()).rejects.toThrow(errorMessage);
  });

  it('sends a message successfully', async () => {
    const mockMessageData = { text: 'Test message' };
    const mockResponse = { success: true };

    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await messageService.sendMessage(mockMessageData);

    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/messages'), mockMessageData);
  });

  it('throws an error when sending a message fails', async () => {
    const mockMessageData = { text: 'Test message' };
    const errorMessage = 'Failed to send message';

    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(messageService.sendMessage(mockMessageData)).rejects.toThrow(errorMessage);
  });

  it('deletes a message successfully', async () => {
    const messageId = 1;
    const mockResponse = { success: true };

    axios.delete.mockResolvedValueOnce({ data: mockResponse });

    const response = await messageService.deleteMessage(messageId);

    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining(`/messages/${messageId}`));
  });

  it('throws an error when deleting a message fails', async () => {
    const messageId = 1;
    const errorMessage = 'Failed to delete message';

    axios.delete.mockRejectedValueOnce(new Error(errorMessage));

    await expect(messageService.deleteMessage(messageId)).rejects.toThrow(errorMessage);
  });

  it('updates a message successfully', async () => {
    const messageId = 1;
    const newMessage = 'Updated message';
    const mockResponse = { success: true };

    axios.put.mockResolvedValueOnce({ data: mockResponse });

    const response = await messageService.updateMessage(messageId, newMessage);

    expect(response).toEqual(mockResponse);
    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining(`/messages/${messageId}`), { message: newMessage });
  });

  it('throws an error when updating a message fails', async () => {
    const messageId = 1;
    const newMessage = 'Updated message';
    const errorMessage = 'Failed to update message';

    axios.put.mockRejectedValueOnce(new Error(errorMessage));

    await expect(messageService.updateMessage(messageId, newMessage)).rejects.toThrow(errorMessage);
  });
});
