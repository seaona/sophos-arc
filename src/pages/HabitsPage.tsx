import AppLayout from "../components/AppLayout";
import HabitGrid from "../components/HabitGrid";
import MonthNavigator from "../components/MonthNavigator";
import StatsBar from "../components/StatsBar";
import { useHabits } from "../hooks/useHabits";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Goal } from "../types/goal";

export default function HabitsPage() {
  const {
    habits,
    logs,
    currentDate,
    setCurrentDate,
    toggleDay,
  } = useHabits();

  const [goals] = useLocalStorage<Goal[]>('goals', []);

  return (
    <AppLayout>
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

      <div className="glass-card p-8">
        <HabitGrid
          goals={goals}
          habits={habits}
          logs={logs}
          currentDate={currentDate}
          toggleDay={toggleDay}
          // deleteHabit removed on purpose
        />
      </div>
    </AppLayout>
  );
}