import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, useLocation, useParams } from 'react-router-dom';
import MyButton from '../../components/buttonBack/buttonBack';

// Mock de las funciones de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/home', search: '', hash: '', state: null }),
  useParams: () => ({ id: '123' })
}));

describe('MyButton component', () => {
  beforeEach(() => {
    // Restaurar el localStorage antes de cada prueba
    localStorage.clear();
  });

  it('redirects to /racedata/:id when role is admin and location is /runners/:id', () => {
    // Simular el rol de administrador en localStorage
    localStorage.setItem('role', 'admin');
    // Simular la ubicación actual en /runners/:id
    render(
      <MemoryRouter>
        <MyButton />
      </MemoryRouter>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(useLocation().pathname).toBe('/racedataAdmin/123');
  });

  // Agregar más pruebas para otros casos según sea necesario
});
