import { useState } from 'react';

type Props = {
  onAdd: (name: string, startDate: string, endDate?: string) => void;
};

export default function AddSupplementForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate) return;

    onAdd(name.trim(), startDate, endDate || undefined);
    
    // Reset form
    setName('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
      <h3 className="font-semibold mb-4">Add New Supplement / Intake</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Supplement name (e.g. Vitamin D, Omega-3)"
          className="modern-input"
          required
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="modern-input"
          required
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="modern-input"
          placeholder="End date (optional)"
        />

        <button type="submit" className="modern-button">
          Add Supplement
        </button>
      </div>
    </form>
  );
}