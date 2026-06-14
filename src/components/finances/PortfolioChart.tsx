import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import type { PortfolioElement, PortfolioAllocation } from '../../types/portfolio';

type PortfolioChartProps = {
  portfolio: PortfolioElement[];
  year: number;
};

type AllocationChartProps = {
  allocations: PortfolioAllocation[];
};

// Reused colors
const COLORS = [
  '#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b',
  '#ef4444', '#22c55e', '#ec4899', '#06b6d4'
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Main Portfolio Evolution Chart
export default function PortfolioChart({ portfolio, year }: PortfolioChartProps) {
  const data = MONTHS.map((monthName, index) => {
    const month = index + 1;
    const row: Record<string, string | number> = { month: monthName };

    portfolio.forEach((element) => {
      row[element.name] = element.monthlyValues?.[year]?.[month]?.value || 0;
    });

    return row;
  });

  return (
    <div className="h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `€${value.toLocaleString()}`} />
          <Tooltip formatter={(value) => [`€${Number(value).toLocaleString()}`, '']} />
          <Legend />
          {portfolio.map((element, index) => (
            <Bar
              key={element.id}
              dataKey={element.name}
              stackId="portfolio"
              fill={COLORS[index % COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// components/finances/PortfolioChart.tsx

export function PortfolioAllocationChart({ allocations }: AllocationChartProps) {
  const validData = allocations
    .filter((a) => a.percentage > 0)
    .map((a, i) => ({
      name: a.name,
      value: a.percentage,
      fill: COLORS[i % COLORS.length],
    }));

  if (validData.length === 0) {
    return (
      <div className="h-[360px] flex flex-col items-center justify-center text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl">
        <div className="text-6xl mb-4 opacity-50">📊</div>
        <p className="text-lg font-medium">No allocations yet</p>
        <p className="text-sm mt-1">Add categories and percentages on the right</p>
      </div>
    );
  }

  return (
    <div className="h-[380px] w-full">   {/* ← More robust height */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={validData}
            cx="50%"
            cy="50%"
            innerRadius={88}
            outerRadius={138}
            dataKey="value"
            labelLine={false}
            label={({ name, value }) => `${name}\n${value}%`}
          >
            {validData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value}%`, '']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}