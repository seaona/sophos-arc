import { useState } from 'react';
import type { Habit, HabitLogs } from '../types/habit';
import { useLocalStorage } from './useLocalStorage';

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habit-tracker-habits', []);
  const [logs, setLogs] = useLocalStorage<HabitLogs>('habit-tracker-logs', {});
  const [currentDate, setCurrentDate] = useState(new Date());

  // Add a new habit
  function addHabit(name: string, goalId: string) {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      goalId,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
  }

  // Edit habit name
  function editHabit(habitId: string, newName: string) {
    if (!newName.trim()) return;

    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, name: newName.trim() } : habit
      )
    );
  }

  // Delete a habit + its logs
  function deleteHabit(habitId: string) {
    // Remove the habit
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));

    // Remove all logs for this habit
    setLogs((prev) => {
      const updated = { ...prev };
      delete updated[habitId];
      return updated;
    });
  }

  // Toggle a day for a habit
  function toggleDay(habitId: string, date: string) {
    setLogs((prev) => {
      const currentValue = prev[habitId]?.[date];
      const updatedHabitLogs = { ...(prev[habitId] || {}) };

      if (currentValue) {
        delete updatedHabitLogs[date];
      } else {
        updatedHabitLogs[date] = true;
      }

      return {
        ...prev,
        [habitId]: updatedHabitLogs,
      };
    });
  }

  return {
    habits,
    logs,
    currentDate,
    setCurrentDate,
    addHabit,
    editHabit,
    deleteHabit,
    toggleDay,
    setHabits,
    setLogs,
  };
}