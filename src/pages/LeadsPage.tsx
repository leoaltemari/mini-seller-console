import LeadDetailSlide from '@components/LeadDetailSlide';
import LeadsTable from '@components/LeadsTable';
import OpportunitiesTable from '@components/OpportunitiesTable';
import { useFetchLeads } from '@hooks/useFetchLeads';
import { Lead } from '@models/leads';

import { useCallback, useMemo, useRef, useState } from 'react';


function sortByScore(a: Lead, b: Lead, desc: boolean) {
  return desc ? b.score - a.score : a.score - b.score;
}

export default function LeadsPage() {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20 });

  const { leads, loading, error, saveLead, convertLead, prefs, setPrefs, hasMore } = useFetchLeads(pagination);

  const observer = useRef<IntersectionObserver | null>(null);

  /** handles infinity scroll behaviour */
  const lastLeadRef = useCallback((node: HTMLTableRowElement | null) => {
    if (loading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPagination(prev => ({ ...prev, page: prev.page + 1 }));
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore]);

  const filteredLeads = useMemo(() => {
    if (!leads) return [];

    const query = (prefs.query || '').toLowerCase();

    return leads
      .filter(l => {
        const matchesQuery = !query || l.name.toLowerCase().includes(query) || l.company.toLowerCase().includes(query);
        const matchesStatus = !prefs.filterStatus || l.status === prefs.filterStatus;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => sortByScore(a, b, prefs.sortDesc));
  }, [leads, prefs]);

  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="bg-gray-50 p-6">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded shadow">
          <h1 className="text-2xl p-4 border-b">Leads</h1>

          <LeadsTable
            leads={filteredLeads}
            onRowClick={setSelected}
            onSortToggle={() => setPrefs({ ...prefs, sortDesc: !prefs.sortDesc })}
            sortDesc={prefs.sortDesc}
            filterStatus={prefs.filterStatus}
            onFilterChange={filter => setPrefs({ ...prefs, filterStatus: filter })}
            query={prefs.query}
            onQueryChange={query => setPrefs({ ...prefs, query: query })}
            lastLeadRef={lastLeadRef}
          />

          {loading && <div className="p-4 text-center">Loading more leads...</div>}
        </div>

        <div className="bg-white rounded shadow">
          <h1 className="text-2xl p-4 border-b">Opportunities</h1>
          <div className="p-4">
            <OpportunitiesTable />
          </div>
        </div>
      </div>

      <LeadDetailSlide
        lead={selected}
        onClose={() => setSelected(null)}
        onSave={saveLead}
        onConvert={convertLead}
      />
    </div>
  )
}
