import type { Habit, HabitLogs } from '../types/habit';
import HabitRow from './HabitRow';
import { getCalendarDays } from '../utils/dates';

type Props = {
  habits: Habit[];
  logs: HabitLogs;
  currentDate: Date;
  toggleDay: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
};

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HabitGrid({
  habits,
  logs,
  currentDate,
  toggleDay,
  deleteHabit
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = getCalendarDays(year, month);

  return (
    <div className="flex flex-col items-center space-y-10 w-full">
      <div
        className="
          grid
          grid-cols-7
          w-[60vw]
          text-center
          text-sm
          text-zinc-500
          font-medium
        "
      >
        {weekdays.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          days={calendarDays}
          currentDate={currentDate}
          logs={logs}
          toggleDay={toggleDay}
          deleteHabit={deleteHabit}
        />
      ))}
    </div>
  );
}