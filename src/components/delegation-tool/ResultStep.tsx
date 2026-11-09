import { useEffect, useRef } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import useDelegationStore from "@/store/useDelegationStore";
import {
  API_ROLE_BY_ROLE_KEY,
  type DelegationAuditResult,
} from "@/store/delegationAuditApi";
import { aud, digits, hrs, num, plural } from "./format";
import {
  ANNUAL_LEAVE_WEEKS,
  GROUPS,
  PERSONAL_LEAVE_DAYS,
  ROLES,
  type RoleKey,
} from "./data";
import { CountUp } from "./CountUp";
import { PlanForm } from "./PlanForm";
import { track } from "./shared";
import { useDelegationAudit, useHasOwnTasks } from "./useDelegationAudit";

const ROLE_KEYS: RoleKey[] = ["pp", "cso"];

type HandOffTask = { task: string; hours: number };

function HandOffList({
  tasks,
  startHereTask,
}: {
  tasks: HandOffTask[];
  startHereTask?: string;
}) {
  return (
    <ol className="grid gap-2">
      {tasks.map((handOffTask, index) => (
        <li
          key={handOffTask.task}
          className={cn(
            "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border p-4 shadow-sm transition-all duration-300 hover:translate-x-1 hover:border-primary/40 hover:shadow-md",
            handOffTask.task === startHereTask
              ? "border-2 border-primary/50 bg-primary/5 shadow-md shadow-primary/10"
              : "border-border bg-card",
          )}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-primary font-display text-sm font-bold text-primary-foreground">
            {index + 1}
          </span>
          <span className="min-w-0 flex-1 font-medium text-foreground">
            {handOffTask.task}
            {handOffTask.task === startHereTask && (
              <span className="gradient-primary ml-2 inline-block rounded-full px-2.5 py-0.5 align-middle text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                Start here
              </span>
            )}
          </span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-primary">
            {hrs(handOffTask.hours)}/wk
          </span>
        </li>
      ))}
    </ol>
  );
}

const roleResultFor = (audit: DelegationAuditResult, role: RoleKey) =>
  audit.roles[API_ROLE_BY_ROLE_KEY[role]];

function LocalHireOption({ audit }: { audit: DelegationAuditResult }) {
  const { ppSalary, csoSalary, setField } = useDelegationStore();
  const salaryInputs: Record<RoleKey, string> = {
    pp: ppSalary,
    cso: csoSalary,
  };
  const setSalary = (role: RoleKey, salary: string) =>
    setField(role === "pp" ? { ppSalary: salary } : { csoSalary: salary });

  return (
    <div className="grid min-w-0 content-start gap-5 p-6">
      <OptionSubheading>{LOCAL_HIRE_TITLE}</OptionSubheading>
      <p className="text-sm text-muted-foreground">
        Optional: enter the salary you'd expect to pay. It's used to work out
        your figures and in your emailed plan.
      </p>

      {ROLE_KEYS.map((role) => {
        const roleResult = roleResultFor(audit, role);
        if (!roleResult.hasWorkload) return null;

        const enteredSalary = Math.round(num(salaryInputs[role]));
        const localHire =
          enteredSalary > 0 && roleResult.localHire?.salary === enteredSalary
            ? roleResult.localHire
            : null;

        return (
          <div key={role} className="grid gap-3 border-t border-border pt-4">
            <div className="grid gap-2">
              <Label
                htmlFor={`${role}Salary`}
                className="font-semibold text-foreground"
              >
                {ROLES[role].title} salary a year
              </Label>
              <div className="relative w-full">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id={`${role}Salary`}
                  inputMode="numeric"
                  placeholder="Annual salary"
                  value={salaryInputs[role]}
                  onChange={(e) => setSalary(role, digits(e.target.value))}
                  className="pl-8 tabular-nums"
                />
              </div>
            </div>
            {localHire && (
              <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5 text-sm">
                <dt className="text-muted-foreground">Super guarantee 12%</dt>
                <dd className="text-right font-semibold tabular-nums">
                  {aud.format(localHire.superannuation)}
                </dd>
                <dt className="text-muted-foreground">
                  Full-time, salary + super
                </dt>
                <dd className="text-right font-semibold tabular-nums">
                  {aud.format(localHire.loadedSalary)}
                </dd>

                {/* <dt className="text-muted-foreground">
                  For {roleResult.resourceLabel}
                </dt>
                <dd className="text-right font-bold tabular-nums text-foreground">
                  {aud.format(localHire.annualCost)}
                </dd> */}
              </dl>
            )}
          </div>
        );
      })}

      <ul className="grid list-disc gap-2 border-t border-border pl-5 pt-4 text-sm text-muted-foreground">
        <li>
          This is a minimum. It doesn't include payroll tax (if your wages pass
          your state's threshold), workers' compensation insurance, annual leave
          loading where an award or contract provides it, long service leave,
          recruitment, training, equipment or software licences.
        </li>
        <li>
          A full-time employee is paid for {ANNUAL_LEAVE_WEEKS} weeks' annual
          leave, up to {PERSONAL_LEAVE_DAYS} days' sick and carer's leave and
          public holidays, so plan cover for those weeks.
        </li>
      </ul>
    </div>
  );
}

