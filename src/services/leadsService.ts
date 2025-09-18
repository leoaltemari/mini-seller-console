import { SIMULATED_LATENCY } from '@constants/api-simulation';
import { Lead, LeadPreferences, LeadsResponse } from '@models/leads';
import { simulateFailure } from '@utils/simulateFailure';

import allLeads from '../../public/leads.json';

function sortByScore(a: Lead, b: Lead, desc: boolean) {
  return desc ? b.score - a.score : a.score - b.score;
}

/**
 * Function to simulate an API call to fetch leads data with Pagination.
 * @param param0 Pagination parameters `{ page, pageSize }`
 * @returns A promise that resolves to a paginated response of leads.
 */
export async function getLeads({
  page = 1,
  pageSize = 20,
  filterStatus,
  sortDesc = false,
  query = '',
}: LeadPreferences): Promise<LeadsResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const filteredLeads = (allLeads as Lead[])
          .filter(lead => {
            const matchesQuery =
              !query ||
              lead.name.toLowerCase().includes(query) ||
              lead.company.toLowerCase().includes(query);
            const matchesStatus = !filterStatus || lead.status === filterStatus;

            return matchesQuery && matchesStatus;
          })
          .sort((a, b) => sortByScore(a, b, sortDesc));

        const total = filteredLeads.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize > total ? total : start + pageSize;

        resolve({ data: filteredLeads.slice(0, end), total });
      } catch {
        reject(new Error('Failed to GET leads'));
      }
    }, SIMULATED_LATENCY);
  });
}

/**
 * Simulates saving a single lead with a possibility of failure.
 *
 * This function introduces a delay to mimic an asynchronous operation
 * and uses the `simulateFailure` utility to randomly decide whether
 * the operation succeeds or fails.
 *
 * @returns A promise that resolves when the lead is successfully saved,
 *          or rejects with an error if the simulated failure occurs.
 */
export async function saveSingleLead(): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      simulateFailure(resolve, () => reject(new Error('Failed to save lead')));
    }, SIMULATED_LATENCY);
  });
}
