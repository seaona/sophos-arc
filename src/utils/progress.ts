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

/**
 * Returns the cumulative % progress of a habit from Jan 1 up to the end of a given month.
 */
export function getHabitProgressUpToMonth(
  habitId: string,
  logs: HabitLogs,
  year: number,
  endMonth: number // 0 = January, 11 = December
): number {
  const habitLogs = logs[habitId] || {};
  let completedDays = 0;
  let totalDays = 0;

  // Loop from January (0) to the target month
  for (let m = 0; m <= endMonth; m++) {
    const daysInMonth = new Date(year, m + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      totalDays++;

      const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      if (habitLogs[dateStr]) {
        completedDays++;
      }
    }
  }

  return totalDays === 0 ? 0 : Math.round((completedDays / totalDays) * 100);
}