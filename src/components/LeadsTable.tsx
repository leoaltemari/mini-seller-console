import { Lead } from '@models/leads';


interface Props {
  leads: Lead[];
  onRowClick: (lead: Lead) => void;
  onSortToggle: () => void;
  sortDesc: boolean;
  filterStatus: string | null;
  onFilterChange: (s: string | null) => void;
  query: string;
  onQueryChange: (q: string) => void;
  lastLeadRef: (node: HTMLTableRowElement | null) => void;
}

export default function LeadsTable({ leads, onRowClick, onSortToggle, sortDesc, filterStatus, onFilterChange, query, onQueryChange, lastLeadRef }: Props) {
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="Search name or company"
          className="border rounded px-2 py-1 flex-1"
        />

        <select
          value={filterStatus ?? ''}
          onChange={e => onFilterChange(e.target.value || null)}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Lost</option>
          <option>Converted</option>
        </select>

        <button
          type="button"
          onClick={onSortToggle}
          className="border rounded px-3 py-1"
        >
          Sort score {sortDesc ? '↓' : '↑'}
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
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
                  <td colSpan={6} className="p-4 text-center text-gray-500">No leads found</td>
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
    </div>
  )
}