function AdviceLabOption({ audit }: { audit: DelegationAuditResult }) {
  return (
    <div className="grid min-w-0 content-start gap-5 p-6">
      <OptionSubheading>{ADVICE_LAB_TITLE}</OptionSubheading>
      <ul className="grid gap-3">
        {ROLE_KEYS.map((role) => {
          const roleResult = roleResultFor(audit, role);
          if (!roleResult.hasWorkload) return null;
          return (
            <li key={role} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong className="text-foreground">
                  {roleResult.resourceLabel}
                </strong>{" "}
                for your {hrs(roleResult.hours)} a week of{" "}
                {ROLES[role].name.toLowerCase()}.
              </span>
            </li>
          );
        })}
      </ul>
      <ul className="grid list-disc gap-2 border-t border-border pl-5 pt-4 text-sm text-muted-foreground">
        <li>
          Paraplanning and client support are separate roles, so each is a
          separate person.
        </li>
        <li>
          Your resource works in your systems and follows your templates. Allow
          time at the start for them to learn your processes.
        </li>
      </ul>
      <div className="rounded-xl bg-primary/5 p-4 text-sm">
        <strong className="text-foreground">
          Your emailed plan includes Advice Lab pricing,
        </strong>{" "}
        your yearly saving against a local hire and a clear recommendation for
        each role.
      </div>
      <Button asChild className="w-fit">
        <a href="#plan">
          Get my plan
          <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}

const LOCAL_HIRE_TITLE = "What a local hire costs";
const ADVICE_LAB_TITLE = "A dedicated resource through Advice Lab";

// On small screens the two sections stack, so each repeats its title in the
// body. On large screens the titles sit side by side in the card header.
function OptionSubheading({ children }: { children: string }) {
  return <h4 className="text-lg text-foreground lg:hidden">{children}</h4>;
}

function OptionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 px-6">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
        <Building2 className="h-5 w-5 text-primary-foreground" />
      </span>
      <h4 className="text-lg text-primary-foreground">{title}</h4>
    </div>
  );
}

function HireOptionsCard({ audit }: { audit: DelegationAuditResult }) {
  return (
    <div className="gradient-primary flex min-w-0 flex-col overflow-hidden rounded-2xl border-2 border-primary shadow-xl shadow-primary/15">
      <div className="grid gap-4 pb-11 pt-6 lg:grid-cols-2">
        <OptionHeader title={LOCAL_HIRE_TITLE} />
        <OptionHeader title={ADVICE_LAB_TITLE} />
      </div>
      <div className="-mt-6 grid flex-1 divide-y divide-border rounded-t-3xl bg-card pt-1 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <LocalHireOption audit={audit} />
        <AdviceLabOption audit={audit} />
      </div>
    </div>
  );
}

