import { useEffect, useState } from 'react';

import type { Goal } from '../types/goal';
import type { Habit, HabitLogs } from '../types/habit';

import AppLayout from '../components/AppLayout';
import AddGoalForm from '../components/goals/AddGoalForm';
import GoalCard from '../components/goals/GoalCard';
import YearNavigator from '../components/goals/YearNavigator';
import ConfirmModal from '../components/ConfirmModal';
import GoalsProgressChart from '../components/goals/GoalsProgressChart';

import { getHabitProgress } from '../utils/progress';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(() => {
  const stored =
    localStorage.getItem('goals');

  return stored
    ? JSON.parse(stored)
    : [];
});
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLogs>({});

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [goalToDelete, setGoalToDelete] =
    useState<Goal | null>(null);

  useEffect(() => {
    const storedHabits =
        localStorage.getItem(
            'habit-tracker-habits'
        );

    const storedLogs =
        localStorage.getItem(
            'habit-tracker-logs'
        );

  if (storedHabits) {
    setHabits(
      JSON.parse(storedHabits)
    );
  }

  if (storedLogs) {
    setLogs(
      JSON.parse(storedLogs)
    );
  }
}, []);

  useEffect(() => {
    localStorage.setItem(
      'goals',
      JSON.stringify(goals)
    );
  }, [goals]);

  function addGoal(title: string) {
    setGoals((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        year,
        createdAt:
          new Date().toISOString()
      }
    ]);
  }

  function deleteGoal(goalId: string) {
    setGoals((prev) =>
      prev.filter(
        (goal) =>
          goal.id !== goalId
      )
    );

    const updatedHabits =
      habits.map((habit) =>
        habit.goalId === goalId
          ? {
              ...habit,
              goalId: ''
            }
          : habit
      );

    setHabits(updatedHabits);

    localStorage.setItem(
      'habits',
      JSON.stringify(updatedHabits)
    );
  }

  const yearGoals = goals.filter(
    (goal) => goal.year === year
  );

  useEffect(() => {
  console.log('GOALS', goals);
  console.log('HABITS', habits);
}, [goals, habits]);

  return (
    <AppLayout>
      <YearNavigator
        year={year}
        setYear={setYear}
      />

      <AddGoalForm
        onAddGoal={addGoal}
      />

      <GoalsProgressChart
        goals={yearGoals}
        habits={habits}
        logs={logs}
        year={year}
        />

      <div className="space-y-6">
        {yearGoals.map((goal) => {
          const goalHabits =
            habits.filter(
              (habit) =>
                habit.goalId ===
                goal.id
            );

          const progress =
            goalHabits.length === 0
              ? 0
              : Math.round(
                  goalHabits.reduce(
                    (
                      total,
                      habit
                    ) =>
                      total +
                      getHabitProgress(
                        habit.id,
                        logs,
                        year
                      ),
                    0
                  ) /
                    goalHabits.length
                );

          return (
            <GoalCard
              key={goal.id}
              goal={goal}
              habits={goalHabits}
              progress={progress}
              logs={logs}
              year={year}
              onDelete={() =>
                setGoalToDelete(
                  goal
                )
              }
            />
          );
        })}
      </div>

      <ConfirmModal
        open={
          goalToDelete !== null
        }
        title="Delete Goal"
        message={`Delete "${goalToDelete?.title}"?`}
        onCancel={() =>
          setGoalToDelete(null)
        }
        onConfirm={() => {
          if (goalToDelete) {
            deleteGoal(
              goalToDelete.id
            );
          }

          setGoalToDelete(null);
        }}
      />
    </AppLayout>
  );
}