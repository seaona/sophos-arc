// hooks/useGoals.ts
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Goal, Milestone } from '../types/goal';

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);

  const [year, setYear] = useState(new Date().getFullYear());

function addGoal(title: string, type: 'health' | 'finance' | 'personal' | 'custom' = 'personal') {
  const newGoal: Goal = {
    id: crypto.randomUUID(),
    title: title.trim(),
    year,
    createdAt: new Date().toISOString(),
    type,                    // ← Now supports type
    habitIds: [],
    milestones: [],
    itemWeights: {},
  };

  setGoals((prev) => [...prev, newGoal]);
}

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  function editGoal(goalId: string, newTitle: string) {
    setGoals((prev) =>
        prev.map((goal) =>
        goal.id === goalId ? { ...goal, title: newTitle } : goal
        )
    );
    }

  // Goals for current year
  const currentYearGoals = goals.filter((g) => g.year === year);

  // ==================== MILESTONE FUNCTIONS ====================
function addMilestone(goalId: string, title: string, weight: number = 0, month?: number) {
  setGoals((prev) =>
    prev.map((goal) => {
      if (goal.id !== goalId) return goal;

      const newMilestone: Milestone = {
        id: crypto.randomUUID(),
        title: title.trim(),
        achieved: false,
        weight: weight || 0,
        month: month,                    // ← NEW
      };

      return {
        ...goal,
        milestones: [...(goal.milestones || []), newMilestone],
      };
    })
  );
}

function toggleMilestone(goalId: string, milestoneId: string) {
  setGoals((prev) =>
    prev.map((goal) => {
      if (goal.id !== goalId) return goal;

      return {
        ...goal,
        milestones: (goal.milestones || []).map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                achieved: !m.achieved,
                achievedAt: !m.achieved ? new Date().toISOString() : undefined,
              }
            : m
        ),
      };
    })
  );
}

function updateMilestone(
  goalId: string, 
  milestoneId: string, 
  updates: Partial<import('../types/goal').Milestone>
) {
  setGoals((prev) =>
    prev.map((goal) => {
      if (goal.id !== goalId) return goal;

      return {
        ...goal,
        milestones: (goal.milestones || []).map((m) =>
          m.id === milestoneId ? { ...m, ...updates } : m
        ),
      };
    })
  );
}

function deleteMilestone(goalId: string, milestoneId: string) {
  setGoals((prev) =>
    prev.map((goal) => {
      if (goal.id !== goalId) return goal;

      return {
        ...goal,
        milestones: (goal.milestones || []).filter((m) => m.id !== milestoneId),
      };
    })
  );
}

function updateItemWeight(goalId: string, itemId: string, weight: number) {
  setGoals((prev) =>
    prev.map((goal) => {
      if (goal.id !== goalId) return goal;

      return {
        ...goal,
        itemWeights: {
          ...(goal.itemWeights || {}),
          [itemId]: weight,
        },
      };
    })
  );
}

  return {
    goals: currentYearGoals,
    allGoals: goals,
    year,
    setYear,
    addGoal,
    deleteGoal,
    editGoal,
    addMilestone,
    toggleMilestone,
    updateMilestone,
    deleteMilestone,
    updateItemWeight,
  };
}