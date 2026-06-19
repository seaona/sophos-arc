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
  LineChart,
  Line,
} from 'recharts';

import type { PortfolioElement, PortfolioAllocation } from '../../types/portfolio';

type PortfolioChartProps = {
  portfolio: PortfolioElement[];
  year: number;
};

type AllocationChartProps = {
  allocations: PortfolioAllocation[];
};

type MortgageLineChartProps = {
  data: any[];
};

type MortgageBarChartProps = {
  data: any[];
};

// Reused colors
const COLORS = [
  '#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b',
  '#ef4444', '#22c55e', '#ec4899', '#06b6d4'
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ==================== MAIN PORTFOLIO CHART ====================
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

// ==================== ALLOCATION PIE CHART ====================
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
      <div className="h-[320px] flex flex-col items-center justify-center text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl">
        <div className="text-5xl mb-3 opacity-50">📊</div>
        <p>No allocations yet</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={validData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            dataKey="value"
            labelLine={false}
            label={({ name, value }) => `${name} ${value}%`}
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

// ==================== MORTGAGE CHARTS ====================
export function MortgageRemainingChart({ data }: MortgageLineChartProps) {
  const values = data.map(d => d.remainingInstallments).filter(v => v > 0);
  const minValue = values.length ? Math.min(...values) : 300;
  const maxValue = values.length ? Math.max(...values) : 400;

  const yMin = Math.max(0, Math.floor(minValue * 0.95));
  const yMax = Math.ceil(maxValue * 1.05);

  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="monthName" tickLine={false} />
          <YAxis 
            domain={[yMin, yMax]} 
            tickCount={8}
            allowDecimals={false}
          />
          <Tooltip formatter={(value: number) => [value, "Remaining Installments"]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="remainingInstallments"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 8 }}
            name="Remaining Installments"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MortgageExtraSavingsChart({ data }: MortgageBarChartProps) {
  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="monthName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="extraPayment" fill="#14b8a6" name="Extra Payment (€)" />
          <Bar dataKey="savedThisMonth" fill="#f59e0b" name="Saved (€)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}