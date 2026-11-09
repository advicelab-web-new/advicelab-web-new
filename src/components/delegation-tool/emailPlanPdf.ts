import { PLAN_EMAIL_URL } from "./data";
import { buildPlanPayload } from "./downloadPlanPdf";

export class PlanRequestError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "PlanRequestError";
    this.code = code;
  }
}

export async function emailPlanPdf(extra: { consent: boolean; website: string }): Promise<{ status: "sent" }> {
  const res = await fetch(PLAN_EMAIL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...buildPlanPayload(), ...extra }),
  });
  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    throw new PlanRequestError(body?.message || "We couldn't send your plan just now.", body?.error || "");
  }
  return { status: body.status };
}
