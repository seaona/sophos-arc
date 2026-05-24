import { useEffect, useState } from 'react';
import AddHabitForm from './components/AddHabitForm';
import BackupButton from './components/BackupButton';
import HabitGrid from './components/HabitGrid';
import MonthNavigator from './components/MonthNavigator';
import StatsBar from './components/StatsBar';
import ThemeToggle from './components/ThemeToggle';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Habit, HabitLogs } from './types/habit';
import RestoreButton from './components/RestoreButton';

export default function App() {
  const [habits, setHabits] = useLocalStorage<Habit[]>(
    'habit-tracker-habits',
    []
  );

  const [logs, setLogs] = useLocalStorage<HabitLogs>(
    'habit-tracker-logs',
    {}
  );

  const [darkMode, setDarkMode] = useLocalStorage<boolean>(
    'habit-tracker-theme',
    false
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  function addHabit(name: string) {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString()
    };

    setHabits([...habits, newHabit]);
  }

  function deleteHabit(habitId: string) {
    setHabits(habits.filter((habit) => habit.id !== habitId));

    setLogs((prev) => {
      const updated = { ...prev };
      delete updated[habitId];
      return updated;
    });
  }

  function toggleDay(habitId: string, date: string) {
    setLogs((prev) => {
      const currentValue = prev[habitId]?.[date];

      const updatedHabitLogs = {
        ...(prev[habitId] || {})
      };

      if (currentValue) {
        delete updatedHabitLogs[date];
      } else {
        updatedHabitLogs[date] = true;
      }

      return {
        ...prev,
        [habitId]: updatedHabitLogs
      };
    });
  }

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  return (
    <div className="page-container bg-stone-100 dark:bg-zinc-950">
      <div className="content-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="section-title">
              Sophos Arc
            </h1>

            <p className="subtle-text mt-3 text-lg max-w-3xl leading-relaxed">
              A personal system for tracking habits, creations, and progress toward a meaningful life arc.
            </p>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Your data stays private, local, and fully under your control in your browser.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <BackupButton
              habits={habits}
              logs={logs}
            />

              <RestoreButton
                setHabits={setHabits}
                setLogs={setLogs}
              />

            <ThemeToggle
              darkMode={darkMode}
              toggleTheme={toggleTheme}
            />
          </div>
        </div>

        <MonthNavigator
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />

        <div className="glass-card p-8">
          <StatsBar
            habits={habits}
            logs={logs}
            currentDate={currentDate}
          />
        </div>

        <AddHabitForm onAddHabit={addHabit} />

        <div className="glass-card p-8">
          <HabitGrid
            habits={habits}
            logs={logs}
            currentDate={currentDate}
            toggleDay={toggleDay}
            deleteHabit={deleteHabit}
          />
        </div>
      </div>
    </div>
  );
}