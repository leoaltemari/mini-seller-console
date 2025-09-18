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
          w-full max-w-md bg-white shadow-xl rounded-l-xl p-6
          transform transition-transform duration-300 ease-in-out
          ${visible ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
          {draft.name}{' '}
          <span className="text-sm text-gray-500">({draft.id})</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="
                w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              "
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="
                w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              "
              value={draft.status}
              onChange={(e) =>
                setDraft({ ...draft, status: e.target.value as LeadStatus })
              }
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
              className="
                cursor-pointer px-4 py-2 text-sm font-medium rounded-lg border border-gray-300
                text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50
              "
              onClick={handleSave}
              disabled={saving}
            >
              Save
            </button>

            <button
              type="button"
              className="
                cursor-pointer px-4 py-2 text-sm font-medium rounded-lg border border-gray-300
                text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50
              "
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="button"
              className="
                cursor-pointer ml-auto px-4 py-2 text-sm font-medium rounded-lg bg-blue-600
                text-white shadow-smhover:bg-blue-700 active:bg-blue-800 disabled:opacity-50
              "
              onClick={() => onConvert(draft, draft.company)}
            >
              Convert Lead
            </button>
          </div>

          <div
            role="alert"
            className={`
              rounded-lg bg-red-50 border border-red-300 text-red-700 px-3 py-2 text-sm transform transition duration-200 ease-out
              ${error ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}
          >
            {error ?? ''}
          </div>
        </div>
      </div>
    </div>
  );
}
