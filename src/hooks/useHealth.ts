// hooks/useHealth.ts
import { useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_HEALTH_METRICS } from '../utils/healthMetrics';
import { getCurrentWeekNumber, getWeekNumber } from '../utils/health';
import type { HealthMetric, HealthLog } from '../types/health';

export function useHealth() {
  const [customMetrics, setCustomMetrics] = useLocalStorage<HealthMetric[]>('health-metrics', []);
  const [logs, setLogs] = useLocalStorage<HealthLog[]>('health-logs', []);

  const [frequencyFilter, setFrequencyFilter] = useState<"all" | "daily" | "weekly">("all");

  const allMetrics = useMemo(() => [...DEFAULT_HEALTH_METRICS, ...customMetrics], [customMetrics]);
  const activeMetrics = useMemo(() => allMetrics.filter((m) => m.isActive !== false), [allMetrics]);

  const dailyMetrics = useMemo(() => activeMetrics.filter((m) => m.frequency === 'daily'), [activeMetrics]);
  const weeklyMetrics = useMemo(() => activeMetrics.filter((m) => m.frequency === 'weekly'), [activeMetrics]);

  const today = new Date().toISOString().split('T')[0];
  const currentWeek = getCurrentWeekNumber();
  const currentYear = new Date().getFullYear();

  // Fixed: use `logs` instead of `healthLogs`
  const loggedTodayIds = useMemo(() => {
    return new Set(logs.filter(log => log.date === today).map(log => log.metricId));
  }, [logs, today]);

  const loggedThisWeekIds = useMemo(() => {
    return new Set(
      logs.filter(log => {
        const d = new Date(log.date);
        return getWeekNumber(d) === currentWeek && d.getFullYear() === currentYear;
      }).map(log => log.metricId)
    );
  }, [logs, currentWeek, currentYear]);

  const isLoggedToday = (metricId: string) => loggedTodayIds.has(metricId);
  const isLoggedThisWeek = (metricId: string) => loggedThisWeekIds.has(metricId);

  const dailyProgress = `${dailyMetrics.filter(m => isLoggedToday(m.id)).length}/${dailyMetrics.length}`;
  const weeklyProgress = `${weeklyMetrics.filter(m => isLoggedThisWeek(m.id)).length}/${weeklyMetrics.length}`;

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        if (frequencyFilter === "all") return true;
        const metric = activeMetrics.find((m) => m.id === log.metricId);
        return metric?.frequency === frequencyFilter;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [logs, frequencyFilter, activeMetrics]);

  const unloggedDaily = useMemo(() => dailyMetrics.filter(m => !isLoggedToday(m.id)), [dailyMetrics, loggedTodayIds]);
  const unloggedWeekly = useMemo(() => weeklyMetrics.filter(m => !isLoggedThisWeek(m.id)), [weeklyMetrics, loggedThisWeekIds]);

  // ==================== ACTIONS ====================

  const addCustomMetric = (metric: Omit<HealthMetric, 'id' | 'isActive'>) => {
    const newMetric: HealthMetric = {
      ...metric,
      id: metric.name.toLowerCase().replace(/\s+/g, '-'),
      isActive: true,
    };
    setCustomMetrics((prev) => [...prev, newMetric]);
  };

  const saveLog = (newLog: Omit<HealthLog, 'id'>) => {
    setLogs((prev) => {
      const existingIndex = prev.findIndex(
        (log) => log.metricId === newLog.metricId && log.date === newLog.date
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newLog };
        return updated;
      }
      return [...prev, { ...newLog, id: crypto.randomUUID() }];
    });
  };

  const updateLog = (logId: string, newValue: any) => {
    setLogs((prev) => prev.map((log) => log.id === logId ? { ...log, value: newValue } : log));
  };

  const deleteLog = (logId: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== logId));
  };

  const deleteMetric = (metricId: string) => {
    setLogs((prev) => prev.filter((log) => log.metricId !== metricId));
    setCustomMetrics((prev) => prev.filter((m) => m.id !== metricId));
  };

  const getLogsByMetric = (metricId: string) => logs.filter((log) => log.metricId === metricId);

  const getLatestLog = (metricId: string) =>
    [...logs]
      .filter((log) => log.metricId === metricId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];

  return {
    metrics: activeMetrics,
    dailyMetrics,
    weeklyMetrics,
    logs,
    frequencyFilter,
    setFrequencyFilter,
    filteredLogs,
    isLoggedToday,
    isLoggedThisWeek,
    dailyProgress,
    weeklyProgress,
    unloggedDaily,
    unloggedWeekly,
    addCustomMetric,
    saveLog,
    updateLog,
    deleteLog,
    deleteMetric,
    getLogsByMetric,
    getLatestLog,
  };
}