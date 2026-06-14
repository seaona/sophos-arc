import type { Goal } from '../../types/goal';
import type { Habit, HabitLogs } from '../../types/habit';

import { getHabitProgress } from '../../utils/progress';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';


type Props = {
  goals: Goal[];
  habits: Habit[];
  logs: HabitLogs;
  year: number;
};

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
];

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
];

export default function GoalsProgressChart({
  goals,
  habits,
  logs,
  year
}: Props) {
  const data = MONTHS.map((month, index) => {
    const row: Record<string, string | number> = {
      month
    };

    goals.forEach((goal) => {
      const goalHabits = habits.filter(
        (habit) =>
          habit.goalId === goal.id
      );

      const progress =
        goalHabits.length === 0
          ? 0
          : Math.round(
              goalHabits.reduce(
                (sum, habit) =>
                  sum +
                  getHabitProgress(
                    habit.id,
                    logs,
                    year
                  ),
                0
              ) / goalHabits.length
            );

      row[goal.title] = progress;
    });

    return row;
  });

  return (
    <div className="glass-card p-8">
      <h2 className="text-xl font-semibold mb-6">
        Goal Progress
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="month" />

          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />

          <Tooltip
            formatter={(value) => [
              `${value}%`,
              'Progress'
            ]}
          />

          <Legend />

          {goals.map(
            (goal, index) => (
              <Bar
                key={goal.id}
                dataKey={goal.title}
                fill={
                  COLORS[
                    index %
                      COLORS.length
                  ]
                }
                radius={[
                  6,
                  6,
                  0,
                  0
                ]}
              />
            )
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}