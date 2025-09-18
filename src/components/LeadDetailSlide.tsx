import { Lead, LeadStatus } from '@models/leads';
import { isValidEmail } from '@utils/validateEmail';

import { useEffect, useState } from 'react';


interface Props {
  lead: Lead | null;
  onClose: () => void;
  onSave: (updated: Lead) => Promise<void>;
  onConvert: (lead: Lead, accountName?: string, amount?: number) => void;
}

export default function LeadDetailSlide({ lead, onClose, onSave, onConvert }: Props) {
  const [draft, setDraft] = useState<Lead | null>(lead);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Makes re-render to display this component every time a lead changes */
  useEffect(() => setDraft(lead ? { ...lead } : null), [lead]);

  /** Only will show up if a lead was selected */
  if (!lead || !draft) return null;

  async function handleSave(): Promise<void> {
    setError(null);

    if (!draft || !isValidEmail(draft.email)) {
      setError('Invalid email format');
      return;
    }

    setSaving(true);

    try {
      await onSave(draft);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 flex">
      <div className="flex-1 bg-gray-700/[.50]" onClick={onClose} />

      <div className="w-full max-w-md bg-white shadow-xl p-4">
        <h2 className="text-xl mb-2">
          {draft.name} <span className="text-sm text-gray-500">({draft.id})</span>
        </h2>

        <div className="space-y-2">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              className="w-full border rounded px-2 py-1"
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm">Status</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as LeadStatus })}
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Lost</option>
              <option>Converted</option>
            </select>
          </div>

          <div className="pt-2 flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={handleSave} disabled={saving}>
              Save
            </button>

            <button className="px-3 py-1 border rounded" onClick={onClose} disabled={saving}>
              Cancel
            </button>

            <button
              className="ml-auto px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => onConvert(draft, draft.company)}
            >
              Convert Lead
            </button>
          </div>



          {
            error &&
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-1" role="alert">
              <p className="pl-2">{error}</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
}