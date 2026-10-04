export type MealSlot = 'lunch' | 'dinner';

export type DayMeals = {
  lunch: string;
  dinner: string;
};

export type MealPlan = {
  [date: string]: DayMeals;
};

export type Supermarket = 'ametller' | 'mercadona' | 'plus_fresc';

export const SUPERMARKETS: {
  id: Supermarket;
  label: string;
  /** Tailwind classes for the badge */
  badgeClass: string;
}[] = [
  {
    id: 'ametller',
    label: 'Ametller',
    badgeClass:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
  },
  {
    id: 'mercadona',
    label: 'Mercadona',
    badgeClass:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  },
  {
    id: 'plus_fresc',
    label: 'Plus Fresc',
    badgeClass:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  },
];

export type GroceryItem = {
  id: string;
  weekId: string;
  name: string;
  supermarket: Supermarket;
  checked: boolean;
};

export type GroceryList = GroceryItem[];