function BackToTasksButton({
  onBack,
  label,
}: {
  onBack: () => void;
  label: string;
}) {
  return (
    <Button variant="outline" onClick={onBack}>
      <ArrowLeft className="mr-1 h-4 w-4" />
      {label}
    </Button>
  );
}

function NoOwnTasks({ onBack }: { onBack: () => void }) {
  return (
    <div className="grid gap-4 py-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Your result
      </p>
      <h2 className="text-2xl text-foreground">
        You haven't marked any tasks as yours
      </h2>
      <p className="mx-auto max-w-md text-muted-foreground">
        Go back and choose "I do this" for anything you still handle yourself,
        then add the hours.
      </p>
      <div className="mx-auto mt-2">
        <BackToTasksButton onBack={onBack} label="Back to the tasks" />
      </div>
    </div>
  );
}

function AuditLoading() {
  return (
    <div
      className="flex items-center justify-center gap-3 py-16 text-muted-foreground"
      role="status"
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      Working out your result…
    </div>
  );
}

function AuditLoadError({
  onRetry,
  onBack,
}: {
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <div className="grid gap-4 py-6 text-center" role="alert">
      <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
      <h2 className="text-2xl text-foreground">
        We couldn't work out your result
      </h2>
      <p className="mx-auto max-w-md text-muted-foreground">
        Please check your connection and try again.
      </p>
      <div className="mx-auto mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={onRetry}>Try again</Button>
        <BackToTasksButton onBack={onBack} label="Change my answers" />
      </div>
    </div>
  );
}

function useTrackResultView(
  audit: DelegationAuditResult | undefined,
  isPlaceholderData: boolean,
) {
  const hasTrackedView = useRef(false);
  useEffect(() => {
    if (!audit || isPlaceholderData || hasTrackedView.current) return;
    hasTrackedView.current = true;
    track("audit_result_view", {
      hours_band: audit.hoursBand,
      roles: audit.rolesWithWork,
    });
  }, [audit, isPlaceholderData]);
}

export function ResultStep({ onBack }: { onBack: () => void }) {
  const hasOwnTasks = useHasOwnTasks();
  return hasOwnTasks ? (
    <AuditResult onBack={onBack} />
  ) : (
    <NoOwnTasks onBack={onBack} />
  );
}

