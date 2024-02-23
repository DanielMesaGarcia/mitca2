import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Chat from '../../components/chatModal/chatModal';
import messageService from '../../services/messageService';

// Mock de messageService para simular el envío y obtención de mensajes
jest.mock('../../services/messageService', () => ({
  getAllMessages: jest.fn(),
  sendMessage: jest.fn(),
  deleteMessage: jest.fn(),
  updateMessage: jest.fn(),
}));

describe('Chat Component', () => {
  beforeEach(() => {
    // Limpiar cualquier llamada previa a las funciones mock de messageService
    messageService.getAllMessages.mockClear();
    messageService.sendMessage.mockClear();
    messageService.deleteMessage.mockClear();
    messageService.updateMessage.mockClear();
  });

  it('renders chat component correctly', async () => {
    // Simular la obtención de mensajes vacíos
    messageService.getAllMessages.mockResolvedValue([]);

    render(<Chat />);

    // Verificar que el chat se renderice correctamente
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escribe tu mensaje')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Enviar')).toBeInTheDocument();
    });
  });

  it('displays messages correctly', async () => {
    // Simular mensajes
    const messages = [
      { _id: '1', sender: 'User1', message: 'Message 1' },
      { _id: '2', sender: 'User2', message: 'Message 2' },
    ];
    messageService.getAllMessages.mockResolvedValue(messages);

    render(<Chat />);

    // Esperar a que se carguen los mensajes
    await waitFor(() => {
      expect(screen.getByText('Message 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Message 2')).toBeInTheDocument();
    });
  });

  it('sends a message correctly', async () => {
    // Simular mensaje de envío
    const newMessage = { _id: '3', sender: 'User1', message: 'New Message' };
    messageService.sendMessage.mockResolvedValue(newMessage);

    render(<Chat />);

    // Ingresar un nuevo mensaje y enviar
    const input = screen.getByPlaceholderText('Escribe tu mensaje');
    const sendButton = screen.getByText('Enviar');

    fireEvent.change(input, { target: { value: 'New Message' } });
    fireEvent.click(sendButton);

    // Verificar que el mensaje se envió correctamente
    await waitFor(() => {
      expect(messageService.sendMessage).toHaveBeenCalledWith({ sender: expect.any(String), message: 'New Message', type: 'sent' });
    });

    await waitFor(() => {
      expect(screen.getByText('New Message')).toBeInTheDocument();
    });
  });

  it('edits a message correctly', async () => {
    // Simular mensaje existente
    const existingMessage = { _id: '4', sender: 'User1', message: 'Existing Message' };
    messageService.getAllMessages.mockResolvedValue([existingMessage]);

    render(<Chat />);

    // Simular click en el botón de editar
    const editButton = await screen.findByLabelText('edit-button');
    fireEvent.click(editButton);

    // Ingresar un nuevo texto y enviar
    const input = screen.getByPlaceholderText('Escribe tu mensaje');
    const sendButton = screen.getByText('Enviar');

    fireEvent.change(input, { target: { value: 'Edited Message' } });
    fireEvent.click(sendButton);

    // Verificar que el mensaje se editó correctamente
    await waitFor(() => {
      expect(messageService.updateMessage).toHaveBeenCalledWith('4', 'Edited Message');
    });

    await waitFor(() => {
      expect(screen.getByText('Edited Message')).toBeInTheDocument();
    });
  });

  it('deletes a message correctly', async () => {
    // Simular mensaje existente
    const existingMessage = { _id: '5', sender: 'User1', message: 'Existing Message' };
    messageService.getAllMessages.mockResolvedValue([existingMessage]);

    render(<Chat />);

    // Simular click en el botón de eliminar
    const deleteButton = await screen.findByLabelText('delete-button');
    fireEvent.click(deleteButton);

    // Verificar que el mensaje se eliminó correctamente
    await waitFor(() => {
      expect(messageService.deleteMessage).toHaveBeenCalledWith('5');
    });

    await waitFor(() => {
      expect(screen.queryByText('Existing Message')).not.toBeInTheDocument();
    });
  });
});
