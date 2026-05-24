import type { Habit, HabitLogs } from '../types/habit';

type Props = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setLogs: React.Dispatch<React.SetStateAction<HabitLogs>>;
};

type BackupData = {
  habits: Habit[];
  logs: HabitLogs;
  exportedAt?: string;
};

export default function RestoreButton({
  setHabits,
  setLogs
}: Props) {
  function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;

        const data: BackupData = JSON.parse(text);

        if (!data.habits || !data.logs) {
          alert('Invalid backup file');
          return;
        }

        setHabits(data.habits);
        setLogs(data.logs);

        alert('Backup restored successfully');
      } catch {
        alert('Error reading backup file');
      }
    };

    reader.readAsText(file);
  }

  return (
    <label
      className="
        modern-button
        cursor-pointer
      "
    >
      Upload Data

      <input
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleUpload}
      />
    </label>
  );
}