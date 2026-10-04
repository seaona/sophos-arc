import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import MonthNavigator from '../components/MonthNavigator';
import MealWeekTable from '../components/menus/MealWeekTable';
import GroceryWeekList from '../components/menus/GroceryWeekList';
import { useMenus } from '../hooks/useMenus';
import { getCalendarWeeks, getWeekId } from '../utils/dates';

export default function MenusPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    setMeal,
    getMealsForDate,
    addGrocery,
    toggleGrocery,
    deleteGrocery,
    getGroceriesForWeek,
  } = useMenus();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = getCalendarWeeks(year, month);

  function weekIdFor(week: (number | null)[]): string | null {
    const firstDay = week.find((d): d is number => d !== null);
    if (firstDay == null) return null;
    return getWeekId(year, month, firstDay);
  }

function weekTitle(week: (number | null)[], index: number): string {
  const days = week.filter((d): d is number => d !== null);
  if (days.length === 0) return `Week ${index + 1}`;

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const start = days[0];
  const end = days[days.length - 1];

  if (start === end) {
    return `Week ${index + 1} · ${start} ${monthName}`;
  }

  return `Week ${index + 1} · ${start} ${monthName} – ${end} ${monthName}`;
}

  return (
    <AppLayout>
      <MonthNavigator
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Menus & groceries
        </h2>
        <p className="subtle-text mt-1">
          Plan meals and shopping lists week by week.
        </p>
      </div>

      <div className="space-y-10">
        {weeks.map((week, i) => {
          const weekId = weekIdFor(week);
          if (!weekId) return null;

          return (
            <section key={weekId} className="glass-card p-5 sm:p-6 space-y-6">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {weekTitle(week, i)}
              </h3>

              {/* Meals for this week */}
              <MealWeekTable
                year={year}
                month={month}
                week={week}
                getMealsForDate={getMealsForDate}
                setMeal={setMeal}
              />

              {/* Groceries for this week */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
                <GroceryWeekList
                  weekId={weekId}
                  items={getGroceriesForWeek(weekId)}
                  onAdd={addGrocery}
                  onToggle={toggleGrocery}
                  onDelete={deleteGrocery}
                />
              </div>
            </section>
          );
        })}
      </div>
    </AppLayout>
  );
}