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
    <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
      <input
        type="text"
        value={preferences.query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search name or company..."
        className="
          flex-1 min-w-[180px] px-3 py-2 border border-gray-300 rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
        "
      />

      <div className="flex gap-3 w-full sm:w-auto">
        <select
          value={preferences.filterStatus ?? ''}
          onChange={(e) => onFilterChange(e.target.value || null)}
          className="
            cursor-pointer px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500
            w-1/2 sm:w-auto
          "
        >
          <option value="">All Statuses</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Lost</option>
          <option>Converted</option>
        </select>

        <button
          type="button"
          onClick={onSortToggle}
          className="
            cursor-pointer px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg
            shadow-sm hover:bg-blue-700 active:bg-blue-800 focus:outline-none
            w-1/2 sm:w-auto
          "
        >
          Sort Score {preferences.sortDesc ? '↓' : '↑'}
        </button>
      </div>
    </div>
  );
}
