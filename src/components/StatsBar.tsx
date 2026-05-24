import type { Habit, HabitLogs } from '../types/habit';
import { getDaysInMonth, formatDate } from '../utils/dates';

type Props = {
  habits: Habit[];
  logs: HabitLogs;
  currentDate: Date;
};

export default function StatsBar({
  habits,
  logs,
  currentDate
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const totalDays = getDaysInMonth(year, month).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">
          Monthly Progress
        </h2>

        <p className="subtle-text mt-2">
          Habit completion percentage for this month
        </p>
      </div>

      <div className="space-y-6">
        {habits.map((habit) => {
          let completedDays = 0;

          for (let day = 1; day <= totalDays; day++) {
            const date = formatDate(year, month, day);

            if (logs[habit.id]?.[date]) {
              completedDays++;
            }
          }

          const percentage = Math.round(
            (completedDays / totalDays) * 100
          );

          return (
            <div
              key={habit.id}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  {habit.name}
                </span>

                <span className="text-sm text-zinc-500">
                  {percentage}%
                </span>
              </div>

              <div
                className="
                  h-5
                  w-full
                  rounded-full
                  overflow-hidden
                  bg-zinc-200
                  dark:bg-zinc-800
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    transition-all
                    duration-500
                    bg-gradient-to-r
                    from-emerald-400
                    to-emerald-600
                  "
                  style={{
                    width: `${percentage}%`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}