import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import YearNavigator from '../components/goals/YearNavigator';
import AddPortfolioElementForm from '../components/finances/AddPortfolioElementForm';
import PortfolioTable from '../components/finances/PortfolioTable';
import PortfolioChart, { 
  PortfolioAllocationChart,
  MortgageRemainingChart,
  MortgageExtraSavingsChart 
} from '../components/finances/PortfolioChart';
import ConfirmModal from '../components/ConfirmModal';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMortgage } from '../hooks/useMortgage';

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

  const {
  mortgages,
  addMortgage,
  deleteMortgage,
  updateMortgageSetup,
  updateMonthlyData,
  monthlyData,
  getMonthlyDataForMortgage,
} = useMortgage();

  // Totals across all months of the year
  const totalInvested = portfolio.reduce((sum, el) => {
    const yearData = el.monthlyValues?.[year] || {};
    return sum + Object.values(yearData).reduce((s, m) => s + (m.invested || 0), 0);
  }, 0);

  const totalValue = portfolio.reduce((sum, el) => {
    const yearData = el.monthlyValues?.[year] || {};
    return sum + Object.values(yearData).reduce((s, m) => s + (m.value || 0), 0);
  }, 0);

  const gain = totalValue - totalInvested;

  const [elementToDelete, setElementToDelete] = useState<any>(null);
  const [newAllocName, setNewAllocName] = useState('');

  // Mortgage data for current year
  const currentYearMonthly = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const existing = monthlyData.find((m) => m.month === month);
    return existing || { month, extraPayment: 0, extraInstallments: 0, savedThisMonth: 0, remainingInstallments: 0 };
  });

  const chartData = currentYearMonthly.map((m, i) => ({
    monthName: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    remainingInstallments: m.remainingInstallments,
    extraPayment: m.extraPayment,
    savedThisMonth: m.savedThisMonth,
  }));

  const yearExtraPaid = currentYearMonthly.reduce((sum, m) => sum + m.extraPayment, 0);
  const yearSaved = currentYearMonthly.reduce((sum, m) => sum + m.savedThisMonth, 0);
  const totalReducedThisYear = currentYearMonthly.reduce((sum, m) => sum + m.extraInstallments, 0);
  const remainingAtEndOfYear = currentYearMonthly[11]?.remainingInstallments || 0;

  return (
    <AppLayout>
      <YearNavigator year={year} setYear={setYear} />

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6">
          <div className="text-sm text-zinc-500 mb-2">Invested (this year)</div>
          <div className="text-2xl font-semibold">€{totalInvested.toLocaleString()}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-sm text-zinc-500 mb-2">Current Value (this year)</div>
          <div className="text-2xl font-semibold">€{totalValue.toLocaleString()}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-sm text-zinc-500 mb-2">Gain / Loss (this year)</div>
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

      {/* Portfolio Elements */}
      <div className="glass-card p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Portfolio Elements</h2>
        </div>
        <AddPortfolioElementForm onAdd={addElement} />
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

      {/* Financial Strategy */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Financial Strategy</h2>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: Allocation Chart */}
          <div>
            <div className="w-full">
              <PortfolioAllocationChart allocations={allocations} />
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-zinc-500">Total Allocated: </span>
              <span className={`font-semibold ${totalAllocation === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {totalAllocation}%
              </span>
            </div>
          </div>

          {/* Right: Allocations + Add Form */}
          <div className="space-y-4">
            {allocations.map((alloc) => (
              <div 
                key={alloc.id} 
                className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60"
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

            {/* Add New */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
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
          </div>
        </div>
      </div>

      {/* Mortgage Section */}
      {/* ==================== MORTGAGE SECTION ==================== */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Mortgages</h2>

        {/* Add New Mortgage Form */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-semibold mb-4">Add New Mortgage</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);

              addMortgage({
                name: formData.get('name') as string,
                loanAmount: Number(formData.get('loanAmount')),
                annualInterestRate: Number(formData.get('annualInterestRate')),
                totalYears: Number(formData.get('totalYears')),
                startDate: formData.get('startDate') as string,
              });

              form.reset();
            }}
            className="grid md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            <div>
              <div className="text-sm text-zinc-500 mb-1">Mortgage Name</div>
              <input type="text" name="name" placeholder="Main Home" className="modern-input w-full" required />
            </div>
            <div>
              <div className="text-sm text-zinc-500 mb-1">Loan Amount (€)</div>
              <input type="number" name="loanAmount" className="modern-input w-full" placeholder="250000" required />
            </div>
            <div>
              <div className="text-sm text-zinc-500 mb-1">Interest Rate (%)</div>
              <input type="number" step="0.01" name="annualInterestRate" className="modern-input w-full" placeholder="3.25" required />
            </div>
            <div>
              <div className="text-sm text-zinc-500 mb-1">Term (Years)</div>
              <input type="number" name="totalYears" className="modern-input w-full" placeholder="25" required />
            </div>
            <div>
              <div className="text-sm text-zinc-500 mb-1">Start Date</div>
              <input type="month" name="startDate" className="modern-input w-full" required />
            </div>

            <div className="lg:col-span-5 flex justify-end mt-2">
              <button type="submit" className="modern-button">Add Mortgage</button>
            </div>
          </form>
        </div>

        {/* Mortgages List */}
        {mortgages.length > 0 ? (
          mortgages.map((mortgageItem) => {
            const mortgageMonthlyData = getMonthlyDataForMortgage(mortgageItem.id, year);

            const currentYearMonthly = Array.from({ length: 12 }, (_, i) => {
              const month = i + 1;
              const existing = mortgageMonthlyData.find((m) => m.month === month);
              return (
                existing || {
                  mortgageId: mortgageItem.id,
                  year,
                  month,
                  extraPayment: 0,
                  extraInstallments: 0,
                  savedThisMonth: 0,
                  remainingInstallments: 0,
                }
              );
            });

            const chartData = currentYearMonthly.map((m, i) => ({
              monthName: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
              remainingInstallments: m.remainingInstallments,
              extraPayment: m.extraPayment,
              savedThisMonth: m.savedThisMonth,
            }));

            const yearExtraPaid = currentYearMonthly.reduce((sum, m) => sum + m.extraPayment, 0);
            const yearSaved = currentYearMonthly.reduce((sum, m) => sum + m.savedThisMonth, 0);
            const totalReducedThisYear = currentYearMonthly.reduce((sum, m) => sum + m.extraInstallments, 0);
            const remainingAtEndOfYear = currentYearMonthly[11]?.remainingInstallments || 0;

            return (
              <div key={mortgageItem.id} className="mb-12 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6">
                {/* Mortgage Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">{mortgageItem.name}</h3>
                    <div className="text-sm text-zinc-500 mt-1">
                      €{mortgageItem.loanAmount.toLocaleString()} • {mortgageItem.annualInterestRate}% • {mortgageItem.totalYears} years • Started {mortgageItem.startDate}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMortgage(mortgageItem.id)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    🗑️
                  </button>
                </div>

                {/* Year Summary */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="glass-card p-6 text-center">
                    <div className="text-sm text-zinc-500">Remaining Payments</div>
                    <div className="text-3xl font-semibold mt-1">{remainingAtEndOfYear}</div>
                  </div>
                  <div className="glass-card p-6 text-center">
                    <div className="text-sm text-zinc-500">Payments Reduced</div>
                    <div className="text-3xl font-semibold mt-1 text-emerald-600">-{totalReducedThisYear}</div>
                  </div>
                  <div className="glass-card p-6 text-center">
                    <div className="text-sm text-zinc-500">Extra Paid</div>
                    <div className="text-3xl font-semibold mt-1">€{yearExtraPaid.toLocaleString()}</div>
                  </div>
                  <div className="glass-card p-6 text-center">
                    <div className="text-sm text-zinc-500">Total Saved</div>
                    <div className="text-3xl font-semibold mt-1 text-emerald-600">€{yearSaved.toLocaleString()}</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8 mb-10">
                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4">Remaining Installments</h3>
                    <MortgageRemainingChart data={chartData} />
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4">Extra Payments vs Savings</h3>
                    <MortgageExtraSavingsChart data={chartData} />
                  </div>
                </div>

                {/* Monthly Table */}
                <div className="overflow-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="sticky left-0 p-3 bg-white dark:bg-zinc-900 border-b text-left">Month</th>
                        <th className="p-3 bg-white dark:bg-zinc-900 border-b text-center">Extra Payment (€)</th>
                        <th className="p-3 bg-white dark:bg-zinc-900 border-b text-center">Extra Installments</th>
                        <th className="p-3 bg-white dark:bg-zinc-900 border-b text-center">Saved This Month (€)</th>
                        <th className="p-3 bg-white dark:bg-zinc-900 border-b text-center">Remaining Installments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentYearMonthly.map((m) => (
                        <tr key={m.month}>
                          <td className="sticky left-0 p-3 bg-white dark:bg-zinc-900 font-medium border-b">
                            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m.month-1]} {year}
                          </td>
                          <td className="p-3 border-b">
                            <input
                              type="number"
                              value={m.extraPayment}
                              onChange={(e) =>
                                updateMonthlyData(mortgageItem.id, year, m.month, { extraPayment: Number(e.target.value) })
                              }
                              className="modern-input w-full text-center"
                            />
                          </td>
                          <td className="p-3 border-b">
                            <input
                              type="number"
                              value={m.extraInstallments}
                              onChange={(e) =>
                                updateMonthlyData(mortgageItem.id, year, m.month, { extraInstallments: Number(e.target.value) })
                              }
                              className="modern-input w-full text-center"
                            />
                          </td>
                          <td className="p-3 border-b">
                            <input
                              type="number"
                              value={m.savedThisMonth}
                              onChange={(e) =>
                                updateMonthlyData(mortgageItem.id, year, m.month, { savedThisMonth: Number(e.target.value) })
                              }
                              className="modern-input w-full text-center"
                            />
                          </td>
                          <td className="p-3 border-b">
                            <input
                              type="number"
                              value={m.remainingInstallments}
                              onChange={(e) =>
                                updateMonthlyData(mortgageItem.id, year, m.month, { remainingInstallments: Number(e.target.value) })
                              }
                              className="modern-input w-full text-center"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-zinc-500">
            No mortgages added yet. Use the form above to add one.
          </div>
        )}
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