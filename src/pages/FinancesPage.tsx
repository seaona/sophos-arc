import AppLayout from '../components/AppLayout';

import YearNavigator from '../components/goals/YearNavigator';

import AddPortfolioElementForm from '../components/finances/AddPortfolioElementForm';

import PortfolioTable from '../components/finances/PortfolioTable';

import { usePortfolio } from '../hooks/usePortfolio';
import PortfolioChart from '../components/finances/PortfolioChart';

export default function FinancesPage() {
  const {
    portfolio,
    year,
    setYear,
    addElement,
    updateValue,
    renameElement,
    deleteElement
  } = usePortfolio();

  const totalInvested =
    portfolio.reduce(
      (sum, element) =>
        sum +
        (element.monthlyValues?.[
          year
        ]?.[12]?.invested || 0),
      0
    );

  const totalValue =
    portfolio.reduce(
      (sum, element) =>
        sum +
        (element.monthlyValues?.[
          year
        ]?.[12]?.value || 0),
      0
    );

  const gain =
    totalValue - totalInvested;

  return (
    <AppLayout>
      <YearNavigator
        year={year}
        setYear={setYear}
      />

      <AddPortfolioElementForm
        onAdd={addElement}
      />

        <div className="grid md:grid-cols-3 gap-4 mb-8">
    <div className="glass-card p-6">
      <div className="text-sm text-zinc-500 mb-2">
        Invested
      </div>

      <div className="text-2xl font-semibold">
        €{totalInvested.toLocaleString()}
      </div>
    </div>

    <div className="glass-card p-6">
      <div className="text-sm text-zinc-500 mb-2">
        Current Value
      </div>

      <div className="text-2xl font-semibold">
        €{totalValue.toLocaleString()}
      </div>
    </div>

    <div className="glass-card p-6">
      <div className="text-sm text-zinc-500 mb-2">
        Gain / Loss
      </div>

      <div
        className={`text-2xl font-semibold ${
          gain >= 0
            ? 'text-emerald-600'
            : 'text-red-500'
        }`}
      >
        {gain >= 0 ? '+' : '-'}€
        {Math.abs(gain).toLocaleString()}
      </div>
    </div>
  </div>

      <div className="glass-card p-8 mb-8">
      <h2 className="text-xl font-semibold mb-6">
        Portfolio Evolution
      </h2>

      <PortfolioChart
        portfolio={portfolio}
        year={year}
      />
    </div>

      <div className="glass-card p-8 mt-8">
        <PortfolioTable
            portfolio={portfolio}
            year={year}
            updateValue={updateValue}
            renameElement={renameElement}
            deleteElement={deleteElement}
        />
      </div>
    </AppLayout>
  );
}