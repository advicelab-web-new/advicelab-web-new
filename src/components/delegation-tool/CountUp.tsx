import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1200;

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

// Animates from the last shown value to `value`, starting at 0 on first render.
function useCountUp(value: number) {
  const [shown, setShown] = useState(() =>
    prefersReducedMotion() ? value : 0,
  );
  const shownRef = useRef(shown);

  useEffect(() => {
    if (prefersReducedMotion()) {
      shownRef.current = value;
      setShown(value);
      return;
    }

    const from = shownRef.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const next = from + (value - from) * easeOutCubic(progress);
      shownRef.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return shown;
}

export function CountUp({
  value,
  format,
}: {
  value: number;
  format: (value: number) => string;
}) {
  const shown = useCountUp(value);
  return (
    <>
      {/* Screen readers get the final figure, not every frame. */}
      <span aria-hidden="true">{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
