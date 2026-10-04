import type { DayOfWeek, ScheduleBlock } from '../types/schedule';
import { useLocalStorage } from './useLocalStorage';

export function useSchedule() {
  const [blocks, setBlocks] = useLocalStorage<ScheduleBlock[]>(
    'sophos-arc-schedule-blocks',
    []
  );

  function addBlock(
    day: DayOfWeek,
    title: string,
    startMinutes: number,
    durationMinutes: number,
    color?: string
  ) {
    if (!title.trim()) return;

    const newBlock: ScheduleBlock = {
      id: crypto.randomUUID(),
      day,
      title: title.trim(),
      startMinutes,
      durationMinutes: Math.max(15, durationMinutes),
      color: color || '#71717a',
    };

    setBlocks((prev) => [...prev, newBlock]);
  }

  function updateBlock(
    id: string,
    updates: Partial<Pick<ScheduleBlock, 'title' | 'startMinutes' | 'durationMinutes' | 'color' | 'day'>>
  ) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  return {
    blocks,
    addBlock,
    updateBlock,
    deleteBlock,
  };
}