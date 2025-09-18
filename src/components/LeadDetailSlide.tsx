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
  const [draft, setDraft] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Controls the visual state (enter/exit) */
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setDraft(lead ? { ...lead } : null);
    setTimeout(() => setVisible(!!lead));
  }, [lead]);

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

  /** Only will show up if a lead was selected */
  if (!lead || !draft) return null;

  return (
    <div className="fixed inset-0 flex z-50">
      <div
        onClick={onClose}
        className={`
          flex-1 bg-gray-700/[.50] transition-opacity duration-300
          ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      />

      <div
        className={`
          w-full max-w-md bg-white shadow-xl p-4 transform transition-transform duration-300 ease-in-out
          ${visible ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
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
            <button
              type="button"
              className="cursor-pointer px-3 py-1 border rounded"
              onClick={handleSave}
              disabled={saving}
            >
              Save
            </button>

            <button
              type="button"
              className="cursor-pointer px-3 py-1 border rounded"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="button"
              className="cursor-pointer ml-auto px-3 py-1 bg-blue-600 text-white rounded"
              onClick={() => onConvert(draft, draft.company)}
            >
              Convert Lead
            </button>
          </div>

          <div
            role="alert"
            className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-1 transform transition duration-200 ease-out ${
              error ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <p className="pl-2">{error ?? ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
