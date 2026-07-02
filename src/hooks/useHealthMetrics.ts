// hooks/useHealthMetrics.ts
import { useState, useMemo } from 'react';
import { useHealth } from './useHealth';
import { getCurrentWeekNumber, getWeekNumber } from '../utils/health';

export function useHealthMetrics() {
  const {
    metrics,
    logs: healthLogs,
    dailyMetrics,
    weeklyMetrics,
    getLogsByMetric,
  } = useHealth();

  const [frequencyFilter, setFrequencyFilter] = useState<"all" | "daily" | "weekly">("all");

  const today = new Date().toISOString().split('T')[0];
  const currentWeek = getCurrentWeekNumber();
  const currentYear = new Date().getFullYear();

  // ==================== REACTIVE LOGGED STATUS ====================
  const loggedTodayIds = useMemo(() => {
    return new Set(healthLogs.filter(log => log.date === today).map(log => log.metricId));
  }, [healthLogs, today]);

  const loggedThisWeekIds = useMemo(() => {
    return new Set(
      healthLogs
        .filter(log => {
          const d = new Date(log.date);
          return getWeekNumber(d) === currentWeek && d.getFullYear() === currentYear;
        })
        .map(log => log.metricId)
    );
  }, [healthLogs, currentWeek, currentYear]);

  const isLoggedToday = (metricId: string) => loggedTodayIds.has(metricId);
  const isLoggedThisWeek = (metricId: string) => loggedThisWeekIds.has(metricId);

  // ==================== DERIVED VALUES ====================
  const dailyProgress = `${dailyMetrics.filter(m => isLoggedToday(m.id)).length}/${dailyMetrics.length}`;
  const weeklyProgress = `${weeklyMetrics.filter(m => isLoggedThisWeek(m.id)).length}/${weeklyMetrics.length}`;

  const filteredLogs = useMemo(() => {
    return [...healthLogs]
      .filter(log => {
        if (frequencyFilter === "all") return true;
        const metric = metrics.find(m => m.id === log.metricId);
        return metric?.frequency === frequencyFilter;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [healthLogs, frequencyFilter, metrics]);

  const unloggedDaily = useMemo(() => {
    return dailyMetrics.filter(m => !isLoggedToday(m.id));
  }, [dailyMetrics, loggedTodayIds]);

  const unloggedWeekly = useMemo(() => {
    return weeklyMetrics.filter(m => !isLoggedThisWeek(m.id));
  }, [weeklyMetrics, loggedThisWeekIds]);

  return {
    frequencyFilter,
    setFrequencyFilter,
    filteredLogs,
    isLoggedToday,
    isLoggedThisWeek,
    dailyProgress,
    weeklyProgress,
    unloggedDaily,
    unloggedWeekly,
  };
}