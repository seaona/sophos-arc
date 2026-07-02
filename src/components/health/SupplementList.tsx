import { useState } from 'react';
import type { Supplement } from '../../types/health';

type Props = {
  supplements: Supplement[];
  onUpdate: (id: string, updates: Partial<Supplement>) => void;
  onDelete: (id: string) => void;
};

const COLORS = [
  '#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', 
  '#ef4444', '#22c55e', '#ec4899', '#06b6d4'
];

export default function SupplementList({ supplements, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', startDate: '', endDate: '' });

  const getColor = (index: number) => COLORS[index % COLORS.length];

  const startEditing = (supplement: Supplement) => {
    setEditingId(supplement.id);
    setEditForm({
      name: supplement.name,
      startDate: supplement.startDate,
      endDate: supplement.endDate || '',
    });
  };

  const saveEdit = () => {
    if (!editingId) return;

    onUpdate(editingId, {
      name: editForm.name.trim(),
      startDate: editForm.startDate,
      endDate: editForm.endDate || undefined,
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

      <div className="space-y-3">
        {supplements.map((supplement, index) => {
          const isEditing = editingId === supplement.id;
          const color = getColor(index);
          const isActive = !supplement.endDate;

          return (
            <div
              key={supplement.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl"
            >
              {isEditing ? (
                // Edit Mode
                <div className="flex flex-col md:flex-row gap-3 flex-1">
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="modern-input flex-1" />
                  <input type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} className="modern-input" />
                  <input type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} className="modern-input" />
                </div>
              ) : (
                // View Mode
                <div className="flex items-center gap-3 flex-1">
                  {/* Color indicator */}
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: color }} 
                  />
                  <div>
                    <div className="font-medium">{supplement.name}</div>
                    <div className="text-sm text-zinc-500">
                      {supplement.startDate} 
                      {supplement.endDate ? ` → ${supplement.endDate}` : ' (Ongoing)'}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={saveEdit} className="modern-button text-sm px-4">Save</button>
                    <button onClick={cancelEdit} className="text-sm px-4 text-zinc-500 hover:text-zinc-700">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(supplement)} className="text-sm px-3 py-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg">Edit</button>
                    <button onClick={() => onDelete(supplement.id)} className="text-sm px-3 py-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">Delete</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}