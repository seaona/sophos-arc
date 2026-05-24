type Props = {
  darkMode: boolean;
  toggleTheme: () => void;
};

export default function ThemeToggle({
  darkMode,
  toggleTheme
}: Props) {
  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg border"
    >
      {darkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}