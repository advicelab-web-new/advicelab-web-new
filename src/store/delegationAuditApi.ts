import {
  ANNUAL_LEAVE_WEEKS,
  AUDIT_CALCULATE_URL,
  FULL_TIME_HOURS,
  GROUPS,
  ROLES,
  type Choice,
  type RoleKey,
  type StateCode,
} from "@/components/delegation-tool/data";
import { num } from "@/components/delegation-tool/format";
import type { TeamRow } from "./useDelegationStore";

export type PlanPath = "hire" | "outsource" | "compare";

const PART_TIME_HOURS_PER_WEEK = 20;
const WORKING_WEEKS_PER_YEAR = 52 - ANNUAL_LEAVE_WEEKS;

export interface TaskAnswer {
  answer: Choice;
  hours?: number;
}

export interface TeamStaff {
  staff: number;
  /** Annual salary per person. */
  salary: number;
}

export interface TeamRoleRequest {
  fullTime: TeamStaff;
  partTime: TeamStaff & { hoursPerWeek: number };
}

export interface DelegationAuditRequest {
  state: StateCode;
  rate: number;
  ppSalary: number;
  csoSalary: number;
  team: Record<"paraplanning" | "clientSupport", TeamRoleRequest>;
  tasks: Record<string, Record<string, TaskAnswer>>;
}

export interface AuditInputs {
  answers: Record<string, Choice | undefined>;
  hours: Record<string, number>;
  rate: string;
  st: StateCode;
  ppSalary: string;
  csoSalary: string;
  team: Record<RoleKey, TeamRow[]>;
}

// The team card and API both use annual salaries.
function teamStaff(rows: TeamRow[], type: TeamRow["type"]): TeamStaff {
  const row = rows.find((teamRow) => teamRow.type === type);
  return {
    staff: num(row?.count ?? 0),
    salary: num(row?.annualSalary ?? 0),
  };
}

function teamRoleRequest(rows: TeamRow[]): TeamRoleRequest {
  return {
    fullTime: teamStaff(rows, "fullTime"),
    partTime: { ...teamStaff(rows, "partTime"), hoursPerWeek: PART_TIME_HOURS_PER_WEEK },
  };
}

export function buildAuditRequest({ answers, hours, rate, st, ppSalary, csoSalary, team }: AuditInputs): DelegationAuditRequest {
  const tasks = Object.fromEntries(
    GROUPS.map((group) => [
      group.apiKey,
      Object.fromEntries(
        group.tasks.flatMap(([taskName]) => {
          const answer = answers[taskName];
          if (!answer) return [];
          const taskAnswer: TaskAnswer =
            answer === "me" || answer === "team" ? { answer, hours: hours[taskName] } : { answer };
          return [[taskName, taskAnswer]];
        }),
      ),
    ]),
  );

  return {
    state: st,
    rate: num(rate),
    ppSalary: num(ppSalary),
    csoSalary: num(csoSalary),
    team: {
      paraplanning: teamRoleRequest(team.pp),
      clientSupport: teamRoleRequest(team.cso),
    },
    tasks,
  };
}


export type ApiRoleKey = "paraplanning" | "clientSupport";

export const ROLE_KEY_BY_API_ROLE: Record<ApiRoleKey, RoleKey> = { paraplanning: "pp", clientSupport: "cso" };
export const API_ROLE_BY_ROLE_KEY: Record<RoleKey, ApiRoleKey> = { pp: "paraplanning", cso: "clientSupport" };

export interface LocalHireCost {
  salary: number;
  salaryBasis: string;
  superannuation: number;
  loadedSalary: number;
  fullTimeEquivalent: number;
  annualCost: number;
  description: string;
}

export interface RoleAuditResult {
  role: ApiRoleKey;
  roleTitle: string;
  hours: number;
  taskCount: number;
  tasks?: { task: string; hours: number }[]; // not returned by the calculate API
  resourceUnits: ("fullTime" | "partTime")[];
  resourceLabel: string;
  fullTimeWeekSharePercent: number;
  fullTimeWeekBarWidthPercent?: number;
  localHire?: LocalHireCost | null;
  hasWorkload: boolean;
}

export interface HandOffTask {
  task: string;
  role: ApiRoleKey;
  roleTitle: string;
  hours: number;
}

export interface DelegationAuditResult {
  totalHours: number;
  hoursBand?: string;
  rolesWithWork: "both" | "paraplanner" | "cso" | "none";
  alreadyCovered: { teamTaskCount: number; outsourcedTaskCount: number };
  topTasksToHandOff: HandOffTask[];
  valueOfTime: { hourlyRate: number; weekly: number; annual: number; workingWeeksPerYear: number } | null;
  roles: Record<ApiRoleKey, RoleAuditResult>;
}

