import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import ScheduleGrid from '../components/schedule/ScheduleGrid';
import AddScheduleBlockForm from '../components/schedule/AddScheduleBlockForm';
import { useSchedule } from '../hooks/useSchedule';
import type { DayOfWeek } from '../types/schedule';

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

export default function SchedulePage() {
  const { blocks, addBlock, updateBlock, deleteBlock } = useSchedule();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Weekly Schedule
        </h2>
        <p className="subtle-text mt-1">
          Build your ideal week. Click a day column or use the form to add blocks.
        </p>
      </div>

      <div className="glass-card p-6 mb-8">
        <AddScheduleBlockForm
          days={DAYS}
          defaultDay={selectedDay ?? 'monday'}
          onAdd={(day, title, startMinutes, durationMinutes, color) => {
            addBlock(day, title, startMinutes, durationMinutes, color);
            setSelectedDay(null);
          }}
        />
      </div>

      <div className="glass-card p-4 sm:p-6 overflow-x-auto">
        <ScheduleGrid
          days={DAYS}
          blocks={blocks}
          onDayClick={(day) => setSelectedDay(day)}
          onUpdateBlock={updateBlock}
          onDeleteBlock={deleteBlock}
        />
      </div>
    </AppLayout>
  );
}