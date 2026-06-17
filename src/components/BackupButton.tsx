export default function BackupButton() {
  function handleBackup() {
    const data: any = {
      exportedAt: new Date().toISOString(),
    };

    // Backup ALL localStorage keys automatically
    Object.keys(localStorage).forEach(key => {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || 'null');
      } catch {
        data[key] = localStorage.getItem(key);
      }
    });

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];

    link.href = url;
    link.download = `sophos-arc-backup-${today}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button onClick={handleBackup} className="modern-button">
      Backup All Data
    </button>
  );
}