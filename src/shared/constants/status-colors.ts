export const leadStatusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-green-100 text-green-800',
  Lost: 'bg-red-100 text-red-800',
  Converted: 'bg-purple-100 text-purple-800',
} as const;

export const opportunitiesStatusColors: Record<string, string> = {
  Prospecting: 'bg-blue-100 text-blue-800',
  'Needs Analysis': 'bg-yellow-100 text-yellow-800',
  Proposal: 'bg-green-100 text-green-800',
  Negotiation: 'bg-purple-100 text-purple-800',
  Closed: 'bg-gray-200 text-gray-800',
} as const;
