type Props = {
  completed: boolean;
  onClick: () => void;
};

export default function DayCell({
  completed,
  onClick
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        h-10
        rounded-xl
        border
        transition-all
        duration-200
        hover:scale-[1.02]
        hover:shadow-sm
        ${
          completed
            ? `
              bg-emerald-500
              border-emerald-400
              shadow-sm
            `
            : `
              bg-white/80
              dark:bg-zinc-900/80
              border-zinc-200
              dark:border-zinc-800
              backdrop-blur-sm
            `
        }
      `}
    />
  );
}