function AuditResult({ onBack }: { onBack: () => void }) {
  const { answers, hours, rate } = useDelegationStore();
  const {
    data: audit,
    isError,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useDelegationAudit();
  useTrackResultView(audit, isPlaceholderData);

  if (!audit) {
    return isError ? (
      <AuditLoadError onRetry={() => refetch()} onBack={onBack} />
    ) : (
      <AuditLoading />
    );
  }

  const { outsourcedTaskCount } = audit.alreadyCovered;
  // Adviser figures only: the tasks answered "I do this".
  const adviserTasks = GROUPS.flatMap((group) => group.tasks).filter(
    ([task]) => answers[task] === "me",
  );
  const adviserTaskCount = adviserTasks.length;
  const adviserTaskCountByRole: Record<RoleKey, number> = { pp: 0, cso: 0 };
  for (const group of GROUPS) {
    adviserTaskCountByRole[group.role] += group.tasks.filter(
      ([task]) => answers[task] === "me",
    ).length;
  }
  const adviserHours = adviserTasks.reduce(
    (sum, [task]) => sum + (hours[task] ?? 0),
    0,
  );
  const hourlyRate = num(rate);
  const workingWeeks = 52 - ANNUAL_LEAVE_WEEKS;
  const adviserValue = adviserHours * hourlyRate * workingWeeks;

  // Every task you or your team does, biggest first.
  // Built from the answers because the API only returns your own top three.
  const tasksAnswered = (who: "me" | "team"): HandOffTask[] =>
    GROUPS.flatMap((group) => group.tasks)
      .flatMap(([task]) =>
        answers[task] === who ? [{ task, hours: hours[task] ?? 0 }] : [],
      )
      .sort((first, second) => second.hours - first.hours);
  const yourHandOffTasks = tasksAnswered("me");
  const teamHandOffTasks = tasksAnswered("team");
  const startHereTask = yourHandOffTasks[0]?.task;

  return (
    <div className="grid gap-10" aria-busy={isFetching}>
      {isError && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          We couldn't update your figures just now. These are from your last
          change.
        </p>
      )}

      <section className="relative grid gap-4 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-card to-primary/10 p-5 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <p className="relative w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Your result
        </p>
        <div className="relative grid gap-6 md:grid-cols-2">
          <div className="grid content-center gap-1">
            <p className="text-sm font-semibold text-muted-foreground">
              You spend
            </p>
            <p className="font-display text-4xl font-bold leading-none tabular-nums md:text-5xl">
              <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                <CountUp value={adviserHours} format={hrs} />
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              a week on work you could hand off
            </p>
          </div>
          <div className="grid content-center gap-1 border-t border-primary/15 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <p className="text-sm font-semibold text-muted-foreground">
              That time is worth
            </p>
            {adviserValue > 0 ? (
              <>
                <p className="font-display text-4xl font-bold leading-none tabular-nums text-primary md:text-5xl">
                  <CountUp
                    value={adviserValue}
                    format={(value) => aud.format(value)}
                  />
                </p>
                <p className="text-sm text-muted-foreground">a year</p>
                <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                  {hrs(adviserHours)} × {aud.format(hourlyRate)} ×{" "}
                  {workingWeeks} weeks
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add your hourly value in the Adviser step to see what this time
                is worth.
              </p>
            )}
          </div>
          <div className="grid gap-3 border-t border-primary/15 pt-4 md:col-span-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">
                <CountUp
                  value={adviserTaskCount}
                  format={(value) => plural(Math.round(value), "task")}
                />
              </strong>{" "}
              you do yourself:
            </p>
            <ul className="flex flex-wrap gap-2">
              {ROLE_KEYS.map((role) => (
                <li
                  key={role}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
                >
                  {ROLES[role].name}
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-primary px-1.5 text-xs font-bold tabular-nums text-primary-foreground">
                    <CountUp
                      value={adviserTaskCountByRole[role]}
                      format={(value) => String(Math.round(value))}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="grid gap-2">
          <h3 className="flex items-center gap-2 text-xl text-foreground">
            <User className="h-5 w-5 text-primary" />
            Your tasks to hand off first
          </h3>
          <span className="gradient-primary h-1 w-12 rounded-full" />
        </div>
        {yourHandOffTasks.length > 0 ? (
          <HandOffList tasks={yourHandOffTasks} startHereTask={startHereTask} />
        ) : (
          <p className="text-sm text-muted-foreground">
            You aren't doing any of these tasks yourself.
          </p>
        )}
        {teamHandOffTasks.length > 0 && (
          <>
            <div className="mt-4 grid gap-2">
              <h3 className="flex items-center gap-2 text-xl text-foreground">
                <Users className="h-5 w-5 text-primary" />
                Your team's tasks
              </h3>
              <span className="gradient-primary h-1 w-12 rounded-full" />
            </div>
            <HandOffList tasks={teamHandOffTasks} />
          </>
        )}
        {outsourcedTaskCount > 0 && (
          <p className="text-sm text-muted-foreground">
            Already covered: {plural(outsourcedTaskCount, "task")} outsourced.
          </p>
        )}
      </section>

      <section className="grid gap-4">
        <div className="grid gap-2">
          <h3 className="text-xl text-foreground">
            Ways to get these hours back
          </h3>
          <span className="gradient-primary h-1 w-12 rounded-full" />
        </div>
        <HireOptionsCard audit={audit} />
      </section>

      <PlanForm />

      <div className="border-t border-border pt-6">
        <BackToTasksButton onBack={onBack} label="Change my answers" />
      </div>
    </div>
  );
}
