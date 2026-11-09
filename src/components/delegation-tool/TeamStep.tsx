import { useState } from "react";
import { FileText, Headset, Minus, Plus, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useDelegationStore, {
  type EmploymentType,
  type TeamRow,
} from "@/store/useDelegationStore";
import { aud, digits, hrs, num, plural } from "./format";
import { GROUPS, ROLES, type RoleKey } from "./data";
import { StepHeader, StepNav } from "./StepNav";

const ROLE_KEYS: RoleKey[] = ["pp", "cso"];
const SUPER_RATE = 0.12;
const MAX_STAFF = 50;
const MAX_AVATARS = 8;

const ROLE_ICONS: Record<RoleKey, LucideIcon> = { pp: FileText, cso: Headset };

const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  fullTime: "Full-time",
  partTime: "Part-time",
};

// Headcount × annual salary per person, before super.
const rowCost = (row: TeamRow) => num(row.count) * num(row.annualSalary);
const roleHeadcount = (rows: TeamRow[]) =>
  rows.reduce((sum, row) => sum + num(row.count), 0);
// Every row needs a headcount (0 is a valid answer) before moving on.
const isMissingCount = (row: TeamRow) => row.count.trim() === "";
// A row with team members must also have their salary before moving on.
const isMissingSalary = (row: TeamRow) =>
  num(row.count) > 0 && num(row.annualSalary) <= 0;
const roleCost = (rows: TeamRow[]) =>
  rows.reduce((sum, row) => sum + rowCost(row), 0);

function StaffCounter({
  id,
  value,
  label,
  invalid,
  onChange,
}: {
  id: string;
  // Empty string means not answered yet; "0" is a valid answer.
  value: string;
  label: string;
  invalid: boolean;
  onChange: (count: string) => void;
}) {
  const count = num(value);
  const stepBtn =
    "grid h-9 w-9 place-items-center text-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center overflow-hidden rounded-lg border bg-card",
        invalid ? "border-destructive ring-1 ring-destructive" : "border-border",
      )}
    >
      <button
        type="button"
        aria-label={`Fewer ${label}`}
        disabled={count <= 0}
        onClick={() => onChange(String(count - 1))}
        className={stepBtn}
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        required
        aria-required="true"
        aria-invalid={invalid}
        aria-label={`Number of ${label}`}
        placeholder="–"
        value={value}
        onKeyDown={(e) => {
          // Whole team members only: no minus, decimal point or exponent.
          if (["-", "+", ".", ",", "e", "E"].includes(e.key))
            e.preventDefault();
        }}
        onChange={(e) => {
          const whole = e.target.value.replace(/\D/g, "");
          onChange(
            whole ? String(Math.min(MAX_STAFF, parseInt(whole, 10))) : "",
          );
        }}
        className="h-9 w-12 border-x border-border bg-transparent text-center font-bold tabular-nums text-foreground outline-none placeholder:text-muted-foreground focus:bg-primary/5"
      />
      <button
        type="button"
        aria-label={`More ${label}`}
        disabled={count >= MAX_STAFF}
        onClick={() => onChange(String(count + 1))}
        className={stepBtn}
      >
        <Plus className="h-4 w-4" />
      </button>
    </span>
  );
}

function Headcount({
  fullTime,
  partTime,
}: {
  fullTime: number;
  partTime: number;
}) {
  const total = fullTime + partTime;
  if (total === 0) {
    return (
      <p className="flex h-8 items-center text-sm text-muted-foreground">
        No one in this role yet
      </p>
    );
  }
  // Full-time staff in solid colour, part-time faded, up to MAX_AVATARS.
  const people = [
    ...Array<boolean>(fullTime).fill(true),
    ...Array<boolean>(partTime).fill(false),
  ].slice(0, MAX_AVATARS);
  return (
    <div className="flex items-center" aria-hidden="true">
      {people.map((isFullTime, index) => (
        <span
          key={index}
          className={cn(
            "-ml-2 grid h-8 w-8 place-items-center rounded-full ring-2 ring-card animate-in zoom-in-50 fade-in duration-300 first:ml-0",
            isFullTime
              ? "gradient-primary text-primary-foreground"
              : "bg-primary/15 text-primary",
          )}
        >
          <User className="h-4 w-4" />
        </span>
      ))}
      {total > MAX_AVATARS && (
        <span className="-ml-2 grid h-8 min-w-8 place-items-center rounded-full bg-secondary px-2 text-xs font-bold text-foreground ring-2 ring-card">
          +{total - MAX_AVATARS}
        </span>
      )}
    </div>
  );
}

