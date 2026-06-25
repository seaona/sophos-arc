import { useState } from 'react';
import type { Goal, Milestone } from '../../types/goal';
import type { Habit } from '../../types/habit';
import type { HabitLogs } from '../../types/habit';
import { getHabitProgress } from '../../utils/progress';
import ConfirmModal from '../ConfirmModal';

type Props = {
  goal: Goal;
  habits: Habit[];
  logs: HabitLogs;
  onAddMilestone: (goalId: string, title: string, weight?: number, month?: number) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDeleteMilestone: (goalId: string, milestoneId: string) => void;
  onUpdateMilestone: (goalId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  onUpdateWeight?: (goalId: string, itemId: string, weight: number) => void;
  onAddHabit?: (name: string, goalId: string) => void;
  onEditHabit?: (habitId: string, newName: string) => void;
  onDeleteHabit?: (habitId: string) => void;
  onEditGoal?: (goalId: string, newTitle: string) => void;
  onDeleteGoal?: (goalId: string) => void;
};

export default function GoalCard({
  goal,
  habits,
  logs,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  onUpdateMilestone,
  onUpdateWeight,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onEditGoal,
  onDeleteGoal,
}: Props) {
  const [newHabitName, setNewHabitName] = useState('');

  // Editing states
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingHabitName, setEditingHabitName] = useState('');
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingGoalTitle, setEditingGoalTitle] = useState(goal.title);

  // Delete confirmation states
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [milestoneToDelete, setMilestoneToDelete] = useState<string | null>(null);
  const [goalToDelete, setGoalToDelete] = useState(false);

  const goalHabits = habits.filter((h) => h.goalId === goal.id);

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneMonth, setNewMilestoneMonth] = useState<number | ''>('');

  // Yearly Progress Calculation
  const progress = goalHabits.length > 0
    ? Math.round(
        goalHabits.reduce((sum, habit) => {
          return sum + getHabitProgress(habit.id, logs, goal.year);
        }, 0) / goalHabits.length
      )
    : 0;

  const handleAddHabit = () => {
    if (!newHabitName.trim() || !onAddHabit) return;
    onAddHabit(newHabitName.trim(), goal.id);
    setNewHabitName('');
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim() || !newMilestoneMonth) return;

    onAddMilestone(goal.id, newMilestoneTitle.trim(), undefined, newMilestoneMonth);
    
    // Reset form
    setNewMilestoneTitle('');
    setNewMilestoneMonth('');
  };

  return (
    <div className="glass-card p-6">
      {/* Goal Header with Edit/Delete */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {editingGoal ? (
            <div className="flex gap-2">
              <input
                value={editingGoalTitle}
                onChange={(e) => setEditingGoalTitle(e.target.value)}
                className="modern-input flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onEditGoal?.(goal.id, editingGoalTitle);
                    setEditingGoal(false);
                  }
                  if (e.key === 'Escape') setEditingGoal(false);
                }}
                autoFocus
              />
              <button
                onClick={() => {
                  onEditGoal?.(goal.id, editingGoalTitle);
                  setEditingGoal(false);
                }}
                className="text-emerald-600 text-sm px-3"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{goal.title}</h3>
              <button
                onClick={() => setEditingGoal(true)}
                className="text-zinc-400 hover:text-zinc-600 px-1"
              >
                ✎
              </button>
              <button
                onClick={() => setGoalToDelete(true)}
                className="text-red-400 hover:text-red-600 px-1"
              >
                🗑️
              </button>
            </div>
          )}
          <span className="text-sm px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">
            {goal.type}
          </span>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold">{progress}%</div>
          <div className="text-xs text-zinc-500">Yearly Progress</div>
        </div>
      </div>

      {/* HABITS */}
      <div className="mb-6">
        <h4 className="font-medium mb-2 text-sm text-zinc-500">HABITS</h4>

        <div className="space-y-2">
          {goalHabits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between text-sm">
              {editingHabitId === habit.id ? (
                <div className="flex gap-2 flex-1">
                  <input
                    value={editingHabitName}
                    onChange={(e) => setEditingHabitName(e.target.value)}
                    className="modern-input flex-1 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onEditHabit?.(habit.id, editingHabitName);
                        setEditingHabitId(null);
                      }
                      if (e.key === 'Escape') setEditingHabitId(null);
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      onEditHabit?.(habit.id, editingHabitName);
                      setEditingHabitId(null);
                    }}
                    className="text-emerald-600 text-xs px-2"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span>{habit.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">
                      {getHabitProgress(habit.id, logs, goal.year)}%
                    </span>
                    <button
                      onClick={() => {
                        setEditingHabitId(habit.id);
                        setEditingHabitName(habit.name);
                      }}
                      className="text-zinc-400 hover:text-zinc-600 px-1"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => setHabitToDelete(habit.id)}
                      className="text-red-400 hover:text-red-600 px-1"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add Habit - Always visible inline form */}
        {onAddHabit && (
          <div className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="New habit name..."
                className="modern-input flex-1 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddHabit();
                }}
              />
              <button onClick={handleAddHabit} className="modern-button text-sm px-4">
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MILESTONES */}
      <div>
        <h4 className="font-medium mb-2 text-sm text-zinc-500">MILESTONES</h4>

        {/* Always visible Add Milestone Form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={newMilestoneTitle}
            onChange={(e) => setNewMilestoneTitle(e.target.value)}
            placeholder="Milestone title..."
            className="modern-input flex-1 text-sm"
          />

          <select
            value={newMilestoneMonth}
            onChange={(e) => setNewMilestoneMonth(e.target.value ? Number(e.target.value) : '')}
            className="modern-input w-full sm:w-40 text-sm"
          >
            <option value="">Select month *</option>
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>

          <button 
            onClick={handleAddMilestone} 
            disabled={!newMilestoneTitle.trim() || !newMilestoneMonth}
            className="modern-button text-sm px-6 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Add
          </button>
        </div>

        {/* Milestones List */}
        {goal.milestones && goal.milestones.length > 0 ? (
          <div className="space-y-2">
            {goal.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={milestone.achieved}
                    onChange={() => onToggleMilestone(goal.id, milestone.id)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className={milestone.achieved ? 'line-through text-zinc-400' : ''}>
                    {milestone.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {/* Month Display */}
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {milestone.month 
                      ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][milestone.month - 1] 
                      : 'No month'}
                  </span>

                  <button
                    onClick={() => setMilestoneToDelete(milestone.id)}
                    className="text-red-400 hover:text-red-600 px-2 text-lg leading-none"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-400 italic">No milestones yet</p>
        )}
      </div>

      {/* Confirm Modals */}
      <ConfirmModal
        open={habitToDelete !== null}
        title="Delete Habit"
        message="Delete this habit?"
        onCancel={() => setHabitToDelete(null)}
        onConfirm={() => {
          if (habitToDelete) onDeleteHabit?.(habitToDelete);
          setHabitToDelete(null);
        }}
      />

      <ConfirmModal
        open={milestoneToDelete !== null}
        title="Delete Milestone"
        message="Delete this milestone?"
        onCancel={() => setMilestoneToDelete(null)}
        onConfirm={() => {
          if (milestoneToDelete) onDeleteMilestone(goal.id, milestoneToDelete);
          setMilestoneToDelete(null);
        }}
      />

      <ConfirmModal
        open={goalToDelete}
        title="Delete Goal"
        message={`Delete "${goal.title}" and all its data?`}
        onCancel={() => setGoalToDelete(false)}
        onConfirm={() => {
          onDeleteGoal?.(goal.id);
          setGoalToDelete(false);
        }}
      />
    </div>
  );
}