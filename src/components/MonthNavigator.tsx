type Props = {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
};

export default function MonthNavigator({
  currentDate,
  setCurrentDate
}: Props) {
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

  return (
    <div className="glass-card p-5 flex items-center justify-between">
      <button
        onClick={previousMonth}
        className="modern-button"
      >
        ←
      </button>

      <h2 className="text-3xl font-semibold tracking-tight">
        {currentDate.toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        })}
      </h2>

      <button
        onClick={nextMonth}
        className="modern-button"
      >
        →
      </button>
    </div>
  );
}