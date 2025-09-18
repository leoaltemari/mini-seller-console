import { useOpportunities } from '@context/OpportunitiesContext';


export default function OpportunitiesTable() {
  const { opportunities } = useOpportunities();

  return (
    <table className="p-4 min-w-full table-auto">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left p-2">ID</th>
          <th className="text-left p-2">Name</th>
          <th className="text-left p-2">Account</th>
          <th className="text-left p-2">Stage</th>
          <th className="text-left p-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {
          !opportunities.length && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">No opportunities yet</td>
            </tr>
          )
        }
        {
          opportunities.map((opportunity) => (
            <tr key={opportunity.id}>
              <td className="p-2">{opportunity.id}</td>
              <td className="p-2">{opportunity.name}</td>
              <td className="p-2">{opportunity.accountName}</td>
              <td className="p-2">{opportunity.stage}</td>
              <td className="p-2">{opportunity.amount ?? '-'}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
