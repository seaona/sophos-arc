import { useState, useRef, useEffect } from 'react';
import type { ScheduleBlock } from '../../types/schedule';

type Props = {
  block: ScheduleBlock;
  onUpdate: (
    id: string,
    updates: Partial<
      Pick<
        ScheduleBlock,
        'title' | 'startMinutes' | 'durationMinutes' | 'color' | 'day'
      >
    >
  ) => void;
  onDelete: (id: string) => void;
};

function minutesToTime(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

export default function ScheduleBlockCard({
  block,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(block.title);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Keep local title in sync if block changes from outside
  useEffect(() => {
    setTitle(block.title);
  }, [block.title]);

  // Close expanded popover when clicking outside
  useEffect(() => {
    if (!expanded) return;

    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  function handleSave() {
    if (title.trim()) {
      onUpdate(block.id, { title: title.trim() });
    } else {
      setTitle(block.title);
    }
    setEditing(false);
  }

  const timeLabel = `${minutesToTime(block.startMinutes)} · ${block.durationMinutes}m`;
  const fullLabel = `${block.title} (${timeLabel})`;

  return (
    <div
      ref={cardRef}
      className="
        relative h-full rounded-xl px-2 py-1.5 text-left text-xs
        shadow-sm border border-black/5 dark:border-white/10
        flex flex-col justify-between overflow-visible
        group
      "
      style={{
        backgroundColor: block.color || '#71717a',
        color: '#fff',
      }}
      title={fullLabel}
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
          onClick={() => setExpanded((v) => !v)}
          onDoubleClick={() => {
            setExpanded(false);
            setEditing(true);
          }}
          className="font-medium truncate text-left w-full hover:underline"
        >
          {block.title}
        </button>
      )}

      <div className="flex items-center justify-between gap-1 mt-0.5 opacity-90">
        <span className="truncate">{timeLabel}</span>
        <button
          type="button"
          onClick={() => onDelete(block.id)}
          className="
            opacity-0 group-hover:opacity-100 transition-opacity
            w-5 h-5 rounded-md bg-black/20 hover:bg-black/40
            flex items-center justify-center text-[10px] shrink-0
          "
          title="Delete block"
        >
          ✕
        </button>
      </div>

      {/* Full name popover on click */}
      {expanded && !editing && (
        <div
          className="
            absolute left-0 right-0 top-full mt-1 z-30
            rounded-xl px-3 py-2 text-xs font-medium
            bg-zinc-900 dark:bg-zinc-100
            text-white dark:text-zinc-900
            shadow-lg border border-zinc-700 dark:border-zinc-300
            whitespace-normal break-words
          "
          style={{ minWidth: 'max(100%, 120px)' }}
        >
          <div className="font-semibold">{block.title}</div>
          <div className="opacity-80 mt-0.5">{timeLabel}</div>
          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              setEditing(true);
            }}
            className="mt-2 text-[10px] underline opacity-80 hover:opacity-100"
          >
            Edit title
          </button>
        </div>
      )}
    </div>
  );
}