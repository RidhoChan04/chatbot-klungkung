"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useLang } from "@/components/Language";

export default function DestinationScrubber({
  destinations,
  activeIndex,
  onChange,
}) {
  /* Props: destinations labels + active index */
  const { lang } = useLang();
  /* Memoize labels to avoid re-renders */
  const labels = useMemo(() => destinations || [], [destinations]);
  /* Refs: container + item nodes */
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  /* Scroll positioning logic */
  const scrollToIndex = useCallback((index, behavior = "smooth") => {
    const container = containerRef.current;
    const item = itemRefs.current[index];
    if (!container || !item) return;

    const target =
      item.offsetLeft -
      (container.clientWidth / 2 - item.offsetWidth / 2);

    container.scrollTo({ left: target, behavior });
  }, []);

  useEffect(() => {
    /* Keep active item centered */
    scrollToIndex(activeIndex);
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    /* Keep alignment on resize */
    const onResize = () => scrollToIndex(activeIndex, "auto");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, scrollToIndex]);

  return (
    <div className="relative w-full">
      {/* Track tipis horizontal (tanpa panah) */}
      <div className="pointer-events-none absolute left-0 right-0 top-[28px] h-px bg-white/20" />

      <div
        ref={containerRef}
        /* UI: horizontal scrubber row */
        className={[
          "relative z-10 flex items-center gap-3",
          "overflow-x-auto whitespace-nowrap scroll-smooth",
          "py-2.5 px-4 md:px-8",
          "snap-x snap-mandatory",
          "scroll-px-4 md:scroll-px-8",
          // hide scrollbar
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        {labels.map((label, i) => {
          const active = i === activeIndex;

          return (
            <button
              key={`${label}-${i}`}
              ref={(el) => (itemRefs.current[i] = el)}
              /* Event: switch slide */
              onClick={() => {
                onChange(i);
                scrollToIndex(i);
              }}
              className={[
                "snap-center shrink-0 inline-flex items-center justify-center",
                "rounded-full border backdrop-blur-sm",
                "px-3 py-1.5 md:px-4 md:py-2",
                "transition-all duration-300 ease-out",
                "leading-none",
                "min-w-[120px] md:min-w-[160px]",
                active
                  ? "bg-white/18 border-white/30 text-white text-xs md:text-sm font-semibold scale-[1.04] shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                  : "bg-white/10 border-white/18 text-white/75 text-xs md:text-sm font-medium hover:text-white hover:bg-white/14",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
              title={label}
            >
              <span className="max-w-[18ch] md:max-w-[22ch] truncate">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hint mobile */}
      <div className="mt-1 text-center text-[11px] text-white/50 md:hidden">
        {lang === "id" ? "Geser untuk melihat destinasi lain" : "Swipe to see more destinations"}
      </div>
    </div>
  );
}
