import AppLayout from '../components/AppLayout';
import StatsBar from '../components/StatsBar';
import GoalsProgressChart from '../components/goals/GoalsProgressChart';
import PortfolioChart from '../components/finances/PortfolioChart';
import YearNavigator from '../components/goals/YearNavigator';

import BackupButton from '../components/BackupButton';
import RestoreButton from '../components/RestoreButton';
import ThemeToggle from '../components/ThemeToggle';

import { useHabits } from '../hooks/useHabits';
import { usePortfolio } from '../hooks/usePortfolio';
import { useGoals } from '../hooks/useGoals';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { NavLink } from 'react-router-dom';
import PortfolioAllocationChart from '../components/finances/PortfolioAllocationChart';

export default function HomePage() {
  const { habits, logs, currentDate } = useHabits();
  const { portfolio, year: portfolioYear, categories } = usePortfolio();
  const { goals, year: goalsYear, setYear } = useGoals();


  // === Compute category values for the pie chart ===
const categoryValues = categories
  .map((category) => {
    const elementsInCategory = portfolio.filter(
      (el) => el.categoryId === category.id
    );

    const totalValue = elementsInCategory.reduce((sum, el) => {
      const yearData = el.monthlyValues?.[portfolioYear] || {};
      const latestMonth = Math.max(0, ...Object.keys(yearData).map(Number));
      return sum + (yearData[latestMonth]?.value || 0);
    }, 0);

    return {
      name: category.name,
      value: totalValue,
    };
  })
  .filter((cat) => cat.value > 0);

  const currentMonthName = currentDate.toLocaleString('default', { 
    month: 'long' 
  });

  const [darkMode, setDarkMode] = useLocalStorage<boolean>('habit-tracker-theme', false);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  return (
    <AppLayout>
      {/* Top Bar - Now responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            Here's an overview of your progress this year.
          </p>
        </div>

        {/* Actions - wrap on very small screens */}
        <div className="flex items-center gap-2 flex-wrap">
          <BackupButton />
          <RestoreButton />
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        </div>
      </div>

      <YearNavigator year={goalsYear} setYear={setYear} />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <NavLink to="/habits" className="glass-card p-5 hover:scale-105 transition-all group">
          <div className="text-3xl mb-3">🏋️</div>
          <div className="font-semibold">Habits</div>
          <div className="text-sm text-zinc-500">Daily tracking</div>
        </NavLink>

        <NavLink to="/finances" className="glass-card p-5 hover:scale-105 transition-all group">
          <div className="text-3xl mb-3">💰</div>
          <div className="font-semibold">Finances</div>
          <div className="text-sm text-zinc-500">Portfolio & Strategy</div>
        </NavLink>

        <NavLink to="/goals" className="glass-card p-5 hover:scale-105 transition-all group">
          <div className="text-3xl mb-3">🎯</div>
          <div className="font-semibold">Goals</div>
          <div className="text-sm text-zinc-500">Long term vision</div>
        </NavLink>

        <NavLink to="/health" className="glass-card p-5 hover:scale-105 transition-all group">
          <div className="text-3xl mb-3">❤️</div>
          <div className="font-semibold">Health</div>
          <div className="text-sm text-zinc-500">Body & Mind</div>
        </NavLink>
      </div>

      {/* Content Sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Habits */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Monthly Habit Progress</h2>
              <p className="text-sm text-zinc-500">
                Habit completion percentage for {currentMonthName}
              </p>
            </div>
            <NavLink to="/habits" className="text-sm text-blue-600 hover:underline">
              View all →
            </NavLink>
          </div>
          <StatsBar habits={habits} logs={logs} currentDate={currentDate} />
        </div>

        {/* Goals */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Goal Progress {goalsYear}</h2>
            <NavLink to="/goals" className="text-sm text-blue-600 hover:underline">
              View all →
            </NavLink>
          </div>
          <GoalsProgressChart 
            goals={goals} 
            habits={habits} 
            logs={logs} 
            year={goalsYear} 
          />
        </div>
      </div>

      {/* Portfolio */}
      {/* Finance Graphs - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

        {/* Portfolio Evolution (Bar Chart) */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Portfolio Evolution {portfolioYear}</h2>
            <NavLink to="/finances" className="text-sm text-blue-600 hover:underline">
              Full Finances →
            </NavLink>
          </div>
          <PortfolioChart portfolio={portfolio} year={portfolioYear} />
        </div>

        {/* Financial Strategy Allocation (Pie Chart) */}
        {/* Financial Strategy (Category Allocation) */}
<div className="glass-card p-8">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold">Financial Strategy</h2>
    <NavLink to="/finances" className="text-sm text-blue-600 hover:underline">
      Full Finances →
    </NavLink>
  </div>

  {/* Pie Chart */}
  <div className="mb-8">
    <PortfolioAllocationChart categoryValues={categoryValues} />
  </div>

  {/* Category List with Amounts */}
  <div className="space-y-3">
    {categoryValues.length > 0 ? (
      categoryValues.map((cat, index) => {
        const total = categoryValues.reduce((sum, c) => sum + c.value, 0);
        const percent = total > 0 ? ((cat.value / total) * 100).toFixed(1) : '0';

        return (
          <div 
            key={index} 
            className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60"
          >
            <div className="font-medium">{cat.name}</div>
            <div className="text-right">
              <div className="font-semibold">€{cat.value.toLocaleString()}</div>
              <div className="text-xs text-zinc-500">{percent}%</div>
            </div>
          </div>
        );
      })
    ) : (
      <div className="text-center py-6 text-zinc-500">
        No portfolio data yet
      </div>
    )}
  </div>
</div>

      </div>
    </AppLayout>
  );
}