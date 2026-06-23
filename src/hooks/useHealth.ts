// hooks/useHealth.ts
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
  const allMetrics = [...DEFAULT_HEALTH_METRICS, ...customMetrics];

  const activeMetrics = allMetrics.filter((m) => m.isActive);

  const dailyMetrics = activeMetrics.filter((m) => m.frequency === 'daily');
  const weeklyMetrics = activeMetrics.filter((m) => m.frequency === 'weekly');

  // Add new custom metric
  const addCustomMetric = (metric: Omit<HealthMetric, 'id' | 'isActive'>) => {
    const newMetric: HealthMetric = {
      ...metric,
      id: metric.name.toLowerCase().replace(/\s+/g, '-'),
      isActive: true,
    };
    setCustomMetrics((prev) => [...prev, newMetric]);
  };

  // Save or update a log
  const saveLog = (newLog: Omit<HealthLog, 'id'>) => {
    setLogs((prev) => {
      const existing = prev.findIndex(
        (log) => log.metricId === newLog.metricId && log.date === newLog.date
      );

      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...newLog };
        return updated;
      }
      return [...prev, { ...newLog, id: crypto.randomUUID() }];
    });
  };

  const getLogsByMetric = (metricId: string) =>
    logs.filter((log) => log.metricId === metricId);

  const getLatestLog = (metricId: string) =>
    [...logs]
      .filter((log) => log.metricId === metricId)
      .sort((a, b) => b.date.localeCompare(a.date))[0];

  return {
    metrics: activeMetrics,
    dailyMetrics,
    weeklyMetrics,
    logs,
    addCustomMetric,
    saveLog,
    getLogsByMetric,
    getLatestLog,
  };
}