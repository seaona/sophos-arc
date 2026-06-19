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
    updateMilestone,           // ← Add this
    updateItemWeight,
  } = useGoals();

  const { habits, logs } = useHabits();

  const [newGoalTitle, setNewGoalTitle] = useState('');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    addGoal(newGoalTitle);
    setNewGoalTitle('');
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
        <div className="flex gap-3">
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="Add new goal..."
            className="modern-input flex-1"
          />
          <button type="submit" className="modern-button">
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
              onUpdateMilestone={updateMilestone}     // ← Pass it here
              onUpdateWeight={updateItemWeight}
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