import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useGoals } from '../hooks/useGoals';
import { useHealth } from '../hooks/useHealth';
import { useHabits } from '../hooks/useHabits';
import GoalCard from '../components/goals/GoalCard';
import MetricLogCard from '../components/health/MetricLogCard';
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
    getLatestLog, 
    addCustomMetric 
  } = useHealth();
  const { habits, logs: habitLogs } = useHabits();

  const healthGoals = goals.filter((goal) => goal.type === 'health');
  
  // Prepare chart data (last 30 entries)
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

  const rhrData = prepareChartData('resting-heart-rate');
  const sleepQualityData = prepareChartData('sleep-quality');

  const navigate = useNavigate();

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
          {dailyMetrics.map((metric) => {
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
              />
            );
          })}
        </div>
      </div>

      {/* Weekly Check-in */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Weekly Check-in</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeklyMetrics.map((metric) => {
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
              />
            );
          })}
        </div>
      </div>

      {/* Trends */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-6">Trends</h2>

        {metrics.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {metrics.map((metric) => {
              const chartData = prepareChartData(metric.id);

              return (
                <div key={metric.id}>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    {metric.name}
                    {metric.unit && (
                      <span className="text-xs text-zinc-500">({metric.unit})</span>
                    )}
                  </h3>

                  {chartData.length > 0 ? (
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[280px] flex flex-col items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-center p-6">
                      <p className="text-zinc-400">No data yet for {metric.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Start logging to see the trend
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-zinc-400 italic">No metrics available.</div>
        )}
      </div>

      {/* Add New Metric */}
      <div className="glass-card p-6 mb-8">
        <h3 className="font-semibold mb-4">Add Custom Metric</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const name = (form.elements.namedItem('name') as HTMLInputElement).value;
            const frequency = (form.elements.namedItem('frequency') as HTMLSelectElement)
              .value as 'daily' | 'weekly';

            if (name.trim()) {
              addCustomMetric({
                name: name.trim(),
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
            placeholder="Metric name (e.g. Steps, Mood, Water)"
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

      {/* Daily Logs Table */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Daily Logs</h2>
        
        {healthLogs.filter(log => 
          dailyMetrics.some(m => m.id === log.metricId)
        ).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Metric</th>
                  <th className="text-left py-3 px-4">Value</th>
                  <th className="text-left py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {healthLogs
                  .filter(log => dailyMetrics.some(m => m.id === log.metricId))
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 15)
                  .map((log) => {
                    const metric = metrics.find(m => m.id === log.metricId);
                    return (
                      <tr key={log.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="py-3 px-4">{log.date}</td>
                        <td className="py-3 px-4 font-medium">{metric?.name || 'Unknown'}</td>
                        <td className="py-3 px-4">
                          {typeof log.value === 'object' 
                            ? `${log.value.systolic}/${log.value.diastolic}` 
                            : log.value}
                          {metric?.unit && ` ${metric.unit}`}
                        </td>
                        <td className="py-3 px-4 text-zinc-500">{log.notes || '-'}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-zinc-400 italic">No daily logs yet.</p>
        )}
      </div>

      {/* Weekly Logs Table */}
      <div className="glass-card p-8">
        <h2 className="text-xl font-semibold mb-6">Weekly Logs</h2>
        
        {healthLogs.filter(log => 
          weeklyMetrics.some(m => m.id === log.metricId)
        ).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Metric</th>
                  <th className="text-left py-3 px-4">Value</th>
                  <th className="text-left py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {healthLogs
                  .filter(log => weeklyMetrics.some(m => m.id === log.metricId))
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 15)
                  .map((log) => {
                    const metric = metrics.find(m => m.id === log.metricId);
                    return (
                      <tr key={log.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="py-3 px-4">{log.date}</td>
                        <td className="py-3 px-4 font-medium">{metric?.name || 'Unknown'}</td>
                        <td className="py-3 px-4">
                          {typeof log.value === 'object' 
                            ? `${log.value.systolic}/${log.value.diastolic}` 
                            : log.value}
                          {metric?.unit && ` ${metric.unit}`}
                        </td>
                        <td className="py-3 px-4 text-zinc-500">{log.notes || '-'}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-zinc-400 italic">No weekly logs yet.</p>
        )}
      </div>


      {/* Health Goals */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Health Goals</h2>
          <button 
            onClick={() => navigate('/goals')}
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
    </AppLayout>
  );
}