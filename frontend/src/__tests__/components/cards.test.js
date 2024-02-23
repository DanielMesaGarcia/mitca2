import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CardComponent from '../../components/cards/cards';

describe('CardComponent', () => {
  const props = {
    title: 'Test Title',
    imageSrc: 'test.jpg',
    description: 'Test Description',
    buttonText: 'Test Button',
    onClick: jest.fn()
  };

  it('renders with correct props', () => {
    render(<CardComponent {...props} />);

    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByAltText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
    expect(screen.getByText(props.buttonText)).toBeInTheDocument();
  });

  it('calls onClick handler when button is clicked', () => {
    render(<CardComponent {...props} />);

    fireEvent.click(screen.getByText(props.buttonText));

    expect(props.onClick).toHaveBeenCalledTimes(1);
  });
});