export class DelegationApiError extends Error {
  constructor(public code: string, public status?: number) {
    super(code);
    this.name = "DelegationApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function adaptCalculateResponse(
  data: unknown,
  request: DelegationAuditRequest,
): DelegationAuditResult {
  if (!isRecord(data)) {
    throw new DelegationApiError("invalid_response");
  }

  const paraplanningAdviserValue = data.paraplanningAdviserTimeValuePerYear;
  const clientSupportAdviserValue = data.clientSupportAdviserTimeValuePerYear;
  const hasValidAdviserValues =
    typeof paraplanningAdviserValue === "number" &&
    Number.isFinite(paraplanningAdviserValue) &&
    typeof clientSupportAdviserValue === "number" &&
    Number.isFinite(clientSupportAdviserValue);
  if (request.rate > 0 && !hasValidAdviserValues) {
    throw new DelegationApiError("invalid_response");
  }

  const roleHours: Record<RoleKey, number> = { pp: 0, cso: 0 };
  const roleTaskCounts: Record<RoleKey, number> = { pp: 0, cso: 0 };
  const handOffTasks: HandOffTask[] = [];
  let outsourcedTaskCount = 0;
  let teamTaskCount = 0;

  for (const group of GROUPS) {
    for (const [task] of group.tasks) {
      const taskAnswer = request.tasks[group.apiKey]?.[task];
      if (!taskAnswer) continue;

      if (taskAnswer.answer === "out") {
        outsourcedTaskCount += 1;
      } else if (taskAnswer.answer === "team") {
        teamTaskCount += 1;
      }

      if (taskAnswer.answer !== "me" && taskAnswer.answer !== "team") continue;

      const hours = taskAnswer.hours ?? 0;
      roleHours[group.role] += hours;
      roleTaskCounts[group.role] += 1;
      handOffTasks.push({
        task,
        role: group.role === "pp" ? "paraplanning" : "clientSupport",
        roleTitle: ROLES[group.role].title,
        hours,
      });
    }
  }

  // Local hire cost for the adviser's own hours, from the entered salary.
  // The API returns the full-time and part-time cost; super is 12% on top.
  const localHireFor = (role: RoleKey): LocalHireCost | null => {
    const apiRole = API_ROLE_BY_ROLE_KEY[role];
    const salary = Math.round(role === "pp" ? request.ppSalary : request.csoSalary);
    const costs = [
      data[`${apiRole}AdviserWorkLocalFullTimePerYear`],
      data[`${apiRole}AdviserWorkLocalPartTimePerYear`],
    ].filter((cost): cost is number => typeof cost === "number" && Number.isFinite(cost));
    if (salary <= 0 || costs.length === 0) return null;

    const loadedSalary = Math.round(salary * 1.12);
    const annualCost = costs.reduce((sum, cost) => sum + cost, 0);
    return {
      salary,
      salaryBasis: "entered",
      superannuation: loadedSalary - salary,
      loadedSalary,
      fullTimeEquivalent: annualCost / loadedSalary,
      annualCost,
      description: "",
    };
  };

  const roleResult = (role: RoleKey): RoleAuditResult => {
    const hours = roleHours[role];
    const hasWorkload = roleTaskCounts[role] > 0;
    const fullTimeResourceCount = Math.ceil(hours / FULL_TIME_HOURS);
    const resourceUnits: RoleAuditResult["resourceUnits"] =
      hours <= PART_TIME_HOURS_PER_WEEK ? ["partTime"] : ["fullTime"];
    const resourceLabel =
      hours <= PART_TIME_HOURS_PER_WEEK
        ? "Part-time resource"
        : `${fullTimeResourceCount} full-time ${fullTimeResourceCount === 1 ? "resource" : "resources"}`;

    return {
      role: role === "pp" ? "paraplanning" : "clientSupport",
      roleTitle: ROLES[role].title,
      hours,
      taskCount: roleTaskCounts[role],
      resourceUnits,
      resourceLabel,
      fullTimeWeekSharePercent: Math.round((hours / FULL_TIME_HOURS) * 100),
      fullTimeWeekBarWidthPercent: Math.min(100, (hours / FULL_TIME_HOURS) * 100),
      localHire: localHireFor(role),
      hasWorkload,
    };
  };
  const roles: Record<ApiRoleKey, RoleAuditResult> = {
    paraplanning: roleResult("pp"),
    clientSupport: roleResult("cso"),
  };

  const totalHours = roleHours.pp + roleHours.cso;
  const workingRoles = (["pp", "cso"] as const).filter((role) => roleTaskCounts[role] > 0);
  const rolesWithWork =
    workingRoles.length === 2
      ? "both"
      : workingRoles[0] === "pp"
        ? "paraplanner"
        : workingRoles[0] === "cso"
          ? "cso"
          : "none";
  const annualValue = hasValidAdviserValues
    ? paraplanningAdviserValue + clientSupportAdviserValue
    : 0;
  const valueOfTime =
    request.rate > 0
      ? {
          hourlyRate: request.rate,
          weekly: annualValue / WORKING_WEEKS_PER_YEAR,
          annual: annualValue,
          workingWeeksPerYear: WORKING_WEEKS_PER_YEAR,
        }
      : null;

  return {
    totalHours,
    rolesWithWork,
    alreadyCovered: { teamTaskCount, outsourcedTaskCount },
    topTasksToHandOff: handOffTasks.sort((first, second) => second.hours - first.hours).slice(0, 3),
    valueOfTime,
    roles,
  };
}

export async function fetchDelegationAudit(
  request: DelegationAuditRequest,
  signal?: AbortSignal,
): Promise<DelegationAuditResult> {
  const response = await fetch(AUDIT_CALCULATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new DelegationApiError(body?.error || "server_error", response.status);
  }
  return adaptCalculateResponse(body.data, request);
}
