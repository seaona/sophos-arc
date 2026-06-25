import type { Goal } from '../../types/goal';

type Props = {
  goals: Goal[];
};

const COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
];

export default function MilestoneTimeline({ goals }: Props) {
  // Collect all milestones with goal info
  const allMilestones = goals.flatMap((goal, index) => {
    if (!goal.milestones || goal.milestones.length === 0) return [];

    const color = COLORS[index % COLORS.length];

    return goal.milestones.map((milestone) => ({
      ...milestone,
      goalId: goal.id,
      goalTitle: goal.title,
      color,
    }));
  });

  if (allMilestones.length === 0) return null;

  // Group milestones by month (1-12)
  const milestonesByMonth: Record<number, typeof allMilestones> = {};

  allMilestones.forEach((milestone) => {
    if (milestone.month) {
      if (!milestonesByMonth[milestone.month]) {
        milestonesByMonth[milestone.month] = [];
      }
      milestonesByMonth[milestone.month].push(milestone);
    }
  });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className="text-xl font-semibold mb-6">Milestone Timeline</h2>

      <div className="relative pt-8 pb-4">
        {/* Timeline Line */}
        <div className="absolute top-12 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-700" />

        <div className="grid grid-cols-12 gap-1 relative">
          {months.map((monthName, index) => {
            const monthNumber = index + 1;
            const monthMilestones = milestonesByMonth[monthNumber] || [];

            return (
              <div key={monthNumber} className="flex flex-col items-center">
                {/* Month Label */}
                <div className="text-xs text-zinc-500 mb-2 font-medium">
                  {monthName}
                </div>

                {/* Dot + Milestones */}
                {monthMilestones.length > 0 ? (
                  <div className="flex flex-col items-center">
                    {/* Dot on timeline */}
                    <div className="w-3 h-3 rounded-full border-2 border-white dark:border-zinc-950 z-10 mb-2"
                         style={{ backgroundColor: monthMilestones[0].color }} />

                    {/* Stacked milestones */}
                    <div className="flex flex-col gap-1 text-center">
                      {monthMilestones.map((milestone, idx) => {
                        const isAchieved = milestone.achieved;
                        const textColor = isAchieved 
                          ? milestone.color 
                          : `${milestone.color}80`; // lighter version

                        return (
                          <div 
                            key={idx} 
                            className="text-xs px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 max-w-[110px]"
                            style={{ borderColor: isAchieved ? milestone.color : undefined }}
                          >
                            <div 
                              className="font-medium truncate" 
                              style={{ color: textColor }}
                              title={milestone.title}
                            >
                              {milestone.title}
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate">
                              {milestone.goalTitle}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Empty month - just a small dot
                  <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 mt-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-zinc-500 mt-4 text-center">
        Solid color = Achieved • Lighter color = Pending
      </p>
    </div>
  );
}