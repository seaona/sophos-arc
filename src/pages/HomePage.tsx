import AppLayout from '../components/AppLayout';
import StatsBar from '../components/StatsBar';
import GoalsProgressChart from '../components/goals/GoalsProgressChart';
import PortfolioChart from '../components/finances/PortfolioChart';
import { useHabits } from '../hooks/useHabits';
import { usePortfolio } from '../hooks/usePortfolio';
import { NavLink } from 'react-router-dom';

export default function HomePage() {
  const { habits, logs, currentDate } = useHabits();
  const { portfolio, year } = usePortfolio();

  return (
    <AppLayout>
      <div className="space-y-10">

        {/* Welcome Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            Here's what's happening across your life this year.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NavLink to="/habits" className="glass-card p-5 hover:scale-105 transition-all group">
            <div className="text-2xl mb-2">🏋️</div>
            <div className="font-semibold">Habits</div>
            <div className="text-sm text-zinc-500">Track daily progress</div>
          </NavLink>

          <NavLink to="/finances" className="glass-card p-5 hover:scale-105 transition-all group">
            <div className="text-2xl mb-2">💰</div>
            <div className="font-semibold">Finances</div>
            <div className="text-sm text-zinc-500">Portfolio &amp; Strategy</div>
          </NavLink>

          <NavLink to="/goals" className="glass-card p-5 hover:scale-105 transition-all group">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-semibold">Goals</div>
            <div className="text-sm text-zinc-500">Long-term progress</div>
          </NavLink>

          <NavLink to="/health" className="glass-card p-5 hover:scale-105 transition-all group">
            <div className="text-2xl mb-2">❤️</div>
            <div className="font-semibold">Health</div>
            <div className="text-sm text-zinc-500">Body &amp; mind</div>
          </NavLink>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Habits Overview */}
          <div className="glass-card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Monthly Habit Progress</h2>
              <NavLink to="/habits" className="text-sm text-blue-600 hover:underline">View all →</NavLink>
            </div>
            <StatsBar habits={habits} logs={logs} currentDate={currentDate} />
          </div>

          {/* Goals Overview */}
          <div className="glass-card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Yearly Goal Progress</h2>
              <NavLink to="/goals" className="text-sm text-blue-600 hover:underline">View all →</NavLink>
            </div>
          </div>

        </div>

        {/* Portfolio Overview */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Portfolio Overview {year}</h2>
            <NavLink to="/finances" className="text-sm text-blue-600 hover:underline">Full Finances →</NavLink>
          </div>
          <PortfolioChart portfolio={portfolio} year={year} />
        </div>

      </div>
    </AppLayout>
  );
}