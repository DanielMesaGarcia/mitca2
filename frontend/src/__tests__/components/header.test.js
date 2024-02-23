import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/header/Header';

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.setItem('role', 'admin'); // Simula que el usuario tiene el rol de administrador
  });

  afterEach(() => {
    localStorage.clear(); // Limpia el almacenamiento local después de cada test
  });

  it('renders header buttons correctly for admin user', () => {
    render(<Header />);
    
    const vueltaAlInicioButton = screen.getByText('Vuelta al inicio');
    const manualButton = screen.getByText('Manual');
    const userSettingsButton = screen.getByText('Ajustes de usuario');
    const reportButton = screen.getByText('Report');
    const createDataButton = screen.getByText('Crear datos demo');
    const logOutButton = screen.getByText('Cerrar sesión');

    expect(vueltaAlInicioButton).toBeInTheDocument();
    expect(manualButton).toBeInTheDocument();
    expect(userSettingsButton).toBeInTheDocument();
    expect(reportButton).toBeInTheDocument();
    expect(createDataButton).toBeInTheDocument();
    expect(logOutButton).toBeInTheDocument();
  });

  it('opens modal when "Report" button is clicked', () => {
    render(<Header />);
    
    const reportButton = screen.getByText('Report');
    fireEvent.click(reportButton);

    const modalTitle = screen.getByText('Reports');
    expect(modalTitle).toBeInTheDocument();
  });

  it('logs out user when "Cerrar sesión" button is clicked', () => {
    const navigateMock = jest.fn(); // Mock de la función navigate

    // Sustituye el hook useNavigate con una función de simulación
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => navigateMock,
    }));

    render(<Header />);
    
    const logOutButton = screen.getByText('Cerrar sesión');
    fireEvent.click(logOutButton);

    expect(localStorage.getItem('token')).toBeNull(); // Comprueba que el token se haya eliminado
    expect(localStorage.getItem('role')).toBeNull(); // Comprueba que el rol se haya eliminado
    expect(navigateMock).toHaveBeenCalledWith('/login'); // Comprueba que se haya redirigido a la página de inicio de sesión
  });
});
