type Props = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          glass-card
          p-8
          w-full
          max-w-md
        "
      >
        <h2 className="text-xl font-semibold mb-3">
          {title}
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="modern-button"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              modern-button
              bg-red-500
              text-white
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}