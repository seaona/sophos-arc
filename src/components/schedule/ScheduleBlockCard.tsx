import { useState } from 'react';
import type { ScheduleBlock } from '../../types/schedule';

type Props = {
  block: ScheduleBlock;
  onUpdate: (
    id: string,
    updates: Partial<Pick<ScheduleBlock, 'title' | 'startMinutes' | 'durationMinutes' | 'color' | 'day'>>
  ) => void;
  onDelete: (id: string) => void;
};

function minutesToTime(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

export default function ScheduleBlockCard({ block, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(block.title);

  function handleSave() {
    if (title.trim()) {
      onUpdate(block.id, { title: title.trim() });
    }
    setEditing(false);
  }

  return (
    <div
      className="
        h-full rounded-xl px-2 py-1.5 text-left text-xs
        shadow-sm border border-black/5 dark:border-white/10
        flex flex-col justify-between overflow-hidden
        group
      "
      style={{
        backgroundColor: block.color || '#71717a',
        color: '#fff',
      }}
    >
      {editing ? (
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              setTitle(block.title);
              setEditing(false);
            }
          }}
          className="w-full bg-white/20 rounded-lg px-1.5 py-0.5 text-white placeholder-white/70 outline-none text-xs"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="font-medium truncate text-left w-full hover:underline"
        >
          {block.title}
        </button>
      )}

      <div className="flex items-center justify-between gap-1 mt-0.5 opacity-90">
        <span className="truncate">
          {minutesToTime(block.startMinutes)} · {block.durationMinutes}m
        </span>
        <button
          type="button"
          onClick={() => onDelete(block.id)}
          className="
            opacity-0 group-hover:opacity-100 transition-opacity
            w-5 h-5 rounded-md bg-black/20 hover:bg-black/40
            flex items-center justify-center text-[10px]
          "
          title="Delete block"
        >
          ✕
        </button>
      </div>
    </div>
  );
}