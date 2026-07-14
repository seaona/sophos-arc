import { useState } from 'react';
import type { Supplement } from '../../types/health';

type Props = {
  supplements: Supplement[];
  onUpdate: (id: string, updates: Partial<Supplement>) => void;
  onDelete: (id: string) => void;
};

export default function SupplementList({ supplements, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    frequency: '',
    quantity: '',
  });

  const startEditing = (supplement: Supplement) => {
    setEditingId(supplement.id);
    setEditForm({
      name: supplement.name,
      startDate: supplement.startDate,
      endDate: supplement.endDate || '',
      frequency: supplement.frequency || '',
      quantity: supplement.quantity || '',
    });
  };

  const saveEdit = () => {
    if (!editingId) return;

    onUpdate(editingId, {
      name: editForm.name.trim(),
      startDate: editForm.startDate,
      endDate: editForm.endDate || undefined,
      frequency: editForm.frequency || undefined,
      quantity: editForm.quantity || undefined,
    });

    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  if (supplements.length === 0) {
    return <div className="glass-card p-8 text-center text-zinc-500">No supplements added yet.</div>;
  }

  return (
    <div className="glass-card p-8">
      <h3 className="font-semibold mb-4">Your Supplements</h3>

      {/* Header - matches your current version */}
      <div className="hidden md:grid grid-cols-6 gap-x-4 px-4 pb-2 text-xs font-semibold text-zinc-500 tracking-wide">
        <div>Name</div>
        <div>Start Date</div>
        <div>End Date</div>
        <div>Frequency</div>
        <div>Quantity</div>
        <div>Actions</div>
      </div>

      <div className="space-y-3">
        {supplements.map((supplement) => {
          const isEditing = editingId === supplement.id;

          return (
            <div
              key={supplement.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-1 items-center p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl"
            >
              {/* VIEW MODE */}
              {!isEditing && (
                <>
                  {/* Name - now normal column (no col-span-2) */}
                  <div className="font-medium">{supplement.name}</div>

                  {/* Start Date */}
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {supplement.startDate}
                  </div>

                  {/* End Date */}
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {supplement.endDate ? supplement.endDate : <span className="italic">Ongoing</span>}
                  </div>

                  {/* Frequency */}
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {supplement.frequency || <span className="text-zinc-400">—</span>}
                  </div>

                  {/* Quantity */}
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {supplement.quantity || <span className="text-zinc-400">—</span>}
                  </div>

                  {/* Actions - normal last column */}
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => startEditing(supplement)}
                      className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg"
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => onDelete(supplement.id)}
                      className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}

              {/* EDIT MODE - columns now also match header */}
              {isEditing && (
                <>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="modern-input"
                  />
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                    className="modern-input"
                  />
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                    className="modern-input"
                  />
                  <input
                    type="text"
                    value={editForm.frequency}
                    onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                    placeholder="Frequency"
                    className="modern-input"
                  />
                  <input
                    type="text"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                    placeholder="Quantity"
                    className="modern-input"
                  />

                  {/* Actions in edit mode (last column) */}
                  <div className="flex justify-end gap-2">
                    <button onClick={saveEdit} className="modern-button text-sm px-4 py-1.5">Save</button>
                    <button onClick={cancelEdit} className="text-sm px-4 py-1.5 text-zinc-500 hover:text-zinc-700">Cancel</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}