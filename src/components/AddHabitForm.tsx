import { useState } from 'react';

type Props = {
  onAddHabit: (
    name: string,
    goalId: string
  ) => void;

  goals: {
    id: string;
    title: string;
  }[];
};

export default function AddHabitForm({ onAddHabit, goals = [] }: Props) {
  const [name, setName] = useState('');
  const [goalId, setGoalId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    if (!goalId) return;

    onAddHabit(
      name.trim(),
      goalId
    );

    // After submit
    setName('');
    setGoalId('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-4 flex gap-3 items-center"
    >
     <div className="flex flex-col md:flex-row gap-3">
        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Habit name..."
          className="modern-input flex-1"
        />

        <select
          value={goalId}
          onChange={(e) =>
            setGoalId(e.target.value)
          }
          className="modern-input"
        >
          <option value="">
            Select goal
          </option>

          {goals.map((goal) => (
            <option
              key={goal.id}
              value={goal.id}
            >
              {goal.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="modern-button"
        >
          Add Habit
        </button>
      </div>
    </form>
  );
}