function RoleTeamCard({
  role,
  showErrors,
}: {
  role: RoleKey;
  showErrors: boolean;
}) {
  const { team, setTeamRow } = useDelegationStore();
  const rows = team[role];
  const Icon = ROLE_ICONS[role];
  const countFor = (type: EmploymentType) =>
    num(rows.find((row) => row.type === type)?.count ?? 0);
  const headcount = roleHeadcount(rows);
  const cost = roleCost(rows);

  return (
    <div className="group grid min-w-0 content-start gap-5 rounded-2xl border border-border bg-card p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl md:p-6">
      <div className="flex items-center gap-3">
        <span className="gradient-primary grid h-11 w-11 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-foreground">
            {ROLES[role].title}s
          </h3>
          <p className="text-xs text-muted-foreground">
            {plural(headcount, "person")} in your team
          </p>
        </div>
      </div>

      <Headcount
        fullTime={countFor("fullTime")}
        partTime={countFor("partTime")}
      />

      <div className="grid gap-3">
        {rows.map((row, index) => {
          const typeLabel = EMPLOYMENT_TYPE_LABELS[row.type];
          const staffLabel = `${typeLabel.toLowerCase()} ${ROLES[role].person}s`;
          const count = num(row.count);
          const countError = showErrors && isMissingCount(row);
          const salaryError = showErrors && isMissingSalary(row);
          const countId = `team-${role}-${row.type}-count`;
          const salaryId = `team-${role}-${row.type}-salary`;
          return (
            <div
              key={row.type}
              className={cn(
                "grid gap-3 rounded-xl border p-3 transition-colors duration-300",
                countError || salaryError
                  ? "border-destructive/50 bg-destructive/5"
                  : count > 0
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-secondary/40",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="grid">
                  <span className="text-sm font-semibold text-foreground">
                    {typeLabel}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    No. of team members{" "}
                    <span className="text-destructive">*</span>
                  </span>
                </span>
                <StaffCounter
                  id={countId}
                  value={row.count}
                  label={staffLabel}
                  invalid={countError}
                  onChange={(next) => setTeamRow(role, index, { count: next })}
                />
              </div>
              {countError && (
                <span
                  role="alert"
                  className="-mt-1 text-xs font-medium text-destructive"
                >
                  Enter how many you have. Enter 0 if none.
                </span>
              )}
              {count > 0 && (
                <label className="grid gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                  <span className="text-xs font-medium text-muted-foreground">
                    Average salary per person, a year{" "}
                    <span className="text-destructive">*</span>
                  </span>
                  <span className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      id={salaryId}
                      required
                      aria-invalid={salaryError}
                      aria-describedby={
                        salaryError ? `${salaryId}-error` : undefined
                      }
                      aria-label={`Average annual salary per ${typeLabel.toLowerCase()} ${ROLES[role].person}`}
                      inputMode="numeric"
                      placeholder="e.g. 85000"
                      value={row.annualSalary}
                      onChange={(e) =>
                        setTeamRow(role, index, {
                          annualSalary: digits(e.target.value),
                        })
                      }
                      className={cn(
                        "h-10 bg-card pl-7 pr-16 tabular-nums placeholder:text-xs",
                        salaryError &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      / person
                    </span>
                  </span>
                  {salaryError && (
                    <span
                      id={`${salaryId}-error`}
                      role="alert"
                      className="text-xs font-medium text-destructive"
                    >
                      Add the average salary for{" "}
                      {count === 1
                        ? "this team member"
                        : `these ${count} team members`}
                      .
                    </span>
                  )}
                  {count > 1 && num(row.annualSalary) > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {count} × {aud.format(num(row.annualSalary))} ={" "}
                      <strong className="text-foreground">
                        {aud.format(rowCost(row))}
                      </strong>{" "}
                      a year
                    </span>
                  )}
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-1 border-t border-border pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-muted-foreground">
            Salaries a year (with 12% super)
          </span>
          <span className="font-display text-xl font-bold tabular-nums text-foreground">
            {aud.format(cost * (1 + SUPER_RATE))}
          </span>
        </div>
        {cost > 0 && (
          <span className="text-right text-xs tabular-nums text-muted-foreground">
            {aud.format(cost)} salaries + {aud.format(cost * SUPER_RATE)} super
          </span>
        )}
      </div>
    </div>
  );
}

function TeamSummary() {
  const { answers, hours, team } = useDelegationStore();
  const teamTasks = GROUPS.flatMap((group) => group.tasks).filter(
    ([task]) => answers[task] === "team",
  );
  const teamHours = teamTasks.reduce(
    (sum, [task]) => sum + (hours[task] ?? 0),
    0,
  );
  const headcount = ROLE_KEYS.reduce(
    (sum, role) => sum + roleHeadcount(team[role]),
    0,
  );
  const annualTotal = ROLE_KEYS.reduce(
    (sum, role) => sum + roleCost(team[role]),
    0,
  );

  return (
    <section className="relative grid gap-4 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-card to-primary/10 p-5 sm:grid-cols-3 md:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative grid gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your team
        </span>
        <span className="flex items-center gap-2 font-display text-2xl font-bold tabular-nums text-foreground">
          <Users className="h-5 w-5 text-primary" />
          {plural(headcount, "person")}
        </span>
      </div>
      <div className="relative grid gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Time on these tasks
        </span>
        <span className="font-display text-2xl font-bold tabular-nums text-foreground">
          {hrs(teamHours)}
          <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
            a week
          </span>
        </span>
      </div>
      <div className="relative grid gap-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Cost a year (with 12% super)
        </span>
        <span className="bg-[image:var(--gradient-primary)] bg-clip-text font-display text-2xl font-bold tabular-nums text-transparent">
          {aud.format(annualTotal * (1 + SUPER_RATE))}
        </span>
      </div>
      {teamTasks.length === 0 && (
        <p className="relative text-sm text-muted-foreground sm:col-span-3">
          You didn't mark any tasks as "My team does it". You can still add your
          team here, or enter 0 for each if you don't have one.
        </p>
      )}
    </section>
  );
}

export function TeamStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const team = useDelegationStore((state) => state.team);
  const [showErrors, setShowErrors] = useState(false);
  // Field ids in page order, so focus lands on the first gap.
  const missingFields = ROLE_KEYS.flatMap((role) =>
    team[role].flatMap((row) => [
      ...(isMissingCount(row) ? [`team-${role}-${row.type}-count`] : []),
      ...(isMissingSalary(row) ? [`team-${role}-${row.type}-salary`] : []),
    ]),
  );

  const handleNext = () => {
    if (missingFields.length > 0) {
      setShowErrors(true);
      document.getElementById(missingFields[0])?.focus();
      return;
    }
    onNext();
  };

  return (
    <div>
      <StepHeader
        step={4}
        title="Who's on your team?"
        intro="Add the paraplanners and client service officers you already have, so we can compare what they cost with what we'd cost. Enter 0 if you don't have any. It takes a few seconds."
      />
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          {ROLE_KEYS.map((role) => (
            <RoleTeamCard key={role} role={role} showErrors={showErrors} />
          ))}
        </div>
        <TeamSummary />
      </div>
      <StepNav
        onBack={onBack}
        onNext={handleNext}
        middle={
          showErrors && missingFields.length > 0 ? (
            <span className="font-medium text-destructive">
              Fill in every field. Enter 0 if you have no one in a role.
            </span>
          ) : (
            "All fields required"
          )
        }
      />
    </div>
  );
}
