import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Para tener acceso a las funciones de expect de Jest
import RaceListService from '../../services/raceListService';
import Home from '../../pages/Home/Home';


// Mockear el servicio de lista de carreras para simular su respuesta
jest.mock('../../services/raceListService');

// Simular la respuesta del servicio de lista de carreras
const mockRaces = [
  { _id: 'race1', filename: 'race1.jpg' },
  { _id: 'race2', filename: 'race2.jpg' },
];

describe('Home Page', () => {
  beforeEach(() => {
    // Establecer la respuesta simulada del servicio de lista de carreras
    RaceListService.getRaces.mockResolvedValue({ success: true, data: mockRaces });
  });

  it('renders race cards', async () => {
    render(<Home />);
    
    // Esperar a que se carguen las carreras
    await waitFor(() => {
      // Verificar que se rendericen las tarjetas de carreras
      expect(screen.getAllByRole('link')).toHaveLength(mockRaces.length);
      
      // Verificar que se muestre la imagen de cada carrera
      mockRaces.forEach((race) => {
        expect(screen.getByAltText(race.filename)).toBeInTheDocument();
      });
    });
  });
});
