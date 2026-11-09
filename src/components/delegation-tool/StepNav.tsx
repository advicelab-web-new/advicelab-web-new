import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Steps 1-5 come before the result.
export const INPUT_STEP_COUNT = 5;

export function StepHeader({
  step,
  title,
  intro,
  badge,
}: {
  step: number;
  title: string;
  intro: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div className="mb-6 grid gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <p className="gradient-primary rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
          Step {step} of {INPUT_STEP_COUNT}
        </p>
        {badge}
      </div>
      <h2 className="text-2xl md:text-3xl text-foreground">{title}</h2>
      <p className="text-muted-foreground">{intro}</p>
    </div>
  );
}

export function StepNav({
  onBack,
  onNext,
  nextLabel = "Next",
  middle,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  middle?: ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>
      {middle && (
        <span className="order-last w-full text-center text-sm text-muted-foreground sm:order-none sm:w-auto">
          {middle}
        </span>
      )}
      <Button onClick={onNext}>
        {nextLabel}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
