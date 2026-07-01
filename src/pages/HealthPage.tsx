import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useGoals } from '../hooks/useGoals';
import { useHealth } from '../hooks/useHealth';
import { useHabits } from '../hooks/useHabits';
import GoalCard from '../components/goals/GoalCard';
import MetricStatusOverview from '../components/health/MetricStatusOverview';
import MetricLogger from '../components/health/MetricLogger';
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

import {
  prepareDailyChartData,
  prepareWeeklyChartData,
  getWeekRange,
} from '../utils/health';

import { useHealthMetrics } from '../hooks/useHealthMetrics';

export default function HealthPage() {
  const { goals, addMilestone, toggleMilestone, deleteMilestone, updateMilestone } = useGoals();
const { 
  metrics, 
  logs: healthLogs,
  saveLog, 
  deleteMetric,
  deleteLog,
  getLatestLog,
  getLogsByMetric,
  addCustomMetric,
  updateLog,
} = useHealth();

// Get these from the metrics hook instead:
const {
  frequencyFilter,
  setFrequencyFilter,
  filteredLogs,
  isLoggedToday,
  isLoggedThisWeek,
  dailyProgress,
  weeklyProgress,
  unloggedDaily,
  unloggedWeekly,
  dailyMetrics,      // ← Get from here
  weeklyMetrics,     // ← Get from here
} = useHealthMetrics();
  const { habits, logs: habitLogs } = useHabits();

  const healthGoals = goals.filter((goal) => goal.type === 'health');


  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [metricToDelete, setMetricToDelete] = useState<{ id: string; name: string } | null>(null);
  const [logToDelete, setLogToDelete] = useState<{ id: string; metricName: string; date: string } | null>(null);

  // ==================== HANDLERS ====================

  const handleDeleteRequest = (metricId: string) => {
    const metric = metrics.find((m) => m.id === metricId);
    if (metric) setMetricToDelete({ id: metricId, name: metric.name });
  };

  const confirmDelete = () => {
    if (metricToDelete) deleteMetric(metricToDelete.id);
    setMetricToDelete(null);
  };

  const handleDeleteLogRequest = (log: any) => {
    const metric = metrics.find((m) => m.id === log.metricId);
    setLogToDelete({
      id: log.id,
      metricName: metric?.name || "Unknown",
      date: log.date,
    });
  };

  const confirmDeleteLog = () => {
    if (logToDelete) deleteLog(logToDelete.id);
    setLogToDelete(null);
  };

  const handleSaveLog = (metricId: string, value: any) => {
    saveLog({
      metricId,
      value,
      date: new Date().toISOString().split('T')[0],
    });
  };

  // ==================== RENDER ====================

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Health</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Track your key health metrics and progress on health goals.
        </p>
      </div>

      {/* Status Overview */}
      <MetricStatusOverview
        dailyMetrics={dailyMetrics}           // You need to get these from useHealth
        weeklyMetrics={weeklyMetrics}
        isLoggedToday={isLoggedToday}
        isLoggedThisWeek={isLoggedThisWeek}
      />

      {/* Logging Forms */}
      <div className="space-y-8 mb-8">
        <MetricLogger
          title="Log Daily Metrics"
          metrics={unloggedDaily}
          getLatestLog={getLatestLog}
          onSave={handleSaveLog}
          onDelete={handleDeleteRequest}
        />

        <MetricLogger
          title="Log Weekly Metrics"
          metrics={unloggedWeekly}
          getLatestLog={getLatestLog}
          onSave={handleSaveLog}
          onDelete={handleDeleteRequest}
        />
      </div>

      {/* Add Custom Metric Form */}
      <div className="glass-card p-6 mb-8">
        <h3 className="font-semibold mb-4">Add Custom Metric</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
            const frequency = (form.elements.namedItem('frequency') as HTMLSelectElement).value as 'daily' | 'weekly';

            if (name) {
              addCustomMetric({ name, frequency, inputType: 'number', category: 'custom' });
              form.reset();
            }
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input name="name" type="text" placeholder="Metric name..." className="modern-input flex-1" required />
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
                const chartData = prepareDailyChartData(healthLogs, metric.id);
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
                const chartData = prepareWeeklyChartData(healthLogs, metric.id);
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
            <select value={frequencyFilter} onChange={(e) => setFrequencyFilter(e.target.value)} className="modern-input w-40 text-sm">
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
                    <tr key={log.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="py-3 px-4">{log.date}</td>
                      <td className="py-3 px-4 font-medium">{metric?.name || "Unknown"}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 text-xs rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {metric?.frequency || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input type="number" defaultValue={typeof log.value === 'object' ? log.value.systolic : log.value} className="modern-input w-24" onKeyDown={(e) => {
                              if (e.key === 'Enter') { updateLog(log.id, Number(e.currentTarget.value)); setEditingLogId(null); }
                              if (e.key === 'Escape') setEditingLogId(null);
                            }} autoFocus />
                            <button onClick={() => setEditingLogId(null)} className="text-emerald-600 text-sm">Save</button>
                            <button onClick={() => setEditingLogId(null)} className="text-zinc-400 text-sm">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{typeof log.value === "object" ? `${log.value.systolic}/${log.value.diastolic}` : log.value}{metric?.unit && ` ${metric.unit}`}</span>
                            <button onClick={() => setEditingLogId(log.id)} className="text-zinc-400 hover:text-blue-500 p-1">✎</button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDeleteLogRequest(log)} className="text-zinc-400 hover:text-red-500 p-1">🗑️</button>
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
          <button onClick={() => window.location.href = '/goals'} className="modern-button text-sm">+ New Health Goal</button>
        </div>

        {healthGoals.length > 0 ? (
          <div className="space-y-6">
            {healthGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} habits={habits} logs={habitLogs} onAddMilestone={addMilestone} onToggleMilestone={toggleMilestone} onDeleteMilestone={deleteMilestone} onUpdateMilestone={updateMilestone} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-zinc-500">No health goals yet.</div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal open={metricToDelete !== null} title="Delete Metric Data" message={`Delete "${metricToDelete?.name}" and all its data? This cannot be undone.`} onCancel={() => setMetricToDelete(null)} onConfirm={confirmDelete} />
      <ConfirmModal open={logToDelete !== null} title="Delete Log Entry" message={`Delete the log for "${logToDelete?.metricName}" on ${logToDelete?.date}?`} onCancel={() => setLogToDelete(null)} onConfirm={confirmDeleteLog} />
    </AppLayout>
  );
}