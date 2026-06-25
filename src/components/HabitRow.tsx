import DayCell from './DayCell';
import type { Habit, HabitLogs } from '../types/habit';
import { formatDate } from '../utils/dates';
import { getHabitProgressForMonth } from '../utils/progress';

type Props = {
  habit: Habit;
  days: (number | null)[];
  currentDate: Date;
  logs: HabitLogs;
  toggleDay: (
    habitId: string,
    date: string
  ) => void;
  deleteHabit: (
    habitId: string
  ) => void;
};

export default function HabitRow({
  habit,
  days,
  currentDate,
  logs,
  toggleDay,
}: Props) {
  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const monthlyProgress =
    getHabitProgressForMonth(
      habit.id,
      logs,
      year,
      month
    );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-between mb-5 w-full">
        <div className="text-2xl font-semibold tracking-tight">
          {habit.name}
        </div>

        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <span
            className="
              text-xl
              font-semibold
              text-emerald-600
              dark:text-emerald-400
            "
          >
            {monthlyProgress}%
          </span>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-7
          gap-2
          w-full
        "
      >
        {days.map(
          (day, index) => {
            if (
              day === null
            ) {
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

            const date =
              formatDate(
                year,
                month,
                day
              );

            const completed =
              logs[habit.id]?.[
                date
              ] || false;

            return (
              <DayCell
                key={date}
                completed={
                  completed
                }
                onClick={() =>
                  toggleDay(
                    habit.id,
                    date
                  )
                }
              />
            );
          }
        )}
      </div>
    </div>
  );
}