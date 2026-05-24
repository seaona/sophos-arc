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