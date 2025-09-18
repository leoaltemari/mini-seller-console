import { LeadPreferences } from '@models/leads';
import { fireEvent, render, screen } from '@testing-library/react';

import LeadsTableFilter from '../LeadsTableFilter';


describe('LeadsTableFilter', () => {
  const basePrefs: LeadPreferences = {
    query: '',
    filterStatus: null,
    sortDesc: false,
  };

  it('renders input, select, and button correctly', () => {
    render(
      <LeadsTableFilter
        preferences={basePrefs}
        onSortToggle={jest.fn()}
        onFilterChange={jest.fn()}
        onQueryChange={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/search name or company/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sort score/i })).toBeInTheDocument();
  });

  it('calls onQueryChange when typing in input', () => {
    const handleQueryChange = jest.fn();
    render(
      <LeadsTableFilter
        preferences={basePrefs}
        onSortToggle={jest.fn()}
        onFilterChange={jest.fn()}
        onQueryChange={handleQueryChange}
      />
    );

    const input = screen.getByPlaceholderText(/search name or company/i);
    fireEvent.change(input, { target: { value: 'Acme' } });

    expect(handleQueryChange).toHaveBeenCalledWith('Acme');
  });

  it('calls onFilterChange with correct value', () => {
    const handleFilterChange = jest.fn();
    render(
      <LeadsTableFilter
        preferences={basePrefs}
        onSortToggle={jest.fn()}
        onFilterChange={handleFilterChange}
        onQueryChange={jest.fn()}
      />
    );

    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'New' } });
    expect(handleFilterChange).toHaveBeenCalledWith('New');

    fireEvent.change(select, { target: { value: '' } });
    expect(handleFilterChange).toHaveBeenCalledWith(null);
  });

  it('calls onSortToggle when button is clicked', () => {
    const handleSortToggle = jest.fn();
    render(
      <LeadsTableFilter
        preferences={basePrefs}
        onSortToggle={handleSortToggle}
        onFilterChange={jest.fn()}
        onQueryChange={jest.fn()}
      />
    );

    const button = screen.getByRole('button', { name: /sort score/i });
    fireEvent.click(button);

    expect(handleSortToggle).toHaveBeenCalled();
  });

  it('shows ↓ arrow when sortDesc is true', () => {
    render(
      <LeadsTableFilter
        preferences={{ ...basePrefs, sortDesc: true }}
        onSortToggle={jest.fn()}
        onFilterChange={jest.fn()}
        onQueryChange={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /sort score ↓/i })).toBeInTheDocument();
  });

  it('shows ↑ arrow when sortDesc is false', () => {
    render(
      <LeadsTableFilter
        preferences={{ ...basePrefs, sortDesc: false }}
        onSortToggle={jest.fn()}
        onFilterChange={jest.fn()}
        onQueryChange={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /sort score ↑/i })).toBeInTheDocument();
  });
});
