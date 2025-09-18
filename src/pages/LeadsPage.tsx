import LeadDetailSlide from '@components/LeadDetailSlide';
import LeadsTable from '@components/LeadsTable';
import LeadsTableFilter from '@components/LeadsTableFilter';
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

  const {
    leads,
    loading,
    error,
    saveLead,
    convertLead,
    prefs,
    setPrefs,
    hasMore,
  } = useFetchLeads(pagination);

  const observer = useRef<IntersectionObserver | null>(null);

  /** handles infinite scroll behaviour */
  const loadMoreLeads = useCallback((node: HTMLTableRowElement | null) => {
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
      .filter(lead => {
        const matchesQuery = !query || lead.name.toLowerCase().includes(query) || lead.company.toLowerCase().includes(query);
        const matchesStatus = !prefs.filterStatus || lead.status === prefs.filterStatus;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => sortByScore(a, b, prefs.sortDesc));
  }, [leads, prefs]);

  if (error)
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg shadow">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h1 className="text-2xl font-semibold text-gray-700 p-5 border-b">
            Leads
          </h1>

          <div className="p-5 space-y-4">
            <LeadsTableFilter
              preferences={prefs}
              onSortToggle={() => setPrefs({ ...prefs, sortDesc: !prefs.sortDesc })}
              onFilterChange={filter => setPrefs({ ...prefs, filterStatus: filter })}
              onQueryChange={query => setPrefs({ ...prefs, query: query })}
            />
            <LeadsTable
              leads={filteredLeads}
              onRowClick={setSelected}
              lastLeadRef={loadMoreLeads}
            />

            {
              loading &&
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            }
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h1 className="text-2xl font-semibold text-gray-700 p-5 border-b">
            Opportunities
          </h1>
          <div className="p-5">
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
  );
}
