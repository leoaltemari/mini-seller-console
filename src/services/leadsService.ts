import { SIMULATED_LATENCY } from '@constants/api-simulation';
import { Lead, LeadsResponse } from '@models/leads';
import { PaginationParams } from '@models/pagination';
import { simulateFailure } from '@utils/simulateFailure';

/**
 * Function to simulate an API call to fetch leads data.
 * @param param0 Pagination parameters `{ page, pageSize }`
 * @returns A promise that resolves to a paginated response of leads.
 */
export async function fetchLeads({
  page = 1,
  pageSize = 20,
}: PaginationParams = {}): Promise<LeadsResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await fetch('/leads.json');

        if (!response.ok) {
          throw new Error(`HTTP error on GET leads! status: ${response.status}`);
        }

        const allLeads: Lead[] = await response.json();
        const total = allLeads.length;

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const leads = allLeads.slice(0, end);

        resolve({ data: leads, total });
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
      simulateFailure(resolve, () => reject(new Error('Simulated failure occurred')));
    }, SIMULATED_LATENCY);
  });
}
