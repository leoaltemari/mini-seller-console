import { opportunitiesStatusColors } from '@constants/status-colors';
import { useOpportunities } from '@context/OpportunitiesContext';

import StatusBadge from './StatusBadge';


export default function OpportunitiesTable() {
  const { opportunities } = useOpportunities();

  return (
    <div className="overflow-auto rounded-xl shadow border border-gray-200">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">ID</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Account</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Stage</th>
            <th className="text-left p-3 text-sm font-semibold text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {!opportunities.length && (
            <tr>
              <td
                colSpan={5}
                className="p-6 text-center text-gray-500 text-sm"
              >
                No opportunities yet
              </td>
            </tr>
          )}

          {opportunities.map((opportunity) => (
            <tr
              key={opportunity.id}
              className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
            >
              <td className="p-3 text-sm text-gray-700">{opportunity.id}</td>
              <td className="p-3 text-sm font-medium text-gray-900">
                {opportunity.name}
              </td>
              <td className="p-3 text-sm text-gray-700">{opportunity.accountName}</td>
              <td className="p-3">
                <StatusBadge status={opportunity.stage} colorsList={opportunitiesStatusColors} />
              </td>
              <td className="p-3 text-sm font-semibold text-gray-800">
                {opportunity.amount ? `$${opportunity.amount}` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
