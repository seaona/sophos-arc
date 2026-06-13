import { useState } from 'react';

type Props = {
  onAddGoal: (title: string) => void;
};

export default function AddGoalForm({
  onAddGoal
}: Props) {
  const [title, setTitle] = useState('');

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!title.trim()) return;

    onAddGoal(title.trim());

    setTitle('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-6 mb-6"
    >
      <div className="flex gap-3">
        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Add goal..."
          className="modern-input flex-1"
        />

        <button
          type="submit"
          className="modern-button"
        >
          Add Goal
        </button>
      </div>
    </form>
  );
}