import { Lead } from '@models/leads';
import { simulateFailure } from '@utils/simulateFailure';

import allLeads from '../../../public/leads.json';
import { getLeads, saveSingleLead } from '../leadsService';

jest.mock('@utils/simulateFailure');

describe('leadsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getLeads', () => {
    it('fetches paginated leads successfully', async () => {
      const promise = getLeads({
        page: 1,
        pageSize: 2,
        filterStatus: null,
        sortDesc: false,
        query: '',
      });

      // Run all timers to resolve the setTimeout
      jest.runAllTimers();
      const result = await promise;

      expect(result.data).toHaveLength(2); // first page of 2 items
      expect(result.total).toBe((allLeads as Lead[]).length);
    });

    it('fetches leads with default pagination', async () => {
      const promise = getLeads({
        page: 1,
        pageSize: 20,
        filterStatus: null,
        sortDesc: false,
        query: '',
      });

      jest.runAllTimers();
      const result = await promise;

      expect(result.data).toHaveLength(20); // all items since pageSize >= total
      expect(result.total).toBe((allLeads as Lead[]).length);
    });

    it('applies query filtering', async () => {
      const query = (allLeads as Lead[])[0].name; // use first lead's name
      const promise = getLeads({
        page: 1,
        pageSize: 20,
        filterStatus: null,
        sortDesc: false,
        query,
      });

      jest.runAllTimers();
      const result = await promise;

      expect(
        result.data.every(lead => lead.name.includes(query) || lead.company.includes(query))
      ).toBe(true);
    });

    it('applies status filtering', async () => {
      const filterStatus = (allLeads as Lead[])[0].status;
      const promise = getLeads({ page: 1, pageSize: 20, filterStatus, sortDesc: false, query: '' });

      jest.runAllTimers();
      const result = await promise;

      expect(result.data.every(lead => lead.status === filterStatus)).toBe(true);
    });

    it('applies sort descending by score', async () => {
      const promise = getLeads({
        page: 1,
        pageSize: 20,
        filterStatus: null,
        sortDesc: true,
        query: '',
      });

      jest.runAllTimers();
      const result = await promise;

      const scores = result.data.map(lead => lead.score);
      const sortedScores = [...scores].sort((a, b) => b - a);
      expect(scores).toEqual(sortedScores);
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
