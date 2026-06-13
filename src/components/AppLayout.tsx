import type { ReactNode } from 'react';
import Navbar from './Navbar';

type Props = {
  children: ReactNode;
};

export default function AppLayout({
  children
}: Props) {
  return (
    <div className="page-container bg-stone-100 dark:bg-zinc-950">
      <div className="content-container">
        <div className="mb-10">
            <div className="flex items-center justify-between">
                <h1 className="section-title">
                Sophos Arc
                </h1>
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