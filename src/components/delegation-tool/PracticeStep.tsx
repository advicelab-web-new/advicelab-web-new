import { BriefcaseBusiness, MapPin } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useDelegationStore from "@/store/useDelegationStore";
import { digits, num } from "./format";
import { STATE_CODES } from "./data";
import { StepHeader, StepNav } from "./StepNav";

const RATE_SUGGESTIONS = [150, 250, 350, 500];
const MAX_RATE = 10000;

// Returns why the hourly rate can't be used, or null when it's fine.
const rateError = (rate: string): string | null => {
  const value = rate.trim();
  if (!value) return "Enter your hourly value to continue.";
  if (!/^\d+(\.\d{1,2})?$/.test(value))
    return "Enter a valid dollar amount, like 300.";
  const amount = Number(value);
  if (amount <= 0) return "Your hourly value must be more than $0.";
  if (amount > MAX_RATE)
    return `Enter an hourly value of $${MAX_RATE.toLocaleString()} or less.`;
  return null;
};

const STATE_NAMES: Record<(typeof STATE_CODES)[number], string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  WA: "Western Australia",
  SA: "South Australia",
  TAS: "Tasmania",
  ACT: "Australian Capital Territory",
  NT: "Northern Territory",
};

function PracticeCard({
  Icon,
  title,
  intro,
  children,
}: {
  Icon: LucideIcon;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="group grid min-w-0 content-start gap-5 rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl md:p-6">
      <div className="flex items-start gap-3">
        <span className="gradient-primary grid h-11 w-11 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </span>
        <div className="grid gap-1">
          <h3 className="font-display text-lg font-bold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{intro}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function AdviserRate({ showErrors }: { showErrors: boolean }) {
  const { rate, setField } = useDelegationStore();
  const hourlyRate = num(rate);
  const error = showErrors ? rateError(rate) : null;

  return (
    <PracticeCard
      Icon={BriefcaseBusiness}
      title="What is an hour of your time worth?"
      intro="As the adviser, your time is the most valuable in the practice."
    >
      <div className="grid gap-2">
        <label
          htmlFor="rate"
          className="text-xs font-medium text-muted-foreground"
        >
          Your hourly value as an adviser{" "}
          <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
            $
          </span>
          <Input
            id="rate"
            inputMode="decimal"
            placeholder="e.g. 300"
            required
            aria-invalid={!!error}
            aria-describedby={error ? "rate-error" : undefined}
            value={rate}
            onChange={(e) => setField({ rate: digits(e.target.value) })}
            className={cn(
              "h-14 rounded-xl pl-9 pr-20 font-display text-2xl font-bold tabular-nums placeholder:font-sans placeholder:text-base placeholder:font-normal",
              error && "border-destructive focus-visible:ring-destructive",
            )}
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            / hour
          </span>
        </div>
        {error && (
          <p
            id="rate-error"
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {error}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Not sure? Divide your yearly fee revenue by the hours you work.
        </p>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Quick picks"
      >
        {RATE_SUGGESTIONS.map((suggestion) => {
          const selected = hourlyRate === suggestion;
          return (
            <button
              key={suggestion}
              type="button"
              aria-pressed={selected}
              onClick={() => setField({ rate: String(suggestion) })}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold tabular-nums transition-all duration-200 hover:-translate-y-0.5",
                selected
                  ? "gradient-primary border-transparent text-primary-foreground shadow-md"
                  : "border-border bg-secondary/60 text-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              ${suggestion}
            </button>
          );
        })}
      </div>
    </PracticeCard>
  );
}

function PracticeState() {
  const { st, setField } = useDelegationStore();

  return (
    <PracticeCard
      Icon={MapPin}
      title="Where is your practice?"
      intro="We use your state's salary data to price a local hire."
    >
      <div
        role="radiogroup"
        aria-label="Your practice's state or territory"
        className="grid grid-cols-4 gap-2"
      >
        {STATE_CODES.map((state) => {
          const selected = st === state;
          return (
            <button
              key={state}
              type="button"
              role="radio"
              aria-checked={selected}
              title={STATE_NAMES[state]}
              onClick={() => setField({ st: state })}
              className={cn(
                "h-12 rounded-xl border text-sm font-bold transition-all duration-200 hover:-translate-y-0.5",
                selected
                  ? "gradient-primary scale-105 border-transparent text-primary-foreground shadow-lg shadow-primary/30"
                  : "border-border bg-secondary/40 text-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {state}
            </button>
          );
        })}
      </div>
      <p className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-sm text-foreground">
        <MapPin className="h-4 w-4 shrink-0 text-primary" />
        Your practice is in <strong>{STATE_NAMES[st]}</strong>
      </p>
    </PracticeCard>
  );
}

export function PracticeStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const rate = useDelegationStore((state) => state.rate);
  const [showErrors, setShowErrors] = useState(false);
  const hasRateError = rateError(rate) !== null;

  const handleNext = () => {
    if (hasRateError) {
      setShowErrors(true);
      document.getElementById("rate")?.focus();
      return;
    }
    onNext();
  };

  return (
    <div>
      <StepHeader
        step={5}
        title="About you, the adviser"
        intro="Two quick details about you and your practice, so we can value your time and price a local hire in your state."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <AdviserRate showErrors={showErrors} />
        <PracticeState />
      </div>
      <StepNav
        onBack={onBack}
        onNext={handleNext}
        nextLabel="See my result"
        middle={
          showErrors && hasRateError ? (
            <span className="font-medium text-destructive">
              Add your hourly value to see your result
            </span>
          ) : undefined
        }
      />
    </div>
  );
}
