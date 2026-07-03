import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { useHealth } from '../hooks/useHealth';
import { useSupplements } from '../hooks/useSupplements';
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
} from '../utils/health';

import DailyWeeklyCheckins from '../components/health/DailyWeeklyCheckins';
import HealthLogsTable from '../components/health/HealthLogsTable';
import SupplementTimeline from '../components/health/SupplementTimeline';
import AddSupplementForm from '../components/health/AddSupplementForm';
import SupplementList from '../components/health/SupplementList';

export default function HealthPage() {
  const {
    metrics,
    dailyMetrics,
    weeklyMetrics,
    logs: healthLogs,
    frequencyFilter,
    setFrequencyFilter,
    filteredLogs,
    isLoggedToday,
    isLoggedThisWeek,
    saveLog,
    deleteMetric,
    deleteLog,
    getLogsByMetric,
    getLatestLog,
    addCustomMetric,
    updateLog,
  } = useHealth();

  const { supplements, addSupplement, updateSupplement, deleteSupplement } = useSupplements();

  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [metricToDelete, setMetricToDelete] = useState<{ id: string; name: string } | null>(null);
  const [logToDelete, setLogToDelete] = useState<{ id: string; metricName: string; date: string } | null>(null);

  // ==================== HANDLERS ====================
  const confirmDeleteMetric = () => {
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

  const handleDeleteMetricRequest = (metricId: string) => {
    const metric = metrics.find((m) => m.id === metricId);
    if (metric) {
      setMetricToDelete({ id: metricId, name: metric.name });
    }
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

      {/* Consolidated Check-ins Section */}
      <DailyWeeklyCheckins
        dailyMetrics={dailyMetrics}
        weeklyMetrics={weeklyMetrics}
        isLoggedToday={isLoggedToday}
        isLoggedThisWeek={isLoggedThisWeek}
        onSave={handleSaveLog}
        getLatestLog={getLatestLog}
        onDeleteMetric={handleDeleteMetricRequest}  
      />

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

        <div className="mb-10">
          <h3 className="font-semibold mb-4 text-sm text-zinc-500 tracking-wide">DAILY TRENDS</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {metrics
              .filter((m) => getLogsByMetric(m.id).length > 0 && m.frequency === 'daily')
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

        <div>
          <h3 className="font-semibold mb-4 text-sm text-zinc-500 tracking-wide">WEEKLY TRENDS</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {metrics
              .filter((m) => getLogsByMetric(m.id).length > 0 && m.frequency === 'weekly')
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
      <HealthLogsTable
        logs={filteredLogs}
        metrics={metrics}
        frequencyFilter={frequencyFilter}
        onFrequencyFilterChange={setFrequencyFilter}
        editingLogId={editingLogId}
        onEditingChange={setEditingLogId}
        onUpdateLog={updateLog}
        onDeleteRequest={handleDeleteLogRequest}
      />

      {/* Supplements Section */}
      <div className="mb-8">
        <SupplementTimeline supplements={supplements} />
        <AddSupplementForm onAdd={addSupplement} />
        <SupplementList 
          supplements={supplements} 
          onUpdate={updateSupplement} 
          onDelete={deleteSupplement} 
        />
      </div>

      {/* Modals */}
      <ConfirmModal
        open={metricToDelete !== null}
        title="Delete Metric"
        message={`Delete "${metricToDelete?.name}" and all its data?`}
        onCancel={() => setMetricToDelete(null)}
        onConfirm={confirmDeleteMetric}
      />
      <ConfirmModal
        open={logToDelete !== null}
        title="Delete Log Entry"
        message={`Delete the log for "${logToDelete?.metricName}" on ${logToDelete?.date}?`}
        onCancel={() => setLogToDelete(null)}
        onConfirm={confirmDeleteLog}
      />
    </AppLayout>
  );
}