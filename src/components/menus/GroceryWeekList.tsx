import { useState } from 'react';
import type { GroceryItem, Supermarket } from '../../types/menu';
import { SUPERMARKETS } from '../../types/menu';

type Props = {
  weekId: string;
  items: GroceryItem[];
  onAdd: (weekId: string, name: string, supermarket: Supermarket) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function GroceryWeekList({
  weekId,
  items,
  onAdd,
  onToggle,
  onDelete,
}: Props) {
  const [name, setName] = useState('');
  const [supermarket, setSupermarket] = useState<Supermarket>('mercadona');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(weekId, name, supermarket);
    setName('');
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
        Grocery list
      </h4>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item to buy…"
          className="modern-input flex-1"
        />
        <select
          value={supermarket}
          onChange={(e) => setSupermarket(e.target.value as Supermarket)}
          className="modern-input w-full sm:w-44"
        >
          {SUPERMARKETS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="modern-button whitespace-nowrap">
          Add
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">No items yet for this week.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const market = SUPERMARKETS.find((s) => s.id === item.supermarket);

            return (
              <li
                key={item.id}
                className="
                  flex items-center gap-3 px-3 py-2 rounded-xl
                  bg-zinc-50 dark:bg-zinc-900/60
                  border border-zinc-200 dark:border-zinc-800
                "
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => onToggle(item.id)}
                  className="h-4 w-4 rounded accent-zinc-900 dark:accent-zinc-100 shrink-0"
                />
                <span
                  className={`flex-1 text-sm min-w-0 truncate ${
                    item.checked
                      ? 'line-through text-zinc-400'
                      : 'text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  {item.name}
                </span>
                <span
                  className={`
                    text-xs px-2 py-0.5 rounded-lg font-medium shrink-0
                    ${market?.badgeClass ?? 'bg-zinc-200 text-zinc-600'}
                  `}
                >
                  {market?.label ?? item.supermarket}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="text-zinc-400 hover:text-red-500 text-sm px-1 shrink-0"
                  title="Remove"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}