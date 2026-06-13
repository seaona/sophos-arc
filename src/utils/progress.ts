import type { HabitLogs } from '../types/habit';

export function getHabitProgress(
  habitId: string,
  logs: HabitLogs,
  year: number
) {
  const habitLogs = logs[habitId] || {};

  const today = new Date();

  const yearStart = new Date(
    year,
    0,
    1
  );

  const yearEnd =
    year === today.getFullYear()
      ? today
      : new Date(year, 11, 31);

  const elapsedDays =
    Math.floor(
      (yearEnd.getTime() -
        yearStart.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const completedDays =
    Object.entries(habitLogs).filter(
      ([date, value]) =>
        value &&
        date.startsWith(`${year}-`)
    ).length;

  return Math.round(
    (completedDays /
      Math.max(elapsedDays, 1)) *
      100
  );
}

export function getHabitProgressForMonth(
  habitId: string,
  logs: HabitLogs,
  year: number,
  month: number
) {
  const habitLogs = logs[habitId] || {};

  const monthPrefix = `${year}-${String(
    month + 1
  ).padStart(2, '0')}-`;

  const completedDays =
    Object.entries(habitLogs).filter(
      ([date, value]) =>
        value &&
        date.startsWith(monthPrefix)
    ).length;

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  return Math.round(
    (completedDays / daysInMonth) *
      100
  );
}