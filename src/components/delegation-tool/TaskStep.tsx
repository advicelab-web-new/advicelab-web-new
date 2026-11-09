import { useEffect, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useDelegationStore, { HOURS_MAX, HOURS_MIN, HOURS_STEP } from "@/store/useDelegationStore";
import { fmtH } from "./format";
import { CHOICES, GROUPS } from "./data";
import { INPUT_STEP_COUNT } from "./StepNav";
import { RoleBadge } from "./shared";

interface HoursInputProps {
  label: string;
  value: number;
  onStep: (delta: number) => void;
  onCommit: (value: number) => void;
}

// Whole or half hours only: "", "2", "2.", "2.5", "2.0"
const HALF_HOUR_PATTERN = /^\d{0,2}(\.[05]?)?$/;

function HoursInput({ label, value, onStep, onCommit }: HoursInputProps) {
  const [draft, setDraft] = useState(fmtH(value));

  useEffect(() => setDraft(fmtH(value)), [value]);

  const commit = () => {
    const n = parseFloat(draft);
    if (Number.isFinite(n)) onCommit(n);
    setDraft(fmtH(value)); // resync if the snapped value didn't change (e.g. 2.2 → 2)
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const stepBtn = "grid h-9 w-9 place-items-center text-foreground hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <span className="inline-flex items-center overflow-hidden rounded-lg border border-border bg-card">
      <button type="button" aria-label="Fewer hours" disabled={value <= HOURS_MIN} onClick={() => onStep(-HOURS_STEP)} className={stepBtn}>
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="text"
        inputMode="decimal"
        aria-label={label}
        value={draft}
        onChange={(e) => {
          const next = e.target.value;
          if (HALF_HOUR_PATTERN.test(next) && !(parseFloat(next) > HOURS_MAX)) setDraft(next);
        }}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className="h-9 w-14 border-x border-border bg-transparent text-center font-bold tabular-nums text-foreground outline-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" aria-label="More hours" disabled={value >= HOURS_MAX} onClick={() => onStep(HOURS_STEP)} className={stepBtn}>
        <Plus className="h-4 w-4" />
      </button>
    </span>
  );
}

interface TaskStepProps {
  index: number;
  onBack: () => void;
  onNext: () => void;
}

export function TaskStep({ index, onBack, onNext }: TaskStepProps) {
  const { answers, hours, toggleAnswer, stepHours, setHours } = useDelegationStore();
  const g = GROUPS[index];
  const answered = g.tasks.filter(([t]) => answers[t]).length;

  return (
    <div>
      <div className="mb-6 grid gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <p className="gradient-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
            Step {index + 1} of {INPUT_STEP_COUNT}
          </p>
          <RoleBadge role={g.role} />
        </div>
        <h2 className="text-2xl md:text-3xl text-foreground">{g.name}</h2>
        <p className="text-muted-foreground">{g.intro} Who does each of these in your practice today?</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
          <span
            className="gradient-primary block h-full rounded-full transition-[width] duration-500"
            style={{ width: `${(answered / g.tasks.length) * 100}%` }}
          />
        </div>
      </div>

      <ul className="grid gap-3">
        {g.tasks.map(([t, detail], j) => {
          const id = `${g.key}-${j}`;
          const a = answers[t];
          return (
            <li
              key={t}
              className={cn(
                "grid gap-3 rounded-xl border p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-md md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-6 md:p-5",
                a ? "border-primary/30 bg-primary/[0.03] shadow-sm" : "border-border bg-card",
              )}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-300",
                    a ? "gradient-primary text-primary-foreground shadow-md" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {a ? <Check className="h-3.5 w-3.5" /> : j + 1}
                </span>
                <div id={`${id}-l`} className="min-w-0">
                  <p className="font-medium text-foreground">{t}</p>
                  <p className="text-sm text-muted-foreground">{detail}</p>
                </div>
              </div>
              <div role="group" aria-labelledby={`${id}-l`} className="flex flex-wrap gap-2 md:justify-end">
                {CHOICES.map(([c, label]) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={a === c}
                    onClick={() => toggleAnswer(t, c)}
                    className={cn(
                      "rounded-lg border px-3.5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      a === c
                        ? "gradient-primary border-transparent text-primary-foreground shadow-md shadow-primary/20"
                        : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {(a === "me" || a === "team") && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border-l-4 border-l-primary bg-primary/5 px-4 py-3 text-sm md:col-span-2">
                  <span className="font-medium text-foreground">
                    {a === "me" ? "Hours a week you spend on it" : "Hours a week your team spends on it"}
                  </span>
                  <HoursInput
                    label={`Hours a week on ${t}`}
                    value={hours[t]}
                    onStep={(delta) => stepHours(t, delta)}
                    onCommit={(v) => setHours(t, v)}
                  />
                  <span className="text-muted-foreground">Type whole or half hours (e.g. 4 or 4.5), or use −/+. A rough guess is fine.</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <span className="order-last w-full text-center text-sm text-muted-foreground sm:order-none sm:w-auto">
          {answered} of {g.tasks.length} answered
        </span>
        <Button onClick={onNext}>
          Next
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
