import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

type Props = {
  children: ReactNode;
};

export default function AppLayout({ children }: Props) {
  const navigate = useNavigate();

  return (
    <div className="page-container bg-stone-100 dark:bg-zinc-950 min-h-screen">
      <div className="content-container max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {/* Clickable Title - Goes to Home */}
            <button
              onClick={() => navigate('/')}
              className="section-title hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer text-left"
            >
              Sophos Arc
            </button>

            <Navbar />
          </div>

          <p className="subtle-text mt-3 text-lg max-w-3xl leading-relaxed">
            A personal system for tracking habits,
            creations, and progress toward a meaningful life.
          </p>

          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Your data stays private, local, and fully under your control in your browser.
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}