import type { DayOfWeek, ScheduleBlock } from '../../types/schedule';
import ScheduleBlockCard from './ScheduleBlockCard';

type DayOption = { key: DayOfWeek; label: string };

type Props = {
  days: DayOption[];
  blocks: ScheduleBlock[];
  onDayClick: (day: DayOfWeek) => void;
  onUpdateBlock: (
    id: string,
    updates: Partial<Pick<ScheduleBlock, 'title' | 'startMinutes' | 'durationMinutes' | 'color' | 'day'>>
  ) => void;
  onDeleteBlock: (id: string) => void;
};

/** Visible window: 6:00 – 22:00 (16 hours) */
const START_HOUR = 6;
const END_HOUR = 22;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i
);
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
const ROW_HEIGHT_PX = 48; // per hour

function formatHour(h: number) {
  return `${h.toString().padStart(2, '0')}:00`;
}

export default function ScheduleGrid({
  days,
  blocks,
  onDayClick,
  onUpdateBlock,
  onDeleteBlock,
}: Props) {
  return (
    <div className="min-w-[720px]">
      {/* Header: times + days */}
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: `64px repeat(${days.length}, 1fr)`,
        }}
      >
        <div className="h-10" /> {/* empty corner */}
        {days.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => onDayClick(d.key)}
            className="
              h-10 flex items-center justify-center text-sm font-medium
              text-zinc-700 dark:text-zinc-300
              rounded-t-xl hover:bg-zinc-100 dark:hover:bg-zinc-800
              transition-colors
            "
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div
        className="grid gap-px relative"
        style={{
          gridTemplateColumns: `64px repeat(${days.length}, 1fr)`,
          height: HOURS.length * ROW_HEIGHT_PX,
        }}
      >
        {/* Time labels */}
        <div className="relative">
          {HOURS.map((h) => (
            <div
              key={h}
              className="absolute left-0 right-0 text-xs text-zinc-500 dark:text-zinc-400 pr-2 text-right"
              style={{ top: (h - START_HOUR) * ROW_HEIGHT_PX - 6 }}
            >
              {formatHour(h)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((d) => {
          const dayBlocks = blocks.filter((b) => b.day === d.key);

          return (
            <div
              key={d.key}
              className="
                relative border border-zinc-200 dark:border-zinc-800
                bg-zinc-50/50 dark:bg-zinc-900/40 rounded-b-xl
                hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50
                transition-colors cursor-pointer
              "
              onClick={() => onDayClick(d.key)}
            >
              {/* Hour grid lines */}
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 border-t border-zinc-200/80 dark:border-zinc-800/80"
                  style={{ top: (h - START_HOUR) * ROW_HEIGHT_PX }}
                />
              ))}

              {/* Blocks */}
              {dayBlocks.map((block) => {
                const top =
                  ((block.startMinutes - START_HOUR * 60) / TOTAL_MINUTES) *
                  100;
                const height =
                  (block.durationMinutes / TOTAL_MINUTES) * 100;

                // Clamp so blocks outside visible window still show partially
                if (top + height < 0 || top > 100) return null;

                return (
                  <div
                    key={block.id}
                    className="absolute left-1 right-1 z-10"
                    style={{
                      top: `${Math.max(0, top)}%`,
                      height: `${Math.min(height, 100 - Math.max(0, top))}%`,
                      minHeight: 28,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ScheduleBlockCard
                      block={block}
                      onUpdate={onUpdateBlock}
                      onDelete={onDeleteBlock}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}