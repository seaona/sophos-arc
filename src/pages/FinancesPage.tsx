import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import MonthNavigator from '../components/MonthNavigator';        // ← Fixed import
import AddPortfolioElementForm from '../components/finances/AddPortfolioElementForm';
import PortfolioTable from '../components/finances/PortfolioTable';
import PortfolioChart, { PortfolioAllocationChart } from '../components/finances/PortfolioChart';
import ConfirmModal from '../components/ConfirmModal';
import { usePortfolio } from '../hooks/usePortfolio';

export default function FinancesPage() {
  const {
    portfolio,
    year,
    setYear,
    addElement,
    updateValue,
    renameElement,
    deleteElement,
    allocations,
    totalAllocation,
    addAllocation,
    updateAllocation,
    deleteAllocation,
  } = usePortfolio();

  const totalInvested = portfolio.reduce(
    (sum, el) => sum + (el.monthlyValues?.[year]?.[12]?.invested || 0),
    0
  );

  const totalValue = portfolio.reduce(
    (sum, el) => sum + (el.monthlyValues?.[year]?.[12]?.value || 0),
    0
  );

  const gain = totalValue - totalInvested;

  const [elementToDelete, setElementToDelete] = useState<any>(null);
  const [newAllocName, setNewAllocName] = useState('');

  // Create a Date object for the navigator
  const currentDate = new Date(year, 0, 1); // January of the selected year

  const handleDateChange = (date: Date) => {
    setYear(date.getFullYear());
  };

  return (
    <AppLayout>
      <MonthNavigator
        currentDate={currentDate}
        setCurrentDate={handleDateChange}
      />

      <AddPortfolioElementForm onAdd={addElement} />

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6">
          <div className="text-sm text-zinc-500 mb-2">Invested</div>
          <div className="text-2xl font-semibold">€{totalInvested.toLocaleString()}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-sm text-zinc-500 mb-2">Current Value</div>
          <div className="text-2xl font-semibold">€{totalValue.toLocaleString()}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-sm text-zinc-500 mb-2">Gain / Loss</div>
          <div className={`text-2xl font-semibold ${gain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {gain >= 0 ? '+' : '-'}€{Math.abs(gain).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Portfolio Evolution */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Portfolio Evolution</h2>
        <PortfolioChart portfolio={portfolio} year={year} />
      </div>

      {/* Financial Strategy */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Financial Strategy</h2>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Pie Chart */}
          <div className="flex flex-col items-center">
            <div className="w-full">   {/* ← Important wrapper */}
              <PortfolioAllocationChart allocations={allocations} />
            </div>
            <div className="mt-6 text-center">
              <span className="text-sm text-zinc-500">Total Allocated: </span>
              <span className={`font-semibold ${totalAllocation === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {totalAllocation}%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {allocations.map((alloc) => (
              <div
                key={alloc.id}
                className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800"
              >
                <input
                  value={alloc.name}
                  onChange={(e) => updateAllocation(alloc.id, e.target.value, alloc.percentage)}
                  className="modern-input flex-1"
                />
                <div className="flex items-center gap-2 w-28">
                  <input
                    type="number"
                    value={alloc.percentage}
                    onChange={(e) => updateAllocation(alloc.id, alloc.name, Number(e.target.value))}
                    className="modern-input w-20 text-center"
                  />
                  <span className="text-zinc-400">%</span>
                </div>
                <button
                  onClick={() => deleteAllocation(alloc.id)}
                  className="text-zinc-400 hover:text-red-500 p-2"
                >
                  🗑️
                </button>
              </div>
            ))}

            {/* Add New Allocation */}
            <div className="flex gap-2">
              <input
                value={newAllocName}
                onChange={(e) => setNewAllocName(e.target.value)}
                placeholder="New allocation category..."
                className="modern-input flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addAllocation(newAllocName);
                    setNewAllocName('');
                  }
                }}
              />
              <button
                onClick={() => {
                  addAllocation(newAllocName);
                  setNewAllocName('');
                }}
                disabled={!newAllocName.trim()}
                className="modern-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {totalAllocation !== 100 && (
              <p className="text-amber-600 text-sm">⚠️ Total should be 100%</p>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="glass-card p-8">
        <PortfolioTable
          portfolio={portfolio}
          year={year}
          updateValue={updateValue}
          renameElement={renameElement}
          deleteElement={(id) => {
            const element = portfolio.find((p) => p.id === id);
            if (element) setElementToDelete(element);
          }}
        />
      </div>

      <ConfirmModal
        open={elementToDelete !== null}
        title="Delete Portfolio Element"
        message={`Delete "${elementToDelete?.name}"?`}
        onCancel={() => setElementToDelete(null)}
        onConfirm={() => {
          if (elementToDelete) deleteElement(elementToDelete.id);
          setElementToDelete(null);
        }}
      />
    </AppLayout>
  );
}