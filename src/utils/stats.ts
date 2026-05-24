import type { Habit, HabitLogs } from '../types/habit';

export function getHabitCompletionPercentage(
  habit: Habit,
  logs: HabitLogs,
  totalDays: number
) {
  const entries = logs[habit.id] || {};

  const completedDays = Object.values(entries).filter(Boolean).length;

  return Math.round((completedDays / totalDays) * 100);
}