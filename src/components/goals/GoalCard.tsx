import type { Goal } from '../../types/goal';
import type { Habit } from '../../types/habit';
import { getHabitProgress } from '../../utils/progress';
import type { HabitLogs } from '../../types/habit';

type Props = {
  goal: Goal;
  habits: Habit[];
  progress: number;
  logs: HabitLogs;
  year: number;
  onDelete: (goalId: string) => void;
};

export default function GoalCard({
  goal,
  habits,
  progress,
  logs,
  year,
  onDelete
}: Props)
{
  return (
    <div
      className="
        glass-card
        p-8
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          mb-6
        "
      >
        <div>
          <h2
            className="
              text-2xl
              font-semibold
              mb-2
            "
          >
            {goal.title}
          </h2>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >
            {habits.length} habit
            {habits.length !== 1
              ? 's'
              : ''}
          </p>
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
            "
          >
            {progress}%
          </span>

          <button
            onClick={() =>
                onDelete(goal.id)
            }
            className="
              text-zinc-500
              hover:text-red-500
              text-lg
              transition-colors
            "
            title="Delete goal"
          >
            🗑️
          </button>
        </div>
      </div>

      {habits.length > 0 ? (
        <div className="space-y-3">
          {habits.map((habit) => {
  const habitProgress =
    getHabitProgress(
      habit.id,
      logs,
      year
    );

  return (
    <div
      key={habit.id}
      className="
        flex
        items-center
        justify-between
        py-2
        border-b
        border-zinc-200
        dark:border-zinc-800
      "
    >
      <span>{habit.name}</span>

      <span
        className="
          text-sm
          font-medium
          text-zinc-500
        "
      >
        {habitProgress}%
      </span>
    </div>
  );
})}
        </div>
      ) : (
        <div
          className="
            text-sm
            text-zinc-500
          "
        >
          No habits linked yet.
        </div>
      )}
    </div>
  );
}