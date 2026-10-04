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