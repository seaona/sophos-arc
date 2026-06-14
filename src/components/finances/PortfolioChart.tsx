import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

import type { PortfolioElement } from '../../types/portfolio';

type Props = {
  portfolio: PortfolioElement[];
  year: number;
};

const COLORS = [
  '#14b8a6',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#22c55e',
  '#ec4899',
  '#06b6d4'
];

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
];

export default function PortfolioChart({
  portfolio,
  year
}: Props) {
  const data = MONTHS.map(
    (monthName, index) => {
      const month = index + 1;

      const row: Record<
        string,
        string | number
      > = {
        month: monthName
      };

      portfolio.forEach(
        (element) => {
          row[element.name] =
            element
              .monthlyValues?.[
              year
            ]?.[
              month
            ]?.value || 0;
        }
      );

      return row;
    }
  );

  return (
    <div className="h-[420px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.15}
          />

          <XAxis
            dataKey="month"
          />

          <YAxis
            tickFormatter={(
              value
            ) =>
              `€${value.toLocaleString()}`
            }
          />

          <Tooltip
            formatter={(
              value
            ) => [
              `€${Number(
                value
              ).toLocaleString()}`,
              ''
            ]}
          />

          <Legend />

          {portfolio.map(
            (
              element,
              index
            ) => (
              <Bar
                key={
                  element.id
                }
                dataKey={
                  element.name
                }
                stackId="portfolio"
                fill={
                  COLORS[
                    index %
                      COLORS.length
                  ]
                }
                radius={[
                  4,
                  4,
                  0,
                  0
                ]}
              />
            )
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}