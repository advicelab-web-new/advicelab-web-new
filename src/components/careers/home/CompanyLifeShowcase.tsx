import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Facility image imports ──────────────────────────────────────────────────
import carromImg from "@/assets/CompanyLife/art-books.webp";
import chessImg from "@/assets/CompanyLife/chess-playing.webp";
import playstationImg from "@/assets/CompanyLife/chess.webp";
import gymImg from "@/assets/CompanyLife/good-vibes.webp";
import badmintonImg from "@/assets/CompanyLife/leg-press-machine.webp";
import loungeImg from "@/assets/CompanyLife/outdoor-garden.webp";
import rooftopImg from "@/assets/CompanyLife/play-station.webp";
import cafeImg from "@/assets/CompanyLife/playstation-vibe.webp";
import yogaImg from "@/assets/CompanyLife/playstation.webp";
import poolTableImg from "@/assets/CompanyLife/table-tenis-area.webp";
import terraceChatting from "@/assets/CompanyLife/terrace-chatting.webp";
import treadmill from "@/assets/CompanyLife/treadmill.webp";
import weightBench from "@/assets/CompanyLife/weight-bench.webp";
import library from "@/assets/CompanyLife/library.webp";
import librarySelection from "@/assets/CompanyLife/library_selection.webp";
import pilates from "@/assets/CompanyLife/pilates.webp";
import pilatesFloor from "@/assets/CompanyLife/pilates_floor.webp";

// ── Data ────────────────────────────────────────────────────────────────────
const facilityImages = [
  { src: carromImg, alt: "Art Books Corner" },
  { src: chessImg, alt: "Chess Playing Area" },
  { src: playstationImg, alt: "Chess Lounge" },
  { src: gymImg, alt: "Good Vibes Zone" },
  { src: badmintonImg, alt: "Leg Press Machine" },
  { src: loungeImg, alt: "Outdoor Garden" },
  { src: rooftopImg, alt: "PlayStation Station" },
  { src: cafeImg, alt: "PlayStation Vibe Area" },
  { src: yogaImg, alt: "PlayStation Corner" },
  { src: poolTableImg, alt: "Table Tennis Area" },
  { src: terraceChatting, alt: "Terrace Chatting Spot" },
  { src: treadmill, alt: "Treadmill Zone" },
  { src: library, alt: "Library" },
  { src: librarySelection, alt: "Library" },
  { src: pilates, alt: "Pilates" },
  { src: pilatesFloor, alt: "Pilates Floor" },
];

// ── Shuffle helper ───────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ── Component ───────────────────────────────────────────────────────────────
export function CompanyLifeShowcase() {
  const images = useMemo(() => shuffleArray(facilityImages), []);
  const total = images.length;

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (next: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setCurrent((next + total) % total);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setTransitioning(false), 420);
    },
    [transitioning, total],
  );

  const prev = () => go(current - 1);
  const next = () => go(current + 1);

  // ── ✅ Auto Slide (ADDED ONLY THIS BLOCK) ───────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (!transitioning) {
        go(current + 1);
      }
    }, 3000); // change speed here if needed

    return () => clearInterval(interval);
  }, [current, transitioning, go]);
  // ────────────────────────────────────────────────────────────────────────

  const getOffset = (idx: number) => {
    let offset = idx - current;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  };

  return (
    <section className="bg-secondary py-12 overflow-hidden">
      {/* ── Header ── */}
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollAnimation animation="fade-up">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-foreground text-3xl sm:text-4xl md:text-[42px] font-bold text-center leading-tight mb-3">
              A Workplace That Actually Gets You
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl text-center max-w-2xl px-4">
              Recharge, connect, and play before the day ends
            </p>
          </div>
        </ScrollAnimation>
      </div>

      {/* ── Carousel Stage ── */}
      <div className="relative w-full select-none">
        <div
          className="relative mx-auto overflow-visible"
          style={{ height: "320px", maxWidth: "1400px" }}
        >
          {images.map((img, idx) => {
            const offset = getOffset(idx);
            const isActive = offset === 0;
            const isAdj = Math.abs(offset) === 1;
            const isVisible = Math.abs(offset) <= 1;

            const translateX = offset * 104;
            const scale = isActive ? 1 : 0.88;
            const opacity = isActive ? 1 : isAdj ? 0.72 : 0;
            const zIndex = isActive ? 10 : isAdj ? 5 : 0;

            return (
              <div
                key={idx}
                onClick={() => !isActive && go(idx)}
                className="absolute top-0 rounded-xl overflow-hidden"
                style={{
                  width: "480px",
                  height: "320px",
                  left: "50%",
                  transform: `translateX(calc(-50% + ${translateX}%)) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition:
                    "transform 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.42s ease, box-shadow 0.42s ease",
                  cursor: isActive ? "default" : "pointer",
                  pointerEvents: isVisible ? "auto" : "none",
                  boxShadow: isActive
                    ? "0 20px 60px -10px hsl(var(--foreground) / 0.18)"
                    : "0 4px 16px -4px hsl(var(--foreground) / 0.08)",
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  draggable={false}
                  loading={isActive ? "eager" : "lazy"}
                  decoding="async"
                />
                {!isActive && (
                  <div className="absolute inset-0 bg-secondary/20 rounded-xl" />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Arrow Buttons ── */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-background/90 backdrop-blur-sm border border-primary/30 text-primary shadow-md hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-background/90 backdrop-blur-sm border border-primary/30 text-primary shadow-md hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── Dot Indicators ── */}
      <div className="flex items-center justify-center gap-2 mt-7">
        {images.map((_, idx) => {
          const isActive = idx === current;

          return (
            <button
              key={idx}
              onClick={() => go(idx)}
              aria-label={`Go to image ${idx + 1}`}
              className="
               flex items-center justify-center
               w-11 h-11
               rounded-full
               focus:outline-none
               focus-visible:ring-2
               focus-visible:ring-primary
                "
            >
              <span
                className="transition-all duration-300 rounded-full"
                style={{
                  width: isActive ? "24px" : "8px",
                  height: "8px",
                  background: isActive
                    ? "hsl(var(--primary))"
                    : "hsl(var(--primary) / 0.25)",
                }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
