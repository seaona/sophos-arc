import AppLayout from '../components/AppLayout';

import StatsBar from '../components/StatsBar';
import GoalsProgressChart from '../components/goals/GoalsProgressChart';

import { useHabits } from '../hooks/useHabits';
// useGoals is empty, add GoalsProgressChart

export default function HomePage() {
  const {
    habits,
    logs,
    currentDate
  } = useHabits();



  return (
    <AppLayout>
      <div className="space-y-8">

        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">
            Monthly Habit Progress
          </h2>

          <StatsBar
            habits={habits}
            logs={logs}
            currentDate={currentDate}
          />
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">
            Yearly Goal Progress
          </h2>


        </div>

      </div>
    </AppLayout>
  );
}