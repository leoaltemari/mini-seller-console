import { Lead } from '@models/leads';


interface Props {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
  lastLeadRef: (node: HTMLTableRowElement | null) => void;
}

export default function LeadsTable({ leads, onRowClick, lastLeadRef }: Props) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Id</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Company</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Source</th>
            <th className="text-left p-2">Score</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {
            !leads.length && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">No leads found</td>
              </tr>
            )
          }
          {
            leads.map((lead, index) => (
              <tr
                key={lead.id}
                ref={index === leads.length - 1 ? lastLeadRef : null}
                className="cursor-pointer hover:bg-gray-200 h-16"
                onClick={() => onRowClick(lead)}
              >
                <td className="p-2">{lead.id}</td>
                <td className="p-2">{lead.name}</td>
                <td className="p-2">{lead.company}</td>
                <td className="p-2">{lead.email}</td>
                <td className="p-2">{lead.source}</td>
                <td className="p-2">{lead.score}</td>
                <td className="p-2">{lead.status}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}