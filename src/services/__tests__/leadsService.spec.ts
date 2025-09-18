import { Lead } from '@models/leads';
import { simulateFailure } from '@utils/simulateFailure';

import { getLeads, saveSingleLead } from '../leadsService';

jest.mock('@utils/simulateFailure');

describe('leadsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getLeads', () => {
    const allLeads: Lead[] = [
      {
        id: 'L-1',
        name: 'Lead 1',
        company: 'C1',
        email: 'l1@email.com',
        source: 'Website',
        score: 10,
        status: 'New',
      },
      {
        id: 'L-2',
        name: 'Lead 2',
        company: 'C2',
        email: 'l2@email.com',
        source: 'Referral',
        score: 20,
        status: 'Contacted',
      },
      {
        id: 'L-3',
        name: 'Lead 3',
        company: 'C3',
        email: 'l3@email.com',
        source: 'Website',
        score: 15,
        status: 'New',
      },
    ];

    it('fetches paginated leads successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(allLeads),
      });

      const promise = getLeads({ page: 1, pageSize: 2 });
      jest.runAllTimers();
      const result = await promise;

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
    });

    it('fetches leads with default pagination', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(allLeads),
      });

      const promise = getLeads();
      jest.runAllTimers();
      const result = await promise;

      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('rejects when fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const promise = getLeads({ page: 1, pageSize: 2 });
      jest.runAllTimers();

      await expect(promise).rejects.toThrow('Failed to GET leads');
    });

    it('rejects when response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

      const promise = getLeads();
      jest.runAllTimers();

      await expect(promise).rejects.toThrow('Failed to GET leads');
    });
  });

  describe('saveSingleLead', () => {
    it('resolves when simulateFailure calls callback', async () => {
      (simulateFailure as jest.Mock).mockImplementation(callback => callback());

      const promise = saveSingleLead();
      jest.runAllTimers();
      await expect(promise).resolves.toBeUndefined();
    });

    it('rejects when simulateFailure calls fallback', async () => {
      (simulateFailure as jest.Mock).mockImplementation((_callback, fallback) => fallback());

      const promise = saveSingleLead();
      jest.runAllTimers();
      await expect(promise).rejects.toThrow('Failed to save lead');
    });
  });
});
