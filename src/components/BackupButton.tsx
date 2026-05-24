import type { Habit, HabitLogs } from '../types/habit';

type Props = {
  habits: Habit[];
  logs: HabitLogs;
};

export default function BackupButton({
  habits,
  logs
}: Props) {
  function handleBackup() {
    const data = {
      habits,
      logs,
      exportedAt: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    const today = new Date().toISOString().split('T')[0];

    link.href = url;
    link.download = `habit-tracker-backup-${today}.json`;

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleBackup}
      className="
        modern-button
      "
    >
      Backup Data
    </button>
  );
}