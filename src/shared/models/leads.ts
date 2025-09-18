import { PaginatedResponse } from './pagination';

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

export type LeadsResponse = PaginatedResponse<Lead[]>;
