import type { Habit, HabitLogs } from '../types/habit';
import type { Goal } from '../types/goal';

import HabitRow from './HabitRow';
import { getCalendarDays } from '../utils/dates';
import { getHabitProgress } from '../utils/progress';

type Props = {
  goals: Goal[];
  habits: Habit[];
  logs: HabitLogs;
  currentDate: Date;
  toggleDay: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
};

export default function HabitGrid({
  goals,
  habits,
  logs,
  currentDate,
  toggleDay,
  deleteHabit
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = getCalendarDays(
    year,
    month
  );

  const unassignedHabits =
    habits.filter(
      (habit) => !habit.goalId
    );

  return (
    <div className="flex flex-col gap-10 w-full">
      {goals.map((goal) => {
        const goalHabits =
          habits.filter(
            (habit) =>
              habit.goalId === goal.id
          );

        return (
          <div
            key={goal.id}
            className="
              glass-card
              p-8
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                mb-8
              "
            >
              <h2
                className="
                  text-2xl
                  font-semibold
                "
              >
                {goal.title}
              </h2>

              <span
                className="
                  text-lg
                  font-medium
                  text-emerald-600
                "
              >
              </span>
            </div>

            <div className="space-y-8">
              {goalHabits.map(
                (habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    days={calendarDays}
                    currentDate={
                      currentDate
                    }
                    logs={logs}
                    toggleDay={
                      toggleDay
                    }
                    deleteHabit={
                      deleteHabit
                    }
                    progress={getHabitProgress(
                      habit.id,
                      logs,
                      year
                    )}
                  />
                )
              )}
            </div>
          </div>
        );
      })}

      {unassignedHabits.length >
        0 && (
        <div
          className="
            glass-card
            p-8
          "
        >
          <h2
            className="
              text-2xl
              font-semibold
              mb-8
            "
          >
            Unassigned Habits
          </h2>

          <div className="space-y-8">
            {unassignedHabits.map(
              (habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  days={calendarDays}
                  currentDate={
                    currentDate
                  }
                  logs={logs}
                  toggleDay={
                    toggleDay
                  }
                  deleteHabit={
                    deleteHabit
                  }
                  progress={getHabitProgress(
                    habit.id,
                    logs,
                    year
                  )}
                />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}