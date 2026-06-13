import { useState } from 'react';

type Props = {
  onAdd: (name: string) => void;
};

export default function AddPortfolioElementForm({
  onAdd
}: Props) {
  const [name, setName] =
    useState('');

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) return;

    onAdd(name);

    setName('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        glass-card
        p-6
        mb-8
      "
    >
      <div className="flex gap-3">
        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="Portfolio element"
          className="
            modern-input
            flex-1
          "
        />

        <button
          className="
            modern-button
          "
        >
          Add
        </button>
      </div>
    </form>
  );
}