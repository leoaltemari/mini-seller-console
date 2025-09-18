/* eslint-disable react-refresh/only-export-components */
import { useLocalStorage } from '@hooks/useLocalStorage';
import { Opportunity } from '@models/opportunity';

import React, { createContext, JSX, useContext } from 'react';


interface OppContextType {
  opportunities: Opportunity[];
  addOpportunity: (opp: Opportunity) => void;
}

const OppContext = createContext<OppContextType | null>(null);

/**
 * Provides the Opportunities context to its children components.
 * This context allows managing a list of opportunities and provides
 * a method to add new opportunities.
 *
 * @param {Object} props - The props for the provider component.
 * @param {React.ReactNode} props.children - The child components that will have access to the Opportunities context.
 *
 * @returns {JSX.Element} A context provider component that wraps its children with the Opportunities context.
 */
export function OpportunitiesProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [opportunities, setOpportunities] = useLocalStorage<Opportunity[]>('user:opps', []);

  function addOpportunity(opp: Opportunity): void {
    setOpportunities([...opportunities, opp]);
  }

  return (
    <OppContext.Provider value={{ opportunities, addOpportunity }}>
      {children}
    </OppContext.Provider>
  )
}

export function useOpportunities(): OppContextType {
  const context = useContext(OppContext);

  if (!context) {
    throw new Error('useOpportunities must be used within OpportunitiesProvider');
  }

  return context;
}
