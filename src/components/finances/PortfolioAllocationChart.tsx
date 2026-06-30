import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type CategoryValue = {
  name: string;
  value: number;
};

type Props = {
  categoryValues: CategoryValue[];
};

const COLORS = [
  '#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', 
  '#ef4444', '#22c55e', '#ec4899', '#06b6d4'
];

export default function PortfolioAllocationChart({ categoryValues }: Props) {
  const total = categoryValues.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="h-[360px] flex items-center justify-center text-zinc-500">
        No portfolio data yet
      </div>
    );
  }

  const dataWithPercent = categoryValues.map((item) => ({
    ...item,
    percent: ((item.value / total) * 100).toFixed(1),
  }));

  return (
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={130}
            dataKey="value"
            nameKey="name"
          >
            {dataWithPercent.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>

          <Tooltip 
            formatter={(value: number) => [`€${value.toLocaleString()}`, 'Value']} 
          />

          <Legend 
            formatter={(value, entry) => {
              const item = dataWithPercent.find(d => d.name === value);
              return `${value} (${item?.percent}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}