import { useState } from 'react';

type Props = {
  onAddHabit: (name: string) => void;
};

export default function AddHabitForm({ onAddHabit }: Props) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    onAddHabit(name);
    setName('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-4 flex gap-3 items-center"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Add a habit..."
        className="modern-input flex-1"
      />

      <button
        type="submit"
        className="modern-button"
      >
        Add Habit
      </button>
    </form>
  );
}