import MetricLogCard from './MetricLogCard';
import type { HealthMetric, HealthLog } from '../../types/health';

type Props = {
  title: string;
  metrics: HealthMetric[];
  getLatestLog: (metricId: string) => HealthLog | undefined;
  onSave: (metricId: string, value: any) => void;
  onDelete: (metricId: string) => void;
};

export default function MetricLogger({
  title,
  metrics,
  getLatestLog,
  onSave,
  onDelete,
}: Props) {
  if (metrics.length === 0) return null;

  return (
    <div className="glass-card p-8">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricLogCard
            key={metric.id}
            metric={metric}
            latestLog={getLatestLog(metric.id)}
            onSave={(value) => onSave(metric.id, value)}
            onDelete={() => onDelete(metric.id)}
          />
        ))}
      </div>
    </div>
  );
}