import type { MealSlot } from '../../types/menu';
import { formatDate } from '../../utils/dates';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type Props = {
  year: number;
  month: number;
  week: (number | null)[];
  getMealsForDate: (date: string) => { lunch: string; dinner: string };
  setMeal: (date: string, slot: MealSlot, value: string) => void;
};

export default function MealWeekTable({
  year,
  month,
  week,
  getMealsForDate,
  setMeal,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm border-collapse table-fixed">
        <colgroup>
          <col className="w-20" />
          {week.map((_, i) => (
            <col key={i} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="p-2 text-left text-zinc-500 font-medium">
              Meal
            </th>
            {week.map((day, i) => (
              <th
                key={i}
                className={`p-2 text-center font-medium ${
                  day === null
                    ? 'text-zinc-400 dark:text-zinc-600'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div>{DAY_LABELS[i]}</div>
                <div className="text-sm font-normal opacity-70">
                  {day ?? '·'}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(['lunch', 'dinner'] as MealSlot[]).map((slot) => (
            <tr key={slot}>
              <td className="p-2 font-medium capitalize text-zinc-600 dark:text-zinc-400">
                {slot}
              </td>
              {week.map((day, i) => {
                if (day === null) {
                  return (
                    <td key={i} className="p-1.5">
                      <div
                        className="
                          w-full h-14 rounded-xl
                          bg-zinc-200/70 dark:bg-zinc-800/70
                          border border-zinc-200 dark:border-zinc-800
                        "
                      />
                    </td>
                  );
                }

                const date = formatDate(year, month, day);
                const meals = getMealsForDate(date);

                return (
                  <td key={i} className="p-1.5">
                    <textarea
                      value={meals[slot]}
                      onChange={(e) => setMeal(date, slot, e.target.value)}
                      placeholder="…"
                      rows={2}
                      className="
                        modern-input w-full text-sm resize-none
                        min-h-[3.5rem] py-2 box-border
                      "
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}