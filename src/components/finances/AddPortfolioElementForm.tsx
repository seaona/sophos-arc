import { useState } from 'react';
import type { Category } from '../../types/portfolio';

type Props = {
  onAdd: (name: string, categoryId: string) => void;
  categories: Category[];
};

export default function AddPortfolioElementForm({ onAdd, categories }: Props) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;

    onAdd(name.trim(), categoryId);
    setName('');
    setCategoryId('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
      <h3 className="font-semibold mb-4">Add Portfolio Element</h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Portfolio element name"
          className="modern-input flex-1"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="modern-input w-48"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type="submit" className="modern-button">
          Add
        </button>
      </div>
    </form>
  );
}