import type { HealthLog, HealthMetric } from '../../types/health';

type Props = {
  logs: HealthLog[];
  metrics: HealthMetric[];
  frequencyFilter: "all" | "daily" | "weekly";
  onFrequencyFilterChange: (filter: "all" | "daily" | "weekly") => void;
  editingLogId: string | null;
  onEditingChange: (logId: string | null) => void;
  onUpdateLog: (logId: string, newValue: any) => void;
  onDeleteRequest: (log: HealthLog) => void;
};

export default function HealthLogsTable({
  logs,
  metrics,
  frequencyFilter,
  onFrequencyFilterChange,
  editingLogId,
  onEditingChange,
  onUpdateLog,
  onDeleteRequest,
}: Props) {
  return (
    <div className="glass-card p-8 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold">All Health Logs</h2>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">Filter by frequency:</span>
          <select
            value={frequencyFilter}
            onChange={(e) => onFrequencyFilterChange(e.target.value as any)}
            className="modern-input w-40 text-sm"
          >
            <option value="all">All</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Metric</th>
                <th className="text-left py-3 px-4">Frequency</th>
                <th className="text-left py-3 px-4">Value</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const metric = metrics.find((m) => m.id === log.metricId);
                const isEditing = editingLogId === log.id;

                return (
                  <tr
                    key={log.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="py-3 px-4">{log.date}</td>
                    <td className="py-3 px-4 font-medium">{metric?.name || "Unknown"}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {metric?.frequency || "—"}
                      </span>
                    </td>

                    {/* Value Cell with Edit */}
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={
                              typeof log.value === "object"
                                ? log.value.systolic
                                : log.value
                            }
                            className="modern-input w-24"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                onUpdateLog(log.id, Number(e.currentTarget.value));
                                onEditingChange(null);
                              }
                              if (e.key === "Escape") {
                                onEditingChange(null);
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => onEditingChange(null)}
                            className="text-emerald-600 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => onEditingChange(null)}
                            className="text-zinc-400 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>
                            {typeof log.value === "object"
                              ? `${log.value.systolic}/${log.value.diastolic}`
                              : log.value}
                            {metric?.unit && ` ${metric.unit}`}
                          </span>
                          <button
                            onClick={() => onEditingChange(log.id)}
                            className="text-zinc-400 hover:text-blue-500 p-1"
                            title="Edit value"
                          >
                            ✎
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Delete Button */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onDeleteRequest(log)}
                        className="text-zinc-400 hover:text-red-500 p-1"
                        title="Delete log"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-400 italic">No logs found for the selected filter.</p>
      )}
    </div>
  );
}