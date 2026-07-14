import { useState } from 'react';

type Props = {
  onAdd: (
    name: string, 
    startDate: string, 
    endDate?: string, 
    frequency?: string, 
    quantity?: string
  ) => void;
};

export default function AddSupplementForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [frequency, setFrequency] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate) return;

    onAdd(
      name.trim(), 
      startDate, 
      endDate || undefined, 
      frequency || undefined, 
      quantity || undefined
    );

    // Reset form
    setName('');
    setStartDate('');
    setEndDate('');
    setFrequency('');
    setQuantity('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
      <h3 className="font-semibold mb-4">Add New Supplement / Intake</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Supplement name (e.g. Vitamin D3)"
          className="modern-input"
          required
        />

        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="modern-input"
        >
          <option value="">Frequency (optional)</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="As needed">As needed</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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

        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity (e.g. 1 tablet, 500mg)"
          className="modern-input"
        />

        <button type="submit" className="modern-button">
          Add Supplement
        </button>
      </div>
    </form>
  );
}