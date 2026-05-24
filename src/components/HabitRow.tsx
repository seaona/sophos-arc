import DayCell from './DayCell';
import type { Habit, HabitLogs } from '../types/habit';
import { formatDate } from '../utils/dates';

type Props = {
  habit: Habit;
  days: (number | null)[];
  currentDate: Date;
  logs: HabitLogs;
  toggleDay: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
};

export default function HabitRow({
  habit,
  days,
  currentDate,
  logs,
  toggleDay,
  deleteHabit
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-between mb-5 w-[60vw]">
        <div className="text-2xl font-semibold tracking-tight">
          {habit.name}
        </div>

        <button
          onClick={() => deleteHabit(habit.id)}
          className="
            h-10
            w-10
            rounded-xl
            flex
            items-center
            justify-center
            bg-white/80
            dark:bg-zinc-900/80
            border
            border-zinc-200
            dark:border-zinc-800
            backdrop-blur-sm
            hover:scale-105
            transition-all
          "
          title="Delete habit"
        >
          🗑️
        </button>
      </div>

      <div
        className="
          grid
          grid-cols-7
          gap-2
          w-[60vw]
        "
      >
        {days.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={index}
                className="
                  h-10
                  rounded-xl
                  bg-zinc-200/70
                  dark:bg-zinc-800/70
                  border
                  border-zinc-200
                  dark:border-zinc-800
                "
              />
            );
          }

          const date = formatDate(year, month, day);

          const completed = logs[habit.id]?.[date] || false;

          return (
            <DayCell
              key={date}
              completed={completed}
              onClick={() => toggleDay(habit.id, date)}
            />
          );
        })}
      </div>
    </div>
  );
}