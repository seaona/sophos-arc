type Props = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  mode?: 'month' | 'year';   // ← New prop
};

export default function MonthNavigator({
  currentDate,
  setCurrentDate,
  mode = 'month'   // default is month (for habits)
}: Props) {
  // Month mode (Habits)
  function previousMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  }

  // Year mode (Finances)
  function previousYear() {
    setCurrentDate(
      new Date(currentDate.getFullYear() - 1, 0, 1)
    );
  }

  function nextYear() {
    setCurrentDate(
      new Date(currentDate.getFullYear() + 1, 0, 1)
    );
  }

  const isYearMode = mode === 'year';

  return (
    <div className="glass-card p-5 flex items-center justify-between">
      <button
        onClick={isYearMode ? previousYear : previousMonth}
        className="modern-button"
      >
        ←
      </button>

      <h2 className="text-3xl font-semibold tracking-tight">
        {isYearMode 
          ? currentDate.getFullYear() 
          : currentDate.toLocaleString('default', { 
              month: 'long', 
              year: 'numeric' 
            })
        }
      </h2>

      <button
        onClick={isYearMode ? nextYear : nextMonth}
        className="modern-button"
      >
        →
      </button>
    </div>
  );
}