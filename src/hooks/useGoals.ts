// hooks/useGoals.ts
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Goal } from '../types/goal';

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);

  const [year, setYear] = useState(new Date().getFullYear());

  function addGoal(title: string) {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      year,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
  }

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  function updateGoal(id: string, title: string) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, title } : g))
    );
  }

  // Goals for current year
  const currentYearGoals = goals.filter((g) => g.year === year);

  return {
    goals: currentYearGoals,
    allGoals: goals,
    year,
    setYear,
    addGoal,
    deleteGoal,
    updateGoal,
  };
}