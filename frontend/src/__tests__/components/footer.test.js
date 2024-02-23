import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/footer/Footer';

describe('Footer Component', () => {
    it('renders footer logo correctly', () => {
      render(<Footer />);
      const footerLogo = screen.getByAltText('Footer Logo');
      expect(footerLogo).toBeInTheDocument();
      expect(footerLogo).toHaveAttribute('src', '//localhost:3001/images/mitca.jpg');
    });
  });