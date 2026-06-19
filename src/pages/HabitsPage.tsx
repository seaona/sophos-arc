import { useState } from "react";
import AddHabitForm from "../components/AddHabitForm";
import AppLayout from "../components/AppLayout";
import ConfirmModal from "../components/ConfirmModal";
import HabitGrid from "../components/HabitGrid";
import MonthNavigator from "../components/MonthNavigator";
import StatsBar from "../components/StatsBar";
import { useHabits } from "../hooks/useHabits";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Goal } from "../types/goal";
import type { Habit } from "../types/habit";

export default function HabitsPage() {
  const {
    habits,
    logs,
    currentDate,
    setCurrentDate,
    addHabit,
    deleteHabit,
    toggleDay,
  } = useHabits();

  const [goals] = useLocalStorage<Goal[]>('goals', []);

  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

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

      <AddHabitForm onAddHabit={addHabit} goals={goals} />

      <div className="glass-card p-8">
        <HabitGrid
          goals={goals}
          habits={habits}
          logs={logs}
          currentDate={currentDate}
          toggleDay={toggleDay}
          deleteHabit={(habitId) => {
            const habit = habits.find((h) => h.id === habitId);
            if (habit) setHabitToDelete(habit);
          }}
        />
      </div>

      <ConfirmModal
        open={habitToDelete !== null}
        title="Delete Habit"
        message={`Delete "${habitToDelete?.name}"?`}
        onCancel={() => setHabitToDelete(null)}
        onConfirm={() => {
          if (habitToDelete) deleteHabit(habitToDelete.id);
          setHabitToDelete(null);
        }}
      />
    </AppLayout>
  );
}