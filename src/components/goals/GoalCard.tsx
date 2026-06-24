import { useState } from 'react';
import type { Goal, Milestone } from '../../types/goal';
import type { Habit } from '../../types/habit';
import type { HabitLogs } from '../../types/habit';
import { calculateGoalProgress } from '../../utils/goalProgress';

type Props = {
  goal: Goal;
  habits: Habit[];
  logs: HabitLogs;
  onAddMilestone: (goalId: string, title: string, weight?: number, month?: number) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDeleteMilestone: (goalId: string, milestoneId: string) => void;
  onUpdateMilestone: (goalId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  onUpdateWeight?: (goalId: string, itemId: string, weight: number) => void;
  onAddHabit?: (name: string, goalId: string) => void;   // ← Add this
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function GoalCard({
  goal,
  habits,
  logs,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  onUpdateMilestone,
  onAddHabit
}: Props) {
  const goalHabits = habits.filter((h) => h.goalId === goal.id);
  const progress = calculateGoalProgress(goal, habits, logs);
  const [newHabitName, setNewHabitName] = useState('');

  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneWeight, setNewMilestoneWeight] = useState(0);
  const [newMilestoneMonth, setNewMilestoneMonth] = useState<number | undefined>(undefined);

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    onAddMilestone(
      goal.id,
      newMilestoneTitle.trim(),
      newMilestoneWeight,
      newMilestoneMonth
    );

    setNewMilestoneTitle('');
    setNewMilestoneWeight(0);
    setNewMilestoneMonth(undefined);
    setShowMilestoneForm(false);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{goal.title}</h3>
          <span className="text-sm px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">
            {goal.type}
          </span>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{progress}%</div>
          <div className="text-xs text-zinc-500">Overall Progress</div>
        </div>
      </div>

      {/* Habits */}
      {goalHabits.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-2 text-sm text-zinc-500">HABITS</h4>
          <div className="space-y-2">
            {goalHabits.map((habit) => (
              <div key={habit.id} className="flex justify-between text-sm">
                <span>{habit.name}</span>
                <span className="font-medium">
                  {calculateGoalProgress(
                    { ...goal, habitIds: [habit.id] },
                    habits,
                    logs
                  )}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {onAddHabit && (
      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="New habit name..."
            className="modern-input flex-1 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newHabitName.trim()) {
                onAddHabit(newHabitName.trim(), goal.id);
                setNewHabitName('');
              }
            }}
          />
          <button
            onClick={() => {
              if (newHabitName.trim()) {
                onAddHabit(newHabitName.trim(), goal.id);
                setNewHabitName('');
              }
            }}
            className="modern-button text-sm px-4"
          >
            Add
          </button>
        </div>
      </div>
    )}

      {/* Milestones */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-sm text-zinc-500">MILESTONES</h4>
          <button
            onClick={() => setShowMilestoneForm(!showMilestoneForm)}
            className="text-xs px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700"
          >
            {showMilestoneForm ? 'Cancel' : '+ Add Milestone'}
          </button>
        </div>

        {/* Inline Add Form */}
        {showMilestoneForm && (
          <form onSubmit={handleAddMilestone} className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              placeholder="Milestone title"
              className="modern-input flex-1 min-w-[180px]"
              autoFocus
            />

            <select
              value={newMilestoneMonth ?? ''}
              onChange={(e) =>
                setNewMilestoneMonth(e.target.value ? Number(e.target.value) : undefined)
              }
              className="modern-input w-28"
            >
              <option value="">No month</option>
              {MONTHS.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={newMilestoneWeight}
              onChange={(e) => setNewMilestoneWeight(Number(e.target.value))}
              placeholder="Weight"
              className="modern-input w-20 text-center"
            />

            <button type="submit" className="modern-button">
              Add
            </button>
          </form>
        )}

        {/* Milestones List */}
        {goal.milestones && goal.milestones.length > 0 ? (
          <div className="space-y-2">
            {goal.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={milestone.achieved}
                    onChange={() => onToggleMilestone(goal.id, milestone.id)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                  <span className={milestone.achieved ? "line-through text-zinc-400" : ""}>
                    {milestone.title}
                  </span>
                  {milestone.month && (
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {MONTHS[milestone.month - 1]}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {/* Month Dropdown (Editable) */}
                  <select
                    value={milestone.month ?? ''}
                    onChange={(e) =>
                      onUpdateMilestone(goal.id, milestone.id, {
                        month: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="text-xs border rounded px-1 py-0.5 bg-transparent"
                  >
                    <option value="">No month</option>
                    {MONTHS.map((monthName, index) => (
                      <option key={index + 1} value={index + 1}>
                        {monthName}
                      </option>
                    ))}
                  </select>

                  {/* Weight */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500">W</span>
                    <input
                      type="number"
                      value={milestone.weight || 0}
                      onChange={(e) =>
                        onUpdateMilestone(goal.id, milestone.id, {
                          weight: Number(e.target.value),
                        })
                      }
                      className="w-12 text-center border rounded px-1 py-0.5 text-sm"
                    />
                  </div>

                  <button
                    onClick={() => onDeleteMilestone(goal.id, milestone.id)}
                    className="text-red-500 hover:text-red-600 px-2 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-400 italic">No milestones yet</p>
        )}
      </div>
    </div>
  );
}