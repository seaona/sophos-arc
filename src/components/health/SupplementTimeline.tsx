import { useState } from 'react';
import type { Supplement } from '../../types/health';

type Props = {
  supplements: Supplement[];
};

const COLORS = [
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#22c55e', // green
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export default function SupplementTimeline({ supplements }: Props) {
  const [year, setYear] = useState(new Date().getFullYear());

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const changeYear = (delta: number) => {
    setYear((prev) => prev + delta);
  };

  const getMonthIndex = (dateStr: string): number => {
    const date = new Date(dateStr);
    return date.getFullYear() === year ? date.getMonth() : -1;
  };

  // Assign a stable color based on supplement index
  const getSupplementColor = (index: number, isActive: boolean) => {
    const baseColor = COLORS[index % COLORS.length];
    
    if (isActive) {
      return baseColor;
    } else {
      // Muted version for ended supplements
      return '#9ca3af'; // gray-400
    }
  };

  return (
    <div className="glass-card p-8 mb-8">
      {/* Header with Year Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Supplements / Intakes</h2>

        <div className="flex items-center gap-3">
          <button onClick={() => changeYear(-1)} className="modern-button px-3 py-1 text-sm">←</button>
          <span className="font-semibold text-lg min-w-[60px] text-center">{year}</span>
          <button onClick={() => changeYear(1)} className="modern-button px-3 py-1 text-sm">→</button>
        </div>
      </div>

      {/* Month Headers */}
      <div className="grid grid-cols-12 gap-1 mb-2 text-xs font-medium text-zinc-500 text-center">
        {months.map((month) => (
          <div key={month}>{month}</div>
        ))}
      </div>

      {/* Timeline Rows */}
      <div className="space-y-4">
        {supplements.length > 0 ? (
          supplements.map((supplement, index) => {
            const startMonth = getMonthIndex(supplement.startDate);
            const endMonth = supplement.endDate 
              ? getMonthIndex(supplement.endDate) 
              : 11;

            const isActive = !supplement.endDate;

            if (startMonth === -1 && endMonth === -1) return null;

            const color = getSupplementColor(index, isActive);

            return (
              <div key={supplement.id} className="grid grid-cols-12 gap-1 items-center">
                {/* Name */}
                <div className="col-span-3 pr-4 font-medium text-sm truncate" title={supplement.name}>
                  {supplement.name}
                </div>

                {/* Timeline Bar */}
                <div className="col-span-9 relative h-7 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  {startMonth !== -1 && (
                    <div
                      className="absolute top-0 h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: color,
                        left: `${(Math.max(startMonth, 0) / 12) * 100}%`,
                        width: `${((Math.min(endMonth, 11) - Math.max(startMonth, 0) + 1) / 12) * 100}%`,
                        opacity: isActive ? 1 : 0.6,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-zinc-500 text-sm">
            No supplements added yet.
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{
                background: 'conic-gradient(#14b8a6, #3b82f6, #8b5cf6, #f59e0b, #ef4444, #22c55e)'
              }} 
            />
            Active
          </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-zinc-400" /> Ended
        </div>
      </div>
    </div>
  );
}