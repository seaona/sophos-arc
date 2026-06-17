export default function RestoreButton() {
  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        // Restore every key from the backup
        Object.keys(data).forEach((key) => {
          if (key !== 'exportedAt' && data[key] !== null) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });

        alert('✅ All data restored successfully!\n\nPlease refresh the page.');
        // window.location.reload();   // Uncomment if you want automatic refresh
      } catch (err) {
        alert('Error reading backup file. Please use a valid backup.');
      }
    };

    reader.readAsText(file);
  }

  return (
    <label className="modern-button cursor-pointer">
      Restore All Data
      <input
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleUpload}
      />
    </label>
  );
}