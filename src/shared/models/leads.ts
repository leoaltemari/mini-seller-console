import { PaginatedResponse } from './pagination';

export type LeadsResponse = PaginatedResponse<Lead[]>;
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: LeadStatus;
}

export interface LeadPreferences {
  sortDesc: boolean;
  filterStatus: string | null;
  query: string;
}
