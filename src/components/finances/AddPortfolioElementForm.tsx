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
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Portfolio element name"
          className="modern-input flex-1"
        />
        <button type="submit" className="modern-button whitespace-nowrap">
          Add Element
        </button>
      </div>
    </form>
  );
}