import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          h-11 w-11 rounded-xl flex items-center justify-center
          bg-white/80 dark:bg-zinc-900/80
          border border-zinc-200 dark:border-zinc-800
          backdrop-blur-sm hover:scale-105 transition-all
        "
      >
        ☰
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="
            absolute top-14 right-0 z-50 min-w-[200px] overflow-hidden
            rounded-2xl bg-white/95 dark:bg-zinc-900/95
            border border-zinc-200 dark:border-zinc-800
            backdrop-blur-md shadow-xl py-1
          "
        >
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-5 py-3 transition-colors ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800 font-medium'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`
            }
          >
            Home
          </NavLink>


          <NavLink
            to="/goals"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-5 py-3 transition-colors ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800 font-medium'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`
            }
          >
            Goals
          </NavLink>

          <NavLink
            to="/habits"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-5 py-3 transition-colors ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800 font-medium'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`
            }
          >
            Habits
          </NavLink>

          <NavLink
            to="/finances"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-5 py-3 transition-colors ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800 font-medium'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`
            }
          >
            Finances
          </NavLink>

          <NavLink
            to="/health"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-5 py-3 transition-colors ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800 font-medium'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`
            }
          >
            Health
          </NavLink>
        </div>
      )}
    </div>
  );
}