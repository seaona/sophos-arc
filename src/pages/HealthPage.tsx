import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useGoals } from '../hooks/useGoals';
import { useHealth } from '../hooks/useHealth';
import { useHabits } from '../hooks/useHabits';
import GoalCard from '../components/goals/GoalCard';
import MetricLogCard from '../components/health/MetricLogCard';
import ConfirmModal from '../components/ConfirmModal';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function HealthPage() {
  const { goals, addMilestone, toggleMilestone, deleteMilestone, updateMilestone } = useGoals();
  const { 
    metrics, 
    logs: healthLogs, 
    dailyMetrics,
    weeklyMetrics,
    saveLog, 
    deleteCustomMetric,
    deleteLog,
    getLatestLog,
    getLogsByMetric,
    addCustomMetric,
    updateLog,
  } = useHealth();
  const { habits, logs: habitLogs } = useHabits();

  const healthGoals = goals.filter((goal) => goal.type === 'health');

  const [frequencyFilter, setFrequencyFilter] = useState<"all" | "daily" | "weekly">("all");

  const filteredLogs = healthLogs
    .filter((log) => {
      if (frequencyFilter === "all") return true;
      const metric = metrics.find((m) => m.id === log.metricId);
      return metric?.frequency === frequencyFilter;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  const [metricToDelete, setMetricToDelete] = useState<{ id: string; name: string } | null>(null);

  // NEW: Log delete state
  const [logToDelete, setLogToDelete] = useState<{
    id: string;
    metricName: string;
    date: string;
  } | null>(null);

  const handleDeleteRequest = (metricId: string) => {
    const metric = metrics.find((m) => m.id === metricId);
    if (metric) {
      setMetricToDelete({ id: metricId, name: metric.name });
    }
  };

  const confirmDelete = () => {
    if (!metricToDelete) return;
    deleteCustomMetric(metricToDelete.id);
    setMetricToDelete(null);
  };

  const cancelDelete = () => {
    setMetricToDelete(null);
  };

  //Log deletion handlers
  const handleDeleteLogRequest = (log: any) => {
    const metric = metrics.find((m) => m.id === log.metricId);
    setLogToDelete({
      id: log.id,
      metricName: metric?.name || "Unknown",
      date: log.date,
    });
  };

  const confirmDeleteLog = () => {
    if (!logToDelete) return;
    deleteLog(logToDelete.id);
    setLogToDelete(null);
  };

  const cancelDeleteLog = () => {
    setLogToDelete(null);
  };

  // Daily chart data (existing logic)
const prepareDailyChartData = (metricId: string) => {
  return healthLogs
    .filter((log) => log.metricId === metricId)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map((log) => ({
      date: log.date,
      value: typeof log.value === 'number' ? log.value : 0,
    }));
};

  // Reliable week number calculation
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

  // Weekly chart data - uses the LATEST value per week
  const prepareWeeklyChartData = (metricId: string) => {
    const logs = healthLogs
      .filter((log) => log.metricId === metricId)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (logs.length === 0) return [];

    const weeklyData: Record<number, { week: string; value: number }> = {};

    logs.forEach((log) => {
      const date = new Date(log.date);
      const weekNumber = getWeekNumber(date);
      const weekLabel = `W${weekNumber}`;

      if (typeof log.value === 'number') {
        // Keep only the latest value for each week
        weeklyData[weekNumber] = {
          week: weekLabel,
          value: log.value,
        };
      }
    });

    return Object.keys(weeklyData)
      .map(Number)
      .sort((a, b) => a - b)
      .map((weekNum) => weeklyData[weekNum]);
  };



  // Format today's date nicely
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const getWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  // Get current week number
  const getCurrentWeekNumber = (): number => {
    const date = new Date();
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Daily Progress - only counts custom daily metrics logged TODAY
  const getDailyProgress = () => {
    const today = new Date().toISOString().split('T')[0];

    const customDailyMetrics = dailyMetrics.filter(m => m.category === 'custom');

    const loggedToday = customDailyMetrics.filter(metric => {
      const logs = getLogsByMetric(metric.id);
      return logs.some(log => log.date === today);
    }).length;

    return `${loggedToday}/${customDailyMetrics.length}`;
  };

  // Weekly Progress - only counts custom weekly metrics logged THIS WEEK
  const getWeeklyProgress = () => {
    const currentYear = new Date().getFullYear();
    const currentWeek = getCurrentWeekNumber();

    const customWeeklyMetrics = weeklyMetrics.filter(m => m.category === 'custom');

    const loggedThisWeek = customWeeklyMetrics.filter(metric => {
      const logs = getLogsByMetric(metric.id);
      return logs.some(log => {
        const logDate = new Date(log.date);
        return getWeekNumber(logDate) === currentWeek && logDate.getFullYear() === currentYear;
      });
    }).length;

    return `${loggedThisWeek}/${customWeeklyMetrics.length}`;
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Health</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Track your key health metrics and progress on health goals.
        </p>
      </div>

     {/* Daily & Weekly Check-ins */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Daily & Weekly Check-ins</h2>

        {/* Daily Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-zinc-500 tracking-wide">TODAY</h3>
            <span className="text-sm text-zinc-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="font-medium text-emerald-600">
              {getDailyProgress()} logged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dailyMetrics
              .filter((metric) => {
                const hasLogs = getLogsByMetric(metric.id).length > 0;
                return hasLogs || metrics.some(m => m.id === metric.id && m.category === 'custom');
              })
              .map((metric) => {
                const latest = getLatestLog(metric.id);
                return (
                  <MetricLogCard
                    key={metric.id}
                    metric={metric}
                    latestLog={latest}
                    isFilled={!!latest}
                    onSave={(value) => {
                      saveLog({
                        metricId: metric.id,
                        value,
                        date: new Date().toISOString().split('T')[0],
                      });
                    }}
                    onDelete={() => handleDeleteRequest(metric.id)}
                  />
                );
              })}
          </div>
        </div>

        {/* Weekly Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-zinc-500 tracking-wide">THIS WEEK</h3>
            
            <span className="text-sm text-zinc-500">
              {getWeekRange()}
            </span>
            
            <span className="font-medium text-emerald-600">
              {getWeeklyProgress()} logged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyMetrics
              .filter((metric) => {
                const hasLogs = getLogsByMetric(metric.id).length > 0;
                return hasLogs || metrics.some(m => m.id === metric.id && m.category === 'custom');
              })
              .map((metric) => {
                const latest = getLatestLog(metric.id);
                return (
                  <MetricLogCard
                    key={metric.id}
                    metric={metric}
                    latestLog={latest}
                    isFilled={!!latest}
                    onSave={(value) => {
                      saveLog({
                        metricId: metric.id,
                        value,
                        date: new Date().toISOString().split('T')[0],
                      });
                    }}
                    onDelete={() => handleDeleteRequest(metric.id)}
                  />
                );
              })}
          </div>
        </div>
      </div>

      {/* Add Custom Metric */}
      <div className="glass-card p-6 mb-8">
        <h3 className="font-semibold mb-4">Add Custom Metric</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
            const frequency = (form.elements.namedItem('frequency') as HTMLSelectElement).value as 'daily' | 'weekly';

            if (name) {
              addCustomMetric({
                name,
                frequency,
                inputType: 'number',
                category: 'custom',
              });
              form.reset();
            }
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            name="name"
            type="text"
            placeholder="Metric name (e.g. Steps, Mood, Water Intake)"
            className="modern-input flex-1"
            required
          />
          <select name="frequency" className="modern-input w-40">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <button type="submit" className="modern-button">Add Metric</button>
        </form>
      </div>

      {/* Trends */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Trends</h2>

        {/* Daily Trends */}
        <div className="mb-10">
          <h3 className="font-semibold mb-4 text-sm text-zinc-500 tracking-wide">DAILY TRENDS</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {metrics
              .filter((metric) => getLogsByMetric(metric.id).length > 0 && metric.frequency === 'daily')
              .map((metric) => {
                const chartData = prepareDailyChartData(metric.id);
                return (
                  <div key={metric.id}>
                    <h4 className="font-medium mb-3">{metric.name}</h4>
                    {chartData.length > 0 ? (
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[280px] flex items-center justify-center border border-dashed rounded-2xl text-zinc-400">
                        No data yet
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Weekly Trends */}
        <div>
          <h3 className="font-semibold mb-4 text-sm text-zinc-500 tracking-wide">WEEKLY TRENDS</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {metrics
              .filter((metric) => getLogsByMetric(metric.id).length > 0 && metric.frequency === 'weekly')
              .map((metric) => {
                const chartData = prepareWeeklyChartData(metric.id);
                return (
                  <div key={metric.id}>
                    <h4 className="font-medium mb-3">{metric.name}</h4>
                    {chartData.length > 0 ? (
                      <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[280px] flex items-center justify-center border border-dashed rounded-2xl text-zinc-400">
                        No data yet
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* All Health Logs */}
      <div className="glass-card p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold">All Health Logs</h2>

          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">Filter by frequency:</span>
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="modern-input w-40 text-sm"
            >
              <option value="all">All</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        {filteredLogs.length > 0 ? (
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
                {filteredLogs.map((log) => {
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
                                typeof log.value === 'object'
                                  ? log.value.systolic
                                  : log.value
                              }
                              className="modern-input w-24"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newValue = Number(e.currentTarget.value);
                                  updateLog(log.id, newValue);
                                  setEditingLogId(null);
                                }
                                if (e.key === 'Escape') {
                                  setEditingLogId(null);
                                }
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                // For simplicity, we use the input's current value on blur/enter
                                const input = document.activeElement as HTMLInputElement;
                                if (input) {
                                  updateLog(log.id, Number(input.value));
                                }
                                setEditingLogId(null);
                              }}
                              className="text-emerald-600 text-sm px-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingLogId(null)}
                              className="text-zinc-400 text-sm px-2"
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
                              onClick={() => setEditingLogId(log.id)}
                              className="text-zinc-400 hover:text-blue-500 p-1"
                              title="Edit value"
                            >
                              ✎
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteLogRequest(log)}
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

      {/* Health Goals */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Health Goals</h2>
          <button 
            onClick={() => window.location.href = '/goals'} 
            className="modern-button text-sm"
          >
            + New Health Goal
          </button>
        </div>

        {healthGoals.length > 0 ? (
          <div className="space-y-6">
            {healthGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                habits={habits}
                logs={habitLogs}
                onAddMilestone={addMilestone}
                onToggleMilestone={toggleMilestone}
                onDeleteMilestone={deleteMilestone}
                onUpdateMilestone={updateMilestone}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-zinc-500">
            No health goals yet.
          </div>
        )}
      </div>

      <ConfirmModal
        open={metricToDelete !== null}
        title="Delete Metric Data"
        message={`Delete "${metricToDelete?.name}" and all its data? This cannot be undone.`}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      {/* NEW: Confirm Delete Modal for Single Log */}
      <ConfirmModal
        open={logToDelete !== null}
        title="Delete Log Entry"
        message={`Delete the log for "${logToDelete?.metricName}" on ${logToDelete?.date}?`}
        onCancel={cancelDeleteLog}
        onConfirm={confirmDeleteLog}
      />
    </AppLayout>
  );
}