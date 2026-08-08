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
 * The scaled element is never resized inline — an earlier version set a
 * compensating `width: X%` on it, which fed back into its own measurement and
 * inflated scrollWidth on every pass. Height is left untouched entirely:
 * `transform: scale` shrinks it visually and the browser still reserves the
 * unscaled layout height underneath, which just means normal page scroll for
 * a tall table — exactly the "don't touch vertical" behaviour intended.
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
      // content's own width is intrinsic to its content (a table with fixed
      // cell sizing), never set by us, so no reset-before-measure is needed.
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
      {/*
        A <table> (unlike block content) sizes its columns to whatever box
        it's given rather than always reporting its true intrinsic width, so
        it must be measured with room to be as wide as it wants — `inline-block`
        plus `max-content` lets it size naturally regardless of the scaled
        wrapper's own box, which is what content.scrollWidth then reads.
      */}
      <div
        ref={contentRef}
        style={{
          display: "inline-block",
          width: "max-content",
          maxWidth: "none",
          ...(scale < 1 ? { transform: `scale(${scale})`, transformOrigin: "top left" } : null),
        }}
      >
        {children}
      </div>
    </div>
  );
}
