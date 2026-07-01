// hooks/useHealth.ts
import { useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_HEALTH_METRICS } from '../utils/healthMetrics';
import type { HealthMetric, HealthLog } from '../types/health';

export function useHealth() {
  const [customMetrics, setCustomMetrics] = useLocalStorage<HealthMetric[]>(
    'health-metrics',
    []
  );
  const [logs, setLogs] = useLocalStorage<HealthLog[]>('health-logs', []);

  // Combine default + custom metrics
  const allMetrics = useMemo(() => {
    return [...DEFAULT_HEALTH_METRICS, ...customMetrics];
  }, [customMetrics]);

  // Only active ones
  const activeMetrics = useMemo(() => {
    return allMetrics.filter((m) => m.isActive !== false);
  }, [allMetrics]);

  const dailyMetrics = useMemo(() => {
    return activeMetrics.filter((m) => m.frequency === 'daily');
  }, [activeMetrics]);

  const weeklyMetrics = useMemo(() => {
    return activeMetrics.filter((m) => m.frequency === 'weekly');
  }, [activeMetrics]);

  // ==================== METRIC ACTIONS ====================

  const addCustomMetric = (metric: Omit<HealthMetric, 'id' | 'isActive'>) => {
    const newMetric: HealthMetric = {
      ...metric,
      id: metric.name.toLowerCase().replace(/\s+/g, '-'),
      isActive: true,
    };
    setCustomMetrics((prev) => [...prev, newMetric]);
  };

  /**
   * Deletes a metric completely (works for both custom and default)
   * - Removes all logs for this metric
   * - Removes the metric from customMetrics (if it exists)
   */
  const deleteMetric = (metricId: string) => {
    // Remove all logs belonging to this metric
    setLogs((prev) => prev.filter((log) => log.metricId !== metricId));

    // Remove from custom metrics (if it's a custom one)
    setCustomMetrics((prev) => prev.filter((m) => m.id !== metricId));
  };

  // ==================== LOG ACTIONS ====================

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
    setLogs((prev) =>
      prev.map((log) =>
        log.id === logId ? { ...log, value: newValue } : log
      )
    );
  };

  const deleteLog = (logId: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== logId));
  };

  // ==================== GETTERS ====================

  const getLogsByMetric = (metricId: string) =>
    logs.filter((log) => log.metricId === metricId);

  const getLatestLog = (metricId: string) =>
    [...logs]
      .filter((log) => log.metricId === metricId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];

  // ==================== RETURN ====================

  return {
    metrics: activeMetrics,
    dailyMetrics,
    weeklyMetrics,
    logs,
    addCustomMetric,
    saveLog,
    updateLog,
    deleteLog,
    getLogsByMetric,
    getLatestLog,
    deleteMetric,           // ← Renamed from deleteCustomMetric
  };
}