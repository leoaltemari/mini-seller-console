// src/components/__tests__/OpportunitiesTable.spec.tsx
import { fireEvent, render, screen } from '@testing-library/react';

import OpportunitiesTable from '../OpportunitiesTable';


// Mock StatusBadge to simplify rendering
jest.mock('../StatusBadge', () => ({ status, colorsList }: {
  status: string,
  colorsList: Record<string, string>
}) => (
  <span data-testid="status-badge">
    {status}-{colorsList ? 'with-colors' : 'no-colors'}
  </span>
));

// Mock context
const mockRemoveOpportunity = jest.fn();

jest.mock('@context/OpportunitiesContext', () => ({
  useOpportunities: jest.fn(),
}));

const { useOpportunities } = jest.requireMock('@context/OpportunitiesContext');

describe('OpportunitiesTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "No opportunities yet" when list is empty', () => {
    (useOpportunities as jest.Mock).mockReturnValue({
      opportunities: [],
      removeOpportunity: mockRemoveOpportunity,
    });

    render(<OpportunitiesTable />);
    expect(screen.getByText(/No opportunities yet/i)).toBeInTheDocument();
  });

  it('renders opportunities in table with StatusBadge', () => {
    (useOpportunities as jest.Mock).mockReturnValue({
      opportunities: [
        {
          id: '1',
          name: 'Opportunity A',
          accountName: 'Account X',
          stage: 'Closed',
          amount: 1000,
        },
      ],
      removeOpportunity: mockRemoveOpportunity,
    });

    render(<OpportunitiesTable />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Opportunity A')).toBeInTheDocument();
    expect(screen.getByText('Account X')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge')).toHaveTextContent('Closed-with-colors');
    expect(screen.getByText('$1000')).toBeInTheDocument();
    expect(screen.getByTitle(/delete opportunity/i)).toBeInTheDocument();
  });

  it('calls removeOpportunity when delete is confirmed', () => {
    (useOpportunities as jest.Mock).mockReturnValue({
      opportunities: [
        {
          id: '1',
          name: 'Opportunity A',
          accountName: 'Account X',
          stage: 'Closed',
          amount: 500,
        },
      ],
      removeOpportunity: mockRemoveOpportunity,
    });

    // Mock confirm to return true
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(<OpportunitiesTable />);
    fireEvent.click(screen.getByTitle(/delete opportunity/i));

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete this opportunity?'
    );
    expect(mockRemoveOpportunity).toHaveBeenCalledWith('1');
  });

  it('does not call removeOpportunity when delete is canceled', () => {
    (useOpportunities as jest.Mock).mockReturnValue({
      opportunities: [
        {
          id: '2',
          name: 'Opportunity B',
          accountName: 'Account Y',
          stage: 'Open',
          amount: null,
        },
      ],
      removeOpportunity: mockRemoveOpportunity,
    });

    // Mock confirm to return false
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(<OpportunitiesTable />);
    fireEvent.click(screen.getByTitle(/delete opportunity/i));

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockRemoveOpportunity).not.toHaveBeenCalled();
  });
});
