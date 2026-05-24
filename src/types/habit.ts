export type Habit = {
  id: string;
  name: string;
  createdAt: string;
};

export type HabitLogs = {
  [habitId: string]: {
    [date: string]: boolean;
  };
};