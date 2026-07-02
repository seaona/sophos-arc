import type { HealthMetric } from '../../types/health';

type Props = {
  dailyMetrics: HealthMetric[];
  weeklyMetrics: HealthMetric[];
  isLoggedToday: (metricId: string) => boolean;
  isLoggedThisWeek: (metricId: string) => boolean;
};

export default function MetricStatusOverview({
  dailyMetrics = [],           // ← Add default empty array
  weeklyMetrics = [],          // ← Add default empty array
  isLoggedToday,
  isLoggedThisWeek,
}: Props) {
  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="text-xl font-semibold mb-6">Today's & This Week's Status</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Daily Metrics */}
        <div>
          <h3 className="font-semibold text-sm text-zinc-500 tracking-wide mb-4">DAILY METRICS</h3>
          <div className="space-y-2">
            {dailyMetrics.length > 0 ? (
              dailyMetrics.map((metric) => {
                const logged = isLoggedToday(metric.id);
                return (
                  <div key={metric.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
                    <span className="font-medium">{metric.name}</span>
                    <span className={logged ? "text-emerald-600 font-medium" : "text-amber-600"}>
                      {logged ? "✓ Logged today" : "Not logged yet"}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-zinc-500">No daily metrics yet.</p>
            )}
          </div>
        </div>

        {/* Weekly Metrics */}
        <div>
          <h3 className="font-semibold text-sm text-zinc-500 tracking-wide mb-4">WEEKLY METRICS</h3>
          <div className="space-y-2">
            {weeklyMetrics.length > 0 ? (
              weeklyMetrics.map((metric) => {
                const logged = isLoggedThisWeek(metric.id);
                return (
                  <div key={metric.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl">
                    <span className="font-medium">{metric.name}</span>
                    <span className={logged ? "text-emerald-600 font-medium" : "text-amber-600"}>
                      {logged ? "✓ Logged this week" : "Not logged yet"}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-zinc-500">No weekly metrics yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}