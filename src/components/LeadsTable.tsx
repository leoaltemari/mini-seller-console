import { leadStatusColors } from '@constants/status-colors';
import { useOpportunities } from '@context/OpportunitiesContext';
import { Lead } from '@models/leads';

import { useMemo } from 'react';

import StatusBadge from './StatusBadge';


interface Props {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
  lastLeadRef: (node: HTMLTableRowElement | null) => void;
}

export default function LeadsTable({ leads, onRowClick, lastLeadRef }: Props) {
  const { opportunities } = useOpportunities();

  /** Check wich leads are converted to show the correct status */
  const leadsMapped = useMemo(() => {
    return leads.map(lead => {
      const associatedOpportunity = opportunities.find(
        opportunity => opportunity.accountName === lead.email
      );
      return {
        ...lead,
        status: associatedOpportunity ? 'Converted' : lead.status,
      };
    });
  }, [leads, opportunities])

  return (
    <div className="overflow-auto rounded-xl shadow border border-gray-200">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Company</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Email</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Source</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Score</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {!leadsMapped.length && (
            <tr>
              <td
                colSpan={6}
                className="p-6 text-center text-gray-500 text-sm"
              >
                No leads found
              </td>
            </tr>
          )}

          {leadsMapped.map((lead, index) => (
            <tr
              key={lead.id}
              ref={index === leadsMapped.length - 1 ? lastLeadRef : null}
              className="cursor-pointer even:bg-gray-50 hover:bg-blue-50 transition-colors"
              onClick={() => onRowClick(lead)}
            >
              <td className="p-3 text-sm font-medium text-gray-900">{lead.name}</td>
              <td className="p-3 text-sm text-gray-700">{lead.company}</td>
              <td className="p-3 text-sm text-gray-600">{lead.email}</td>
              <td className="p-3 text-sm text-gray-600">{lead.source}</td>
              <td className="p-3 text-sm font-semibold text-gray-800">{lead.score}</td>
              <td className="p-3">
                <StatusBadge status={lead.status} colorsList={leadStatusColors} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
