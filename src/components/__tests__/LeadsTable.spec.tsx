import { Lead } from '@models/leads';
import { fireEvent, render, screen } from '@testing-library/react';

import LeadsTable from '../LeadsTable';


// Mock useOpportunities hook
jest.mock('@context/OpportunitiesContext', () => ({
  useOpportunities: () => ({
    opportunities: [
      { id: 'op1', accountName: 'lead1@email.com', stage: 'Closed', amount: 500 }
    ],
  }),
}));

// Mock StatusBadge to simplify tests
jest.mock('../StatusBadge', () => ({ status }: { status: string }) => (
  <span data-testid="status-badge">{status}</span>
));

describe('LeadsTable', () => {
  const baseLead: Lead = {
    id: 'lead1',
    name: 'Lead One',
    company: 'Acme Corp',
    email: 'lead1@email.com',
    source: 'Web',
    score: 10,
    status: 'New',
  };

  it('renders "No leads found" when no leads', () => {
    render(
      <LeadsTable
        leads={[]}
        onRowClick={jest.fn()}
        lastLeadRef={jest.fn()}
      />
    );

    expect(screen.getByText(/no leads found/i)).toBeInTheDocument();
  });

  it('renders leads and calls onRowClick when row is clicked', () => {
    const handleRowClick = jest.fn();
    const mockRef = jest.fn();

    render(
      <LeadsTable
        leads={[baseLead]}
        onRowClick={handleRowClick}
        lastLeadRef={mockRef}
      />
    );

    const row = screen.getByText('Lead One').closest('tr');
    expect(row).toBeInTheDocument();

    fireEvent.click(row!);
    expect(handleRowClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'lead1' })
    );

    // Ensure lastLeadRef was assigned
    expect(mockRef).toHaveBeenCalled();
  });

  it('overrides status to "Converted" if opportunity exists', () => {
    render(
      <LeadsTable
        leads={[{ ...baseLead, status: 'New' }]}
        onRowClick={jest.fn()}
        lastLeadRef={jest.fn()}
      />
    );

    expect(screen.getByTestId('status-badge')).toHaveTextContent('Converted');
  });

  it('resets status to "New" if no opportunity and status was "Converted"', () => {
    render(
      <LeadsTable
        leads={[{ ...baseLead, email: 'no-match@email.com', status: 'Converted' }]}
        onRowClick={jest.fn()}
        lastLeadRef={jest.fn()}
      />
    );

    expect(screen.getByTestId('status-badge')).toHaveTextContent('New');
  });

  it('keeps original status if no opportunity and status is not "Converted"', () => {
    render(
      <LeadsTable
        leads={[{ ...baseLead, email: 'no-match@email.com', status: 'Qualified' }]}
        onRowClick={jest.fn()}
        lastLeadRef={jest.fn()}
      />
    );

    expect(screen.getByTestId('status-badge')).toHaveTextContent('Qualified');
  });
});
