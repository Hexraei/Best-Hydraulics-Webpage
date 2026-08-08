"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Shrinks its child just enough that it stops overflowing horizontally, so a
 * wide table (e.g. a price grid with many columns) fits the viewport width
 * without a horizontal scrollbar. Only width is measured or reacted to —
 * height is never monitored, so a table with many rows still scrolls the page
 * vertically like normal. The scale itself is uniform (that's how CSS
 * transforms work), so the shrunk table is simply shorter too, which is fine.
 *
 * Falls back to horizontal scrolling once the content is too wide to shrink
 * further without going below MIN_SCALE.
 *
 * Requires the child (e.g. the <table>) to size itself to its own content —
 * no `w-full`/`width: 100%` on the child itself. If the child stretches to
 * fill whatever box it's given, scrollWidth always just reports that box's
 * width back, never the content's true natural width, so overflow can never
 * be detected and a narrow table never gets to fill its container either.
 */
const MIN_SCALE = 0.55;

export function FitToWidth({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const measure = () => {
      const available = container.clientWidth;
      const naturalWidth = content.scrollWidth;

      if (available <= 0 || naturalWidth <= available) {
        setScale(1);
        return;
      }

      setScale(Math.max(MIN_SCALE, available / naturalWidth));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    // Catches late width shifts (fonts, images) that settle after mount.
    const settleTimer = window.setTimeout(measure, 150);

    return () => {
      observer.disconnect();
      window.clearTimeout(settleTimer);
    };
  }, []);

  const stillOverflows = scale <= MIN_SCALE;

  return (
    <div ref={containerRef} className={stillOverflows ? "w-full overflow-x-auto" : "w-full overflow-hidden"}>
      <div
        ref={contentRef}
        style={scale < 1 ? { width: "max-content", transform: `scale(${scale})`, transformOrigin: "top left" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
