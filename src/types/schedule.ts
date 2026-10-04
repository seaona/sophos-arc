export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type ScheduleBlock = {
  id: string;
  day: DayOfWeek;
  /** Start time as minutes from midnight (e.g. 9:00 = 540) */
  startMinutes: number;
  /** Duration in minutes */
  durationMinutes: number;
  title: string;
  color?: string;
};

export type ScheduleData = {
  blocks: ScheduleBlock[];
};

export const SCHEDULE_COLORS = [
  { id: 'neutral',hex: '#737373', label: 'Neutral' },
  { id: 'blue',   hex: '#3b82f6', label: 'Blue' },
  { id: 'indigo', hex: '#6366f1', label: 'Indigo' },
  { id: 'violet', hex: '#8b5cf6', label: 'Violet' },
  { id: 'emerald',hex: '#10b981', label: 'Emerald' },
  { id: 'teal',   hex: '#14b8a6', label: 'Teal' },
  { id: 'amber',  hex: '#f59e0b', label: 'Amber' },
  { id: 'rose',   hex: '#f43f5e', label: 'Rose' },
] as const;

export type ScheduleColorId = (typeof SCHEDULE_COLORS)[number]['id'];