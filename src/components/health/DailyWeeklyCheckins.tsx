import type { HealthMetric } from '../../types/health';

type Props = {
  dailyMetrics: HealthMetric[];
  weeklyMetrics: HealthMetric[];
  isLoggedToday: (metricId: string) => boolean;
  isLoggedThisWeek: (metricId: string) => boolean;
  onSave: (metricId: string, value: number) => void;
  getLatestLog: (metricId: string) => any;
};

export default function DailyWeeklyCheckins({
  dailyMetrics = [],        // ← Add default value
  weeklyMetrics = [],  
  isLoggedToday,
  isLoggedThisWeek,
  onSave,
  getLatestLog,
}: Props) {
  const renderMetricRow = (metric: HealthMetric, isDaily: boolean) => {
    const logged = isDaily ? isLoggedToday(metric.id) : isLoggedThisWeek(metric.id);
    const latestLog = getLatestLog(metric.id);

    return (
      <div
        key={metric.id}
        className={`flex items-center justify-between gap-4 p-4 rounded-2xl transition-all ${
          logged 
            ? 'bg-zinc-100 dark:bg-zinc-800/70 opacity-80' 
            : 'bg-zinc-50 dark:bg-zinc-800/60'
        }`}
      >
        <div className="font-medium">{metric.name}</div>

        <div className="flex items-center gap-3">
          {logged ? (
            // Already logged - show value (grayed)
            <div className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 min-w-[120px] text-center">
              {typeof latestLog?.value === 'object' 
                ? `${latestLog.value.systolic}/${latestLog.value.diastolic}` 
                : latestLog?.value}
            </div>
          ) : (
            // Not logged yet - show input
            <>
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
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                  const value = Number(input?.value);
                  if (value) onSave(metric.id, value);
                }}
                className="modern-button whitespace-nowrap px-5"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="text-xl font-semibold mb-6">Today's & This Week's Check-ins</h2>

      {/* Daily Section */}
      <div className="mb-8">
        <h3 className="font-semibold text-sm text-zinc-500 tracking-wide mb-3">DAILY</h3>
        <div className="space-y-2">
          {dailyMetrics.length > 0 ? (
            dailyMetrics.map((metric) => renderMetricRow(metric, true))
          ) : (
            <p className="text-sm text-zinc-500">No daily metrics yet.</p>
          )}
        </div>
      </div>

      {/* Weekly Section */}
      <div>
        <h3 className="font-semibold text-sm text-zinc-500 tracking-wide mb-3">WEEKLY</h3>
        <div className="space-y-2">
          {weeklyMetrics.length > 0 ? (
            weeklyMetrics.map((metric) => renderMetricRow(metric, false))
          ) : (
            <p className="text-sm text-zinc-500">No weekly metrics yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}