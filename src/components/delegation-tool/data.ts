// ─── Settings ──────────────────────────────────────────────────────────────────
// Lambda Function URL (Developer Build Guide, Step 4). Empty = preview mode: nothing is sent.
export const API_URL = "";
// Advice Lab backend (advice-lab-web-backend). Point this at the deployed API Gateway URL in production.
export const BACKEND_URL = "https://jkx0gf7zwi.execute-api.ap-southeast-2.amazonaws.com/default";
export const AUDIT_CALCULATE_URL = `${BACKEND_URL}/api/v1/delegation-audit/calculate`;
// export const PLAN_PDF_URL = `${BACKEND_URL}/api/v1/delegation-audit/pdf`;
export const PLAN_EMAIL_URL = `${BACKEND_URL}/api/v1/delegation-audit/send-plan`;
export const CONTACT_URL = "/contact-us";
export const PRIVACY_URL = "https://www.advicelab.com.au/privacy-policy"; // check this address: no matching route in this site yet


export const FULL_TIME_HOURS = 38; 
export const ANNUAL_LEAVE_WEEKS = 4; 
export const PERSONAL_LEAVE_DAYS = 10; 

export const STATE_CODES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;
export type StateCode = (typeof STATE_CODES)[number];

export const FREE_EMAIL = ["gmail.com", "googlemail.com", "outlook.com", "outlook.com.au", "hotmail.com", "hotmail.com.au", "live.com", "live.com.au", "msn.com", "yahoo.com", "yahoo.com.au", "ymail.com", "icloud.com", "me.com", "mac.com", "aol.com", "proton.me", "protonmail.com", "gmx.com", "mail.com", "zoho.com", "bigpond.com", "bigpond.net.au", "optusnet.com.au", "iinet.net.au", "internode.on.net", "tpg.com.au", "westnet.com.au", "dodo.com.au", "aapt.net.au"];


export type RoleKey = "pp" | "cso";

export const ROLES: Record<RoleKey, { name: string; person: string; title: string }> = {
  pp: { name: "Paraplanning", person: "paraplanner", title: "Paraplanner" },
  cso: { name: "Client support", person: "client service officer", title: "Client service officer" },
};

export interface TaskGroup {
  key: string;
  apiKey: string; 
  role: RoleKey;
  name: string;
  intro: string;
  tasks: [name: string, detail: string][];
}

export const GROUPS: TaskGroup[] = [
  {
    key: "para",
    apiKey: "paraplanning",
    role: "pp",
    name: "Paraplanning",
    intro: "Research, modelling and writing advice documents.",
    tasks: [
      ["Product research and comparisons", "Existing vs recommended products, alternative platforms (e.g. Wealthsolver)"],
      ["Modelling and projections", "Retirement, cash flow, contribution strategies, tax impacts (e.g. Xtools)"],
      ["Insurance research", "Policy comparisons, definitions and exclusions, premium structures (e.g. Risk Researcher)"],
      ["Writing Statements and Records of Advice", "Once you have approved the research outcomes"],
    ],
  },
  {
    key: "review",
    apiKey: "client_support_reviews_and_implementation",
    role: "cso",
    name: "Client support: reviews and implementation",
    intro: "The work around review meetings and putting advice in place.",
    tasks: [
      ["Preparing review packs", "Getting client files ready for annual review meetings"],
      ["Post-review updates", "Benchmark linking, rolling over review dates, updating records"],
      ["Ongoing fee consent forms and client service agreements", "Preparing, sending and processing them"],
      ["Preparing applications", "Drafting applications to support SoA and RoA recommendations"],
      ["Implementing advice", "Lodging signed applications and following providers up until processed"],
      ["Switches, rebalances and trades", "Executing them once advice is approved"],
      ["Execution-only and hold RoAs", "Simple advice documents prepared in your CRM"],
      ["Third-party authority forms", "Preparing TPAs for providers"],
    ],
  },
  {
    key: "admin",
    apiKey: "client_support_records_and_admin",
    role: "cso",
    name: "Client support: records and admin",
    intro: "Keeping client records, providers and paperwork moving.",
    tasks: [
      ["Updating client records in your CRM", "New clients, offboarding, deceased estates, client splits (e.g. Xplan)"],
      ["Insurance admin", "Quotes, alterations, renewals, overdue premiums and claims"],
      ["AML and compliance checks", "Identity checks and record updates"],
      ["Liaising with providers on client queries", "Calls and follow-ups until resolved"],
      ["DocuSign and e-signatures", "Sending, tracking, confirming and archiving"],
      ["Mailbox management", "Triaging the shared inbox and client requests"],
      ["Platform reports and corporate actions", "Generating reports and handling provider corporate actions"],
      ["Filing and documentation", "Saving documents to your CRM and server"],
    ],
  },
];

export const TASK_COUNT = GROUPS.reduce((n, g) => n + g.tasks.length, 0);

export type Choice = "me" | "team" | "out" | "na";
export const CHOICES: [Choice, string][] = [
  ["me", "I do this"],
  ["team", "My team does it"],
  ["out", "Outsourced"],
  ["na", "Not relevant"],
];

export const ROLE_STYLES: Record<RoleKey, { badge: string; bar: string; text: string; accent: string }> = {
  pp: { badge: "bg-primary/10 text-primary", bar: "bg-primary", text: "text-primary", accent: "border-t-primary" },
  cso: { badge: "bg-primary/10 text-primary", bar: "bg-primary", text: "text-primary", accent: "border-t-primary" },
};