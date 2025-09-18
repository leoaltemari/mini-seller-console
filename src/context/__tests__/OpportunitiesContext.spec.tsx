import { Opportunity } from '@models/opportunity';
import { act, renderHook } from '@testing-library/react';

import React from 'react';

import { OpportunitiesProvider, useOpportunities } from '../OpportunitiesContext';


const mockSetItem = jest.fn();
jest.mock('@hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn((key: string, initialValue: unknown) => [initialValue, mockSetItem]),
}));

describe('OpportunitiesContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error if useOpportunities is used outside the provider', () => {
    expect(() => renderHook(() => useOpportunities())).toThrow(
      'useOpportunities must be used within OpportunitiesProvider'
    );
  });

  it('provides default empty opportunities array', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OpportunitiesProvider>{children}</OpportunitiesProvider>
    );

    const { result } = renderHook(() => useOpportunities(), { wrapper });
    expect(result.current.opportunities).toEqual([]);
  });

  it('addOpportunity adds a new opportunity', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OpportunitiesProvider>{children}</OpportunitiesProvider>
    );

    const { result } = renderHook(() => useOpportunities(), { wrapper });

    const newOpp: Opportunity = { id: '1', accountName: 'Acme', stage: 'Prospect', amount: 1000, name: '' };

    act(() => {
      result.current.addOpportunity(newOpp);
    });

    expect(mockSetItem).toHaveBeenCalledWith([newOpp]);
  });

  it('removeOpportunity removes the correct opportunity', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <OpportunitiesProvider>{children}</OpportunitiesProvider>
    );

    const { result } = renderHook(() => useOpportunities(), { wrapper });

    const opp1: Opportunity = { id: '1', accountName: 'Acme', stage: 'Prospect', amount: 1000, name: '' };
    const opp2: Opportunity = { id: '2', accountName: 'Beta', stage: 'Closed', amount: 500, name: '' };

    act(() => {
      result.current.addOpportunity(opp1);
      result.current.addOpportunity(opp2);
    });

    act(() => {
      result.current.removeOpportunity('1');
    });

    expect(mockSetItem).toHaveBeenCalledWith([opp2]);
  });
});
