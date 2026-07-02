import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import YearNavigator from '../components/goals/YearNavigator';
import AddPortfolioElementForm from '../components/finances/AddPortfolioElementForm';
import PortfolioTable from '../components/finances/PortfolioTable';
import PortfolioChart, {
  MortgageRemainingChart,
  MortgageExtraSavingsChart 
} from '../components/finances/PortfolioChart';
import PortfolioAllocationChart from '../components/finances/PortfolioAllocationChart';
import ConfirmModal from '../components/ConfirmModal';
import { usePortfolio } from '../hooks/usePortfolio';
import { useMortgage } from '../hooks/useMortgage';
import AddCategoryForm from '../components/finances/AddCategoryForm';

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
    categories,
    addCategory,
  } = usePortfolio();

  const {
    mortgages,
    addMortgage,
    deleteMortgage,
    updateMonthlyData,
    getMonthlyDataForYear,
} = useMortgage();

  // Totals across all months of the year
  // Total Invested = Sum of all invested (including Initial/month 0)
const totalInvested = portfolio.reduce((sum, el) => {
  const yearData = el.monthlyValues?.[year] || {};
  return sum + Object.values(yearData).reduce((s, m) => s + (m.invested || 0), 0);
}, 0);

// Current Value = Sum of the latest available "value" for each element
const currentValue = portfolio.reduce((sum, el) => {
  const yearData = el.monthlyValues?.[year] || {};
  // Get the latest month that has data
  const latestMonth = Math.max(...Object.keys(yearData).map(Number));
  const latestValue = yearData[latestMonth]?.value || 0;
  return sum + latestValue;
}, 0);

const gain = currentValue - totalInvested;

  const totalValue = portfolio.reduce((sum, el) => {
    const yearData = el.monthlyValues?.[year] || {};
    return sum + Object.values(yearData).reduce((s, m) => s + (m.value || 0), 0);
  }, 0);

  const [elementToDelete, setElementToDelete] = useState<any>(null);
  const [newAllocName, setNewAllocName] = useState('');


  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});

// In FinancesPage.tsx - Financial Strategy section
  const categoryValues = categories.map(category => {
    const elementsInCategory = portfolio.filter(el => el.categoryId === category.id);
    
    const totalValue = elementsInCategory.reduce((sum, el) => {
      const yearData = el.monthlyValues?.[year] || {};
      const latestMonth = Math.max(0, ...Object.keys(yearData).map(Number));
      return sum + (yearData[latestMonth]?.value || 0);
    }, 0);

    return {
      name: category.name,
      value: totalValue,
    };
  }).filter(cat => cat.value > 0);

  return (
    <AppLayout>
      <YearNavigator year={year} setYear={setYear} />

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6">
          <div className="text-sm text-zinc-500 mb-2">Total Invested</div>
          <div className="text-2xl font-semibold">€{totalInvested.toLocaleString()}</div>
        </div>
        <div className="glass-card p-6">
          <div className="text-sm text-zinc-500 mb-2">Current Portfolio Value</div>
          <div className="text-2xl font-semibold">€{currentValue.toLocaleString()}</div>
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
          
          {/* Pie Chart - Now based on Categories */}
          <div>
            <div className="w-full">
              <PortfolioAllocationChart 
                categoryValues={categoryValues} 
              />
            </div>
          </div>

          {/* Category Summary List */}
          <div className="space-y-3">
            {categoryValues.length > 0 ? (
              categoryValues.map((cat, index) => {
                const totalValue = categoryValues.reduce((sum, c) => sum + c.value, 0);
                const percent = totalValue > 0 ? ((cat.value / totalValue) * 100).toFixed(1) : '0';

                return (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60"
                  >
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-right">
                      <div className="font-semibold">€{cat.value.toLocaleString()}</div>
                      <div className="text-xs text-zinc-500">{percent}%</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-zinc-500">
                Add categories and portfolio elements to see your strategy
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Elements */}
      
      <div className="glass-card p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Portfolio Elements</h2>
        </div>

        {/* Add Category Form */}
        <AddCategoryForm onAdd={addCategory} />

        {/* Add Portfolio Element Form */}
        <AddPortfolioElementForm 
          onAdd={addElement} 
          categories={categories} 
        />
        <PortfolioTable
          portfolio={portfolio}
          year={year}
          categories={categories} 
          updateValue={updateValue}
          renameElement={renameElement}
          deleteElement={(id) => {
            const element = portfolio.find((p) => p.id === id);
            if (element) setElementToDelete(element);
          }}
        />
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

        {/* List of Mortgages */}
        {mortgages.length > 0 ? (
          mortgages.map((mortgageItem) => {
            // Get calculated monthly data (with automatic remainingInstallments)
            const currentYearMonthly = getMonthlyDataForYear(mortgageItem.id, year);

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

            // Collapse state for this mortgage
            const isExpanded = expandedTables[mortgageItem.id] ?? true;

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
                <div className="grid lg:grid-cols-2 gap-8 mb-6">
                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4">Remaining Payments</h3>
                    <MortgageRemainingChart data={chartData} />
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="font-semibold mb-4">Extra Payments vs Savings</h3>
                    <MortgageExtraSavingsChart data={chartData} />
                  </div>
                </div>

                {/* Monthly Data Header with Arrow (Left side) */}
              {/* Monthly Data Header with Square Toggle Button */}
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() =>
                      setExpandedTables((prev) => ({
                        ...prev,
                        [mortgageItem.id]: !prev[mortgageItem.id],
                      }))
                    }
                    className="modern-button w-8 h-8 p-0 flex items-center justify-center text-sm"
                    aria-label="Toggle table"
                  >
                    {(expandedTables[mortgageItem.id] ?? true) ? '▼' : '▶'}
                  </button>

                  <h3 className="font-semibold">Monthly Data</h3>
                </div>

                {/* Monthly Table (Collapsible) */}
                {(expandedTables[mortgageItem.id] ?? true) && (
                  <div className="overflow-auto">
                    <table className="w-full text-sm border-collapse">
                        <tr>
                          <th className="sticky left-0 p-3 bg-white dark:bg-zinc-900 border-b text-left">Month</th>
                          <th className="p-3 bg-white dark:bg-zinc-900 border-b text-center">Extra Payment (€)</th>
                          <th className="p-3 bg-white dark:bg-zinc-900 border-b text-center">Extra Payments</th>
                          <th className="p-3 bg-white dark:bg-zinc-900 border-b text-center">Saved This Month (€)</th>
                          <th className="p-3 bg-white dark:bg-zinc-900 border-b text-center">Remaining Payments</th>
                        </tr>
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
                            <td className="p-3 border-b text-center font-medium">
                              {m.remainingInstallments}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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