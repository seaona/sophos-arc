import type { Goal, Milestone } from '../types/goal';
import type { Habit } from '../types/habit';
import type { HabitLogs } from '../types/habit';
import { getHabitProgress, getHabitProgressForMonth } from './progress';
import { getHabitProgressUpToMonth } from './progress';

export function calculateGoalProgress(
  goal: Goal,
  habits: Habit[],
  logs: HabitLogs
): number {
  const allItems: { id: string; progress: number; weight: number }[] = [];

  // === HABITS ===
  const goalHabits = habits.filter(h => goal.habitIds?.includes(h.id) ?? false);
console.log("habitsgoal", goalHabits)
  if (goalHabits.length > 0) {
    const defaultWeight = 100 / goalHabits.length;

    goalHabits.forEach(habit => {
      const habitProgress = getHabitProgress(habit.id, logs, goal.year);
      const weight = goal.itemWeights?.[habit.id] || defaultWeight;
        console.log("habitsprogress calc", habitProgress)
        console.log('weight', weight)
      allItems.push({
        id: habit.id,
        progress: habitProgress,
        weight,
      });
    });
  }

  // === MILESTONES (safe access) ===
  const milestones = goal.milestones || [];

  milestones.forEach(milestone => {
    const progress = milestone.achieved ? 100 : 0;
    const weight = milestone.weight || 0;

    allItems.push({
      id: milestone.id,
      progress,
      weight,
    });
  });

  if (allItems.length === 0) return 0;

  // Weighted calculation
  let totalWeightedProgress = 0;
  let totalWeight = 0;

  allItems.forEach(item => {
    const w = item.weight > 0 ? item.weight : 0;
    console.log('item wieht', w)
    totalWeightedProgress += item.progress * w;
    console.log('total weiht prgoess', totalWeightedProgress)
    totalWeight += w;
  });

  if (totalWeight === 0) {
    const avg = allItems.reduce((sum, item) => sum + item.progress, 0) / allItems.length;
    return Math.round(avg);
  }

  return Math.round(totalWeightedProgress / totalWeight);
}

/**
 * Calculates goal progress cumulatively up to a specific month (0 = Jan, 11 = Dec)
 */
export function calculateGoalProgressUpToMonth(
  goal: Goal,
  habits: Habit[],
  logs: HabitLogs,
  year: number,
  endMonth: number // 0 = Jan ... 11 = Dec
): number {
  let total = 0;

  for (let m = 0; m <= endMonth; m++) {
    let monthProgressSum = 0;
    let itemCount = 0;

    // === HABITS for this month ===
    const goalHabits = habits.filter(h => h.goalId === goal.id);

    if (goalHabits.length > 0) {
      goalHabits.forEach(habit => {
        const monthProgress = getHabitProgressForMonth(habit.id, logs, year, m);
        const weight = goal.itemWeights?.[habit.id] || (100 / goalHabits.length);

        monthProgressSum += monthProgress * weight;
        itemCount += weight;
      });
    }

    // === MILESTONES for this month ===
    const milestones = goal.milestones || [];

    milestones.forEach(milestone => {
      let milestoneProgress = 0;

      if (milestone.achieved) {
        // Use milestone.month if set, otherwise fall back to achievedAt
        const milestoneMonth = milestone.month ?? 
          (milestone.achievedAt ? new Date(milestone.achievedAt).getMonth() + 1 : null);

        if (milestoneMonth && milestoneMonth <= (m + 1)) {
          milestoneProgress = 100;
        }
      }

      const weight = milestone.weight || 0;

      if (weight > 0) {
        monthProgressSum += milestoneProgress * weight;
        itemCount += weight;
      }
    });

    // Add this month's contribution to the yearly total (each month = 1/12)
    if (itemCount > 0) {
      total += (monthProgressSum / itemCount) / 12;
    }
  }

  return Math.round(total);
}