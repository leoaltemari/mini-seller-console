import { useOpportunities } from '@context/OpportunitiesContext';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { Lead, LeadPreferences } from '@models/leads';
import { PaginationParams } from '@models/pagination';
import { getLeads, saveSingleLead } from '@services/leadsService';

import { useEffect, useState } from 'react';

/**
 * Custom hook to manage fetching, saving, and converting leads.
 *
 * @param pagination - Optional pagination parameters to control the fetch behavior.
 *
 * @returns An object containing:
 * - `leads`: The list of fetched leads.
 * - `loading`: A boolean indicating whether the leads are being loaded.
 * - `error`: A string representing any error that occurred during the fetch.
 * - `hasMore`: A boolean indicating whether there are more leads to fetch.
 * - `saveLead`: A function to update and save a lead.
 * - `convertLead`: A function to convert a lead into an opportunity.
 * - `prefs`: User preferences for filtering, sorting, and querying leads.
 * - `setPrefs`: A function to update user preferences.
 *
 * @example
 * ```tsx
 * const { leads, loading, error, saveLead, convertLead, prefs, setPrefs, hasMore } = useFetchLeads({ page: 1, limit: 10 });
 *
 * if (loading) {
 *   return <div>Loading...</div>;
 * }
 *
 * if (error) {
 *   return <div>Error: {error}</div>;
 * }
 *
 * return (
 *   <div>
 *     {leads.map(lead => (
 *       <div key={lead.id}>{lead.name}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useFetchLeads(pagination: PaginationParams = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [prefs, setPrefs] = useLocalStorage<LeadPreferences>('user:prefs', {
    filterStatus: null as string | null,
    sortDesc: true,
    query: '',
  });

  const { addOpportunity, removeOpportunity } = useOpportunities();

  /** Fetch new Leads */
  useEffect(() => {
    setLoading(true);

    getLeads({ ...pagination, ...prefs })
      .then(({ data, total }) => {
        setLeads(data);
        setHasMore(data.length > 0 && data.length < total);
      })
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [pagination, prefs]);

  function getOppIdByLeadId(leadId: string): string {
    return `O-${leadId.replace('L-', '')}`;
  }

  /** Saves a lead after editing it */
  async function saveLead(updatedLead: Lead): Promise<void> {
    if (!leads) return;

    await saveSingleLead()
      .then(() => {
        /** Adds into Opportunities list if the status changes to `Converted` */
        if (updatedLead.status === 'Converted') {
          convertLead(updatedLead);
          return;
        }

        /** Always remove from opportunity list if the lead status is not `Converted` */
        removeOpportunity(getOppIdByLeadId(updatedLead.id));
        const newLeads = leads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead));

        setLeads(newLeads);
      })
      .catch(err => {
        setLeads(leads); // rollback
        throw err;
      });
  }

  /** Convert a lead into an Opportunity */
  function convertLead(lead: Lead, accountName?: string, amount?: number): void {
    const leadIsAlreadyAnOpportunity = leads?.some(
      l => l.id === lead.id && l.status === 'Converted'
    );

    if (leadIsAlreadyAnOpportunity) return;

    addOpportunity({
      id: getOppIdByLeadId(lead.id),
      name: lead.name,
      stage: 'Prospecting',
      amount,
      accountName: accountName || lead.email,
    });

    /** Changes only the lead that was converted into opportunity */
    setLeads(prevLeads =>
      prevLeads?.map(existingLead => {
        return existingLead.id === lead.id
          ? { ...existingLead, status: 'Converted' }
          : existingLead;
      })
    );
  }

  return { leads, loading, error, saveLead, convertLead, prefs, setPrefs, hasMore };
}
