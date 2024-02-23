import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RaceListService from '../../services/raceListService';
import HomeAdmin from '../../pages/Home/HomeAdmin';

// Mockear el servicio de lista de carreras para simular su respuesta
jest.mock('../../services/raceListService');

// Simular la respuesta del servicio de lista de carreras
const mockRaces = [
  { _id: 'race1', filename: 'race1.jpg' },
  { _id: 'race2', filename: 'race2.jpg' },
];

describe('HomeAdmin Page', () => {
  beforeEach(() => {
    // Establecer la respuesta simulada del servicio de lista de carreras
    RaceListService.getRaces.mockResolvedValue({ success: true, data: mockRaces });
  });

  it('renders race cards and create race modal', async () => {
    render(<HomeAdmin />);
    
    // Verificar que se muestren las tarjetas de carreras después de cargar
    await waitFor(() => {
      expect(screen.getAllByRole('link')).toHaveLength(mockRaces.length);
    });

    // Verificar que se muestre el botón "Create Race"
    await waitFor(() => {
      expect(screen.getByText('Create Race')).toBeInTheDocument();
    });

    // Hacer clic en el botón "Create Race" para mostrar el modal
    fireEvent.click(screen.getByText('Create Race'));

    // Esperar a que el modal de creación esté visible
    await waitFor(() => {
      expect(screen.getByText('Create Race')).toBeVisible();
    });

    // Verificar que el formulario está presente después de que se muestra el modal
    await waitFor(() => {
        const formLabels = ['Race Name', 'Event Date', 'City', 'Length', 'Checkpoint', 'Start Point', 'Goal'];
        formLabels.forEach(label => {
          expect(screen.getByLabelText(label)).toBeInTheDocument();
        });
      });

    // Verificar que el botón de carga de fotos esté presente
    await waitFor(() => {
      expect(screen.getByLabelText('Foto')).toBeInTheDocument();
    });

    // Verificar que el archivo se haya seleccionado después de la carga
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText('Foto'), { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });

    // Hacer clic en el botón de enviar para crear la carrera
    fireEvent.click(screen.getByRole('button', { name: 'Create Race' }));

    // Esperar a que el modal se cierre después de enviar el formulario
    await waitFor(() => {
      expect(screen.queryByText('Create Race')).not.toBeInTheDocument();
    });

    // Esperar a que la nueva carrera se agregue a la lista de carreras
    await waitFor(() => {
      expect(screen.getAllByRole('link')).toHaveLength(mockRaces.length + 1);
    });
  });
});
