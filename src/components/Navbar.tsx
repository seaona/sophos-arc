import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          h-11
          w-11
          rounded-xl
          flex
          items-center
          justify-center
          bg-white/80
          dark:bg-zinc-900/80
          border
          border-zinc-200
          dark:border-zinc-800
          backdrop-blur-sm
          hover:scale-105
          transition-all
        "
      >
        ☰
      </button>

      {open && (
        <div
          className="
            absolute
            top-14
            right-0
            z-50
            min-w-[180px]
            overflow-hidden
            rounded-2xl
            bg-white/90
            dark:bg-zinc-900/90
            border
            border-zinc-200
            dark:border-zinc-800
            backdrop-blur-md
            shadow-xl
          "
        >
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `
                block
                px-5
                py-3
                transition-colors
                ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }
              `
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/habits"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `
                block
                px-5
                py-3
                transition-colors
                ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }
              `
            }
          >
            Habits
          </NavLink>

          <NavLink
            to="/finances"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `
                block
                px-5
                py-3
                transition-colors
                ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }
              `
            }
          >
            Finances
          </NavLink>
          <NavLink
            to="/health"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `
                block
                px-5
                py-3
                transition-colors
                ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }
              `
            }
          >
            Health
          </NavLink>
          <NavLink
          to="/goals"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `
              block
              px-5
              py-3
              transition-colors
              ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }
            `
          }
        >
          Goals
        </NavLink>
        </div>
      )}
    </div>
  );
}