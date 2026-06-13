import { useState } from 'react';

import type {
  Habit,
  HabitLogs
} from '../types/habit';

import { useLocalStorage } from './useLocalStorage';

export function useHabits() {
  const [habits, setHabits] =
    useLocalStorage<Habit[]>(
      'habit-tracker-habits',
      []
    );

  const [logs, setLogs] =
    useLocalStorage<HabitLogs>(
      'habit-tracker-logs',
      {}
    );

  const [currentDate, setCurrentDate] =
    useState(new Date());

  function addHabit(
    name: string,
    goalId: string
  ) {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      goalId,
      createdAt:
        new Date().toISOString()
    };

    setHabits([
      ...habits,
      newHabit
    ]);
  }

  function deleteHabit(
    habitId: string
  ) {
    setHabits(
      habits.filter(
        (habit) =>
          habit.id !== habitId
      )
    );

    setLogs((prev) => {
      const updated = {
        ...prev
      };

      delete updated[habitId];

      return updated;
    });
  }

  function toggleDay(
    habitId: string,
    date: string
  ) {
    setLogs((prev) => {
      const currentValue =
        prev[habitId]?.[date];

      const updatedHabitLogs = {
        ...(prev[habitId] || {})
      };

      if (currentValue) {
        delete updatedHabitLogs[
          date
        ];
      } else {
        updatedHabitLogs[
          date
        ] = true;
      }

      return {
        ...prev,
        [habitId]:
          updatedHabitLogs
      };
    });
  }

  return {
    habits,
    logs,
    currentDate,
    setCurrentDate,
    addHabit,
    deleteHabit,
    toggleDay,
    setHabits,
    setLogs
  };
}