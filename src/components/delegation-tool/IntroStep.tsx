import { ArrowRight, ClipboardList, FileText, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./shared";
import { GROUPS, TASK_COUNT, type RoleKey } from "./data";

const STEP_CARDS: {
  role: RoleKey;
  Icon: LucideIcon;
  title: string;
  text: string;
}[] = [
  {
    role: "pp",
    Icon: FileText,
    title: "Paraplanning",
    text: "Hand off the research, modelling and SoA writing, and spend your hours in front of clients instead.",
  },
  {
    role: "cso",
    Icon: RefreshCw,
    title: "Reviews",
    text: "Review packs, fee consents and implementation done for you, so review season stops eating your week.",
  },
  {
    role: "cso",
    Icon: ClipboardList,
    title: "Admin",
    text: "CRM updates, insurance admin, compliance checks and the inbox, all handled while you grow the practice.",
  },
];

export function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <p className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          For Australian financial advisers
        </p>
        <h2 className="max-w-3xl text-2xl leading-tight text-primary md:text-4xl">
          See how many hours you lose to paraplanning and admin, and how Advice
          Lab gets them back for less than a local hire.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {STEP_CARDS.map(({ role, Icon, title, text }, index) => (
          <div
            key={title}
            className="group relative grid content-start gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
          >
            <span className="gradient-primary grid h-11 w-11 place-items-center rounded-xl text-primary-foreground shadow-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-display text-xl font-bold text-primary">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{text}</p>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
              <RoleBadge role={role} />
              <span className="text-xs font-semibold tabular-nums text-primary">
                {GROUPS[index].tasks.length} tasks
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-card to-primary/10 p-5 md:p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
        <p className="relative text-xs font-semibold uppercase tracking-wider text-primary">
          What you'll get
        </p>
        <p className="relative mt-1 font-display text-lg font-bold text-foreground md:text-xl">
          Your hours, the cost of a local hire, and what the same work costs
          with Advice Lab.
        </p>
        <p className="relative mt-1 text-sm text-muted-foreground">
          Then tell us about your team and your hourly value, and we'll show
          you the cheaper way to get your time back.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <span className="text-sm text-muted-foreground">
          {TASK_COUNT} tasks · about 5 minutes · no sign-up
        </span>
        <Button onClick={onStart} size="lg">
          Start the audit
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
