export function getDaysInMonth(year: number, month: number) {
  const days = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: days }, (_, i) => i + 1);
}

export function getCalendarDays(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // JS:
  // Sunday = 0
  // Monday = 1
  // ...
  // Saturday = 6

  const firstDay = new Date(year, month, 1).getDay();

  // Convert so Monday = 0
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;

  const calendar: (number | null)[] = [];

  // Empty cells before month starts
  for (let i = 0; i < mondayOffset; i++) {
    calendar.push(null);
  }

  // Real days
  for (let day = 1; day <= daysInMonth; day++) {
    calendar.push(day);
  }

  return calendar;
}

export function formatDate(
  year: number,
  month: number,
  day: number
) {
  return new Date(year, month, day)
    .toISOString()
    .split('T')[0];
}

/** Split calendar days into weeks of 7 (Mon–Sun). Pads trailing nulls. */
export function getCalendarWeeks(
  year: number,
  month: number
): (number | null)[][] {
  const days = getCalendarDays(year, month);
  const weeks: (number | null)[][] = [];

  for (let i = 0; i < days.length; i += 7) {
    const week = days.slice(i, i + 7);
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return weeks;
}

/**
 * Monday of the week containing this date, as "YYYY-MM-DD".
 * day can be null for padding cells — pass the first in-month day of the week instead.
 */
export function getWeekId(
  year: number,
  month: number,
  day: number
): string {
  const d = new Date(year, month, day);
  const jsDay = d.getDay(); // 0=Sun
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
  const monday = new Date(year, month, day + mondayOffset);
  return formatDate(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate()
  );
}