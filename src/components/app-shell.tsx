"use client";

import { useEffect, useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-bold tracking-wide">Best Hydraulics</p>
          <div className="mx-auto mt-4 h-1 w-44 overflow-hidden rounded-full bg-white/20">
            <div className="loader-bar h-full w-1/2 rounded-full bg-blue-400" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

