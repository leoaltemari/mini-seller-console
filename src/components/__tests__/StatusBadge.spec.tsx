import { render, screen } from '@testing-library/react';

import StatusBadge from '../StatusBadge';


describe('StatusBadge', () => {
  const colorsList = {
    New: 'bg-blue-100 text-blue-800',
    Converted: 'bg-green-100 text-green-800',
  };

  it('renders the status text', () => {
    render(<StatusBadge status="New" colorsList={colorsList} />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies the correct color class when status exists in colorsList', () => {
    render(<StatusBadge status="Converted" colorsList={colorsList} />);
    const badge = screen.getByText('Converted');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-800');
  });

  it('applies default colors when status does not exist in colorsList', () => {
    render(<StatusBadge status="Unknown" colorsList={colorsList} />);
    const badge = screen.getByText('Unknown');
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-800');
  });

  it('always has the base classes for padding, rounding, font, and text size', () => {
    render(<StatusBadge status="New" colorsList={colorsList} />);
    const badge = screen.getByText('New');
    expect(badge).toHaveClass('px-3', 'py-1', 'rounded-full', 'text-xs', 'font-medium');
  });
});
