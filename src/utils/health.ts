import type { HealthLog } from '../types/health';

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getCurrentWeekNumber(): number {
  const date = new Date();
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getWeekRange(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export function prepareDailyChartData(logs: HealthLog[], metricId: string) {
  return logs
    .filter((log) => log.metricId === metricId)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map((log) => ({
      date: log.date,
      value: typeof log.value === 'number' ? log.value : 0,
    }));
}

export function prepareWeeklyChartData(logs: HealthLog[], metricId: string) {
  const filteredLogs = logs
    .filter((log) => log.metricId === metricId)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (filteredLogs.length === 0) return [];

  const weeklyData: Record<number, { week: string; value: number }> = {};

  filteredLogs.forEach((log) => {
    const date = new Date(log.date);
    const weekNumber = getWeekNumber(date);
    const weekLabel = `W${weekNumber}`;

    if (typeof log.value === 'number') {
      weeklyData[weekNumber] = {
        week: weekLabel,
        value: log.value,
      };
    }
  });

  return Object.keys(weeklyData)
    .map(Number)
    .sort((a, b) => a - b)
    .map((weekNum) => weeklyData[weekNum]);
}