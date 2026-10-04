import type { DayMeals, GroceryItem, MealPlan, MealSlot, Supermarket } from '../types/menu';
import { useLocalStorage } from './useLocalStorage';

const emptyMeals = (): DayMeals => ({ lunch: '', dinner: '' });

export function useMenus() {
  const [meals, setMeals] = useLocalStorage<MealPlan>('sophos-arc-meals', {});
  const [groceries, setGroceries] = useLocalStorage<GroceryItem[]>(
    'sophos-arc-groceries',
    []
  );

  function setMeal(date: string, slot: MealSlot, value: string) {
    setMeals((prev) => {
      const current = prev[date] ?? emptyMeals();
      return {
        ...prev,
        [date]: {
          ...current,
          [slot]: value,
        },
      };
    });
  }

  function getMealsForDate(date: string): DayMeals {
    return meals[date] ?? emptyMeals();
  }

  function addGrocery(weekId: string, name: string, supermarket: Supermarket) {
    if (!name.trim()) return;
    const item: GroceryItem = {
      id: crypto.randomUUID(),
      weekId,
      name: name.trim(),
      supermarket,
      checked: false,
    };
    setGroceries((prev) => [...prev, item]);
  }

  function toggleGrocery(id: string) {
    setGroceries((prev) =>
      prev.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g))
    );
  }

  function deleteGrocery(id: string) {
    setGroceries((prev) => prev.filter((g) => g.id !== id));
  }

  function getGroceriesForWeek(weekId: string) {
    return groceries.filter((g) => g.weekId === weekId);
  }

  return {
    meals,
    setMeal,
    getMealsForDate,
    groceries,
    addGrocery,
    toggleGrocery,
    deleteGrocery,
    getGroceriesForWeek,
  };
}