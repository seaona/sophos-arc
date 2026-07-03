import type { HealthMetric } from '../../types/health';

type Props = {
  dailyMetrics: HealthMetric[];
  weeklyMetrics: HealthMetric[];
  isLoggedToday: (metricId: string) => boolean;
  isLoggedThisWeek: (metricId: string) => boolean;
  onSave: (metricId: string, value: number) => void;
  getLatestLog: (metricId: string) => any;
  onDeleteMetric?: (metricId: string) => void;
  onUpdateLog?: (logId: string, newValue: any) => void; // optional for future editing
};

export default function DailyWeeklyCheckins({
  dailyMetrics,
  weeklyMetrics,
  isLoggedToday,
  isLoggedThisWeek,
  onSave,
  getLatestLog,
  onDeleteMetric,
}: Props) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const weekRange = (() => {
    const date = new Date();
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  })();

  const renderDailySection = () => {
    const loggedCount = dailyMetrics.filter(m => isLoggedToday(m.id)).length;
    const total = dailyMetrics.length;
    const progress = total > 0 ? Math.round((loggedCount / total) * 100) : 0;

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm text-zinc-500 tracking-wide">
            DAILY — {today}
          </h3>
          <div className="text-xs text-zinc-500">
            {loggedCount}/{total} logged
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-2 bg-emerald-500 transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {dailyMetrics.length > 0 ? (
          <div className="space-y-2">
            {dailyMetrics.map((metric) => {
              const logged = isLoggedToday(metric.id);
              const latestLog = getLatestLog(metric.id);

              return (
                <div
                  key={metric.id}
                  className={`flex items-center justify-between gap-4 p-4 rounded-2xl ${
                    logged 
                      ? 'bg-zinc-100 dark:bg-zinc-800/70' 
                      : 'bg-zinc-50 dark:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {onDeleteMetric && (
                      <button
                        onClick={() => onDeleteMetric(metric.id)}
                        className="text-zinc-400 hover:text-red-500 p-1"
                        title="Delete metric"
                      >
                        🗑️
                      </button>
                    )}
                    <div className="font-medium">{metric.name}</div>
                  </div>

                  {logged ? (
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span>
                        {typeof latestLog?.value === 'object' 
                          ? `${latestLog.value.systolic}/${latestLog.value.diastolic}` 
                          : latestLog?.value}
                      </span>
                      <span className="text-emerald-500">✓</span>
                    </div>
                  ) : (
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
                          const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                          const value = Number(input?.value);
                          if (value) onSave(metric.id, value);
                        }}
                        className="modern-button whitespace-nowrap px-5"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No daily metrics yet.</p>
        )}
      </div>
    );
  };

  const renderWeeklySection = () => {
    const loggedCount = weeklyMetrics.filter(m => isLoggedThisWeek(m.id)).length;
    const total = weeklyMetrics.length;
    const progress = total > 0 ? Math.round((loggedCount / total) * 100) : 0;

    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm text-zinc-500 tracking-wide">
            WEEKLY — {weekRange}
          </h3>
          <div className="text-xs text-zinc-500">
            {loggedCount}/{total} logged
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-2 bg-emerald-500 transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {weeklyMetrics.length > 0 ? (
          <div className="space-y-2">
            {weeklyMetrics.map((metric) => {
              const logged = isLoggedThisWeek(metric.id);
              const latestLog = getLatestLog(metric.id);

              return (
                <div
                  key={metric.id}
                  className={`flex items-center justify-between gap-4 p-4 rounded-2xl ${
                    logged 
                      ? 'bg-zinc-100 dark:bg-zinc-800/70' 
                      : 'bg-zinc-50 dark:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {onDeleteMetric && (
                      <button
                        onClick={() => onDeleteMetric(metric.id)}
                        className="text-zinc-400 hover:text-red-500 p-1"
                        title="Delete metric"
                      >
                        🗑️
                      </button>
                    )}
                    <div className="font-medium">{metric.name}</div>
                  </div>

                  {logged ? (
                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span>
                        {typeof latestLog?.value === 'object' 
                          ? `${latestLog.value.systolic}/${latestLog.value.diastolic}` 
                          : latestLog?.value}
                      </span>
                      <span className="text-emerald-500">✓</span>
                    </div>
                  ) : (
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
                          const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                          const value = Number(input?.value);
                          if (value) onSave(metric.id, value);
                        }}
                        className="modern-button whitespace-nowrap px-5"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No weekly metrics yet.</p>
        )}
      </div>
    );
  };

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="text-xl font-semibold mb-6">Today's & This Week's Check-ins</h2>
      {renderDailySection()}
      {renderWeeklySection()}
    </div>
  );
}