type Props = {
  year: number;
  setYear: (year: number) => void;
};

export default function YearNavigator({
  year,
  setYear
}: Props) {
  return (
    <div
      className="
        glass-card
        p-4
        mb-8
        flex
        items-center
        justify-center
        gap-6
      "
    >
      <button
        onClick={() =>
          setYear(year - 1)
        }
        className="modern-button"
      >
        ←
      </button>

      <div
        className="
          text-2xl
          font-semibold
          min-w-[100px]
          text-center
        "
      >
        {year}
      </div>

      <button
        onClick={() =>
          setYear(year + 1)
        }
        className="modern-button"
      >
        →
      </button>
    </div>
  );
}