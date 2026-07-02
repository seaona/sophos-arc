import type { HealthMetric } from '../../types/health';

type Props = {
  metrics: HealthMetric[];
  onSave: (metricId: string, value: number) => void;
};

export default function WeeklyMetricsLogger({ metrics, onSave }: Props) {
  if (metrics.length === 0) return null;

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="text-xl font-semibold mb-6">Log Weekly Metrics</h2>
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-center justify-between gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl"
          >
            <div className="font-medium">{metric.name}</div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="Value"
                className="modern-input w-28 text-center"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = Number(e.currentTarget.value);
                    if (value) onSave(metric.id, value);
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = (e.currentTarget.parentElement as HTMLElement).querySelector('input') as HTMLInputElement;
                  const value = Number(input?.value);
                  if (value) onSave(metric.id, value);
                }}
                className="modern-button whitespace-nowrap px-5"
              >
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}