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
    getLatestLog,
    getLogsByMetric,
    addCustomMetric 
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
    
  // Delete confirmation state
  const [metricToDelete, setMetricToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteRequest = (metricId: string) => {
    const metric = metrics.find((m) => m.id === metricId);
    if (metric) {
      setMetricToDelete({
        id: metricId,
        name: metric.name,
      });
    }
  };

  const confirmDelete = () => {
    if (!metricToDelete) return;

    // Delete the metric completely (definition + logs)
    deleteCustomMetric(metricToDelete.id);

    setMetricToDelete(null);
  };

  const cancelDelete = () => {
    setMetricToDelete(null);
  };

  // Prepare chart data for trends
  const prepareChartData = (metricId: string) => {
    return healthLogs
      .filter((log) => log.metricId === metricId)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
      .map((log) => ({
        date: log.date,
        value: typeof log.value === 'number' ? log.value : 0,
      }));
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Health</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Track your key health metrics and progress on health goals.
        </p>
      </div>

      {/* Daily Quick Log */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today’s Quick Log</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyMetrics
            .filter((metric) => {
              const hasLogs = getLogsByMetric(metric.id).length > 0;
              // Show card if it has logs OR if it's a custom metric the user added
              return hasLogs || metrics.some(m => m.id === metric.id && m.category === 'custom');
            })
            .map((metric) => {
              const latest = getLatestLog(metric.id);
              return (
                <MetricLogCard
                  key={metric.id}
                  metric={metric}
                  latestLog={latest}
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

      {/* Weekly Check-in */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Weekly Check-in</h2>
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

      {/* Trends */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Trends</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          {metrics
            .filter((metric) => getLogsByMetric(metric.id).length > 0)
            .map((metric) => {
              const chartData = prepareChartData(metric.id);
              return (
                <div key={metric.id}>
                  <h3 className="font-medium mb-3">{metric.name}</h3>
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

      {/* All Health Logs */}
      <div className="glass-card p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold">All Health Logs</h2>

          {/* Frequency Filter */}
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
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const metric = metrics.find((m) => m.id === log.metricId);
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
                      <td className="py-3 px-4">
                        {typeof log.value === "object"
                          ? `${log.value.systolic}/${log.value.diastolic}`
                          : log.value}
                        {metric?.unit && ` ${metric.unit}`}
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={metricToDelete !== null}
        title="Delete Metric Data"
        message={`Delete "${metricToDelete?.name}" and all its data? This cannot be undone.`}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}