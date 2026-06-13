export type Habit = {
  id: string;
  name: string;
  goalId: string;
  createdAt: string;
};

export type HabitLogs = {
  [habitId: string]: {
    [date: string]: boolean;
  };
};