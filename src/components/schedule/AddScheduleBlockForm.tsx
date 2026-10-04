import { useState, useEffect } from 'react';
import type { DayOfWeek } from '../../types/schedule';

type DayOption = { key: DayOfWeek; label: string };

type Props = {
  days: DayOption[];
  defaultDay: DayOfWeek;
  onAdd: (
    day: DayOfWeek,
    title: string,
    startMinutes: number,
    durationMinutes: number,
    color?: string
  ) => void;
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

export default function AddScheduleBlockForm({
  days,
  defaultDay,
  onAdd,
}: Props) {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState<DayOfWeek>(defaultDay);
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [color, setColor] = useState('#71717a');

  useEffect(() => {
    setDay(defaultDay);
  }, [defaultDay]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(day, title.trim(), timeToMinutes(startTime), duration, color);
    setTitle('');
    setStartTime('09:00');
    setDuration(60);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Block title (e.g. Deep work, Gym...)"
          className="modern-input flex-1 min-w-[180px]"
        />

        <select
          value={day}
          onChange={(e) => setDay(e.target.value as DayOfWeek)}
          className="modern-input w-full sm:w-36"
        >
          {days.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="modern-input w-full sm:w-32"
        />

        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="modern-input w-full sm:w-36"
        >
          <option value={15}>15 min</option>
          <option value={30}>30 min</option>
          <option value={45}>45 min</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
          <option value={180}>3 hours</option>
          <option value={240}>4 hours</option>
        </select>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-12 w-14 rounded-2xl border border-zinc-300 dark:border-zinc-700 cursor-pointer bg-transparent"
          title="Block color"
        />

        <button type="submit" className="modern-button whitespace-nowrap">
          Add Block
        </button>
      </div>
    </form>
  );
}