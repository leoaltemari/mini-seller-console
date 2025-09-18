import { LeadPreferences } from '@models/leads';


interface Props {
  preferences: LeadPreferences;
  onSortToggle: () => void;
  onFilterChange: (s: string | null) => void;
  onQueryChange: (q: string) => void;
}

export default function LeadsTableFilter({
  preferences,
  onSortToggle,
  onFilterChange,
  onQueryChange,
}: Props) {
  return (
    <div className="flex gap-2 mb-3">
      <input
        type="text"
        value={preferences.query}
        onChange={e => onQueryChange(e.target.value)}
        placeholder="Search name or company"
        className="border rounded px-2 py-1 flex-1"
      />

      <select
        value={preferences.filterStatus ?? ''}
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
        Sort score {preferences.sortDesc ? '↓' : '↑'}
      </button>
    </div>
  );
}