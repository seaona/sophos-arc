import { useState } from 'react';

type Props = {
  onAdd: (name: string) => void;
};

export default function AddCategoryForm({ onAdd }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd(name.trim());
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 mb-6">
      <h3 className="font-semibold mb-4">Add Category</h3>
      <div className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name (e.g. ETFs, Stocks, Crypto)"
          className="modern-input flex-1"
          required
        />
        <button type="submit" className="modern-button">
          Add
        </button>
      </div>
    </form>
  );
}