"use client";

import { useEffect, useState } from "react";

/**
 * Brand splash. It overlays the page rather than replacing it, so the real
 * content renders immediately for users and crawlers and first paint is never
 * blocked behind a timer.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <div
          aria-hidden="true"
          className="splash-overlay pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-slate-950 text-white"
        >
          <div className="text-center">
            <p className="text-3xl font-bold tracking-wide md:text-4xl">Best Hydraulics</p>
            <div className="mx-auto mt-4 h-1 w-44 overflow-hidden rounded-full bg-white/20">
              <div className="loader-bar h-full w-1/2 rounded-full bg-blue-400" />
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
