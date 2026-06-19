import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Goal } from '../../types/goal';
import type { Habit } from '../../types/habit';
import type { HabitLogs } from '../../types/habit';
import { calculateGoalProgressUpToMonth } from '../../utils/goalProgress';

type Props = {
  goals: Goal[];
  habits: Habit[];
  logs: HabitLogs;
  year: number;
};

const COLORS = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b',
  '#ef4444', '#06b6d4', '#84cc16',
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function GoalsProgressChart({ goals, habits, logs, year }: Props) {
  const data = MONTHS.map((monthName, index) => {
    const row: Record<string, string | number> = {
      month: monthName,
    };
  
    goals.forEach((goal) => {
      console.log("goal", goal)
      // True cumulative progress up to this month
      const progress = calculateGoalProgressUpToMonth(
        goal,
        habits,
        logs,
        year,
        index // 0 = Jan, 1 = Feb, etc.
      );
      console.log("progress", progress)
      row[goal.title] = progress;
    });

    return row;
  });

  return (
    <div className="glass-card p-8">
      <h2 className="text-xl font-semibold mb-6">Goal Progress (Cumulative)</h2>

      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value) => [`${value}%`, 'Cumulative Progress']} />
          <Legend />

          {goals.map((goal, index) => (
            <Bar
              key={goal.id}
              dataKey={goal.title}
              fill={COLORS[index % COLORS.length]}
              radius={[5, 5, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-zinc-500 mt-3 text-center">
        Progress is calculated cumulatively. Milestones only count from the month they were achieved.
      </p>
    </div>
  );
}