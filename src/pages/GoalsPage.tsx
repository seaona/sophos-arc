import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import YearNavigator from '../components/goals/YearNavigator';
import GoalCard from '../components/goals/GoalCard';
import GoalsProgressChart from '../components/goals/GoalsProgressChart';

import { useGoals } from '../hooks/useGoals';
import { useHabits } from '../hooks/useHabits';

export default function GoalsPage() {
  const {
    goals,
    year,
    setYear,
    addGoal,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
    updateMilestone,
    updateItemWeight,
  } = useGoals();

  const { habits, logs, addHabit } = useHabits(); // ← Add addHabit here

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalType, setNewGoalType] = useState<'health' | 'finance' | 'personal' | 'custom'>('personal');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    addGoal(newGoalTitle, newGoalType);
    setNewGoalTitle('');
    setNewGoalType('personal');
  };

  return (
    <AppLayout>
      <YearNavigator year={year} setYear={setYear} />

      <div className="mb-8">
        <GoalsProgressChart 
          goals={goals} 
          habits={habits} 
          logs={logs} 
          year={year} 
        />
      </div>

      {/* Add Goal Form */}
      <form onSubmit={handleAddGoal} className="glass-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="Goal title..."
            className="modern-input flex-1"
          />
          <select
            value={newGoalType}
            onChange={(e) => setNewGoalType(e.target.value as any)}
            className="modern-input w-full sm:w-44"
          >
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="custom">Custom</option>
          </select>
          <button type="submit" className="modern-button whitespace-nowrap">
            Add Goal
          </button>
        </div>
      </form>

      {/* Goals List */}
      <div className="space-y-6">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              habits={habits}
              logs={logs}
              onAddMilestone={addMilestone}
              onToggleMilestone={toggleMilestone}
              onDeleteMilestone={deleteMilestone}
              onUpdateMilestone={updateMilestone}
              onUpdateWeight={updateItemWeight}
              onAddHabit={addHabit}           // ← Pass addHabit here
            />
          ))
        ) : (
          <div className="glass-card p-8 text-center text-zinc-500">
            No goals yet. Create your first one above.
          </div>
        )}
      </div>
    </AppLayout>
  );
}