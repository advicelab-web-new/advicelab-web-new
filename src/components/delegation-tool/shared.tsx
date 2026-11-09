import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import useDelegationStore from "@/store/useDelegationStore";
import { ROLES, ROLE_STYLES, type RoleKey } from "./data";

export function track(name: string, params: Record<string, unknown> = {}) {
  const ref_code = useDelegationStore.getState().refCode || "none";
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, { ...params, ref_code });
  }
}

export function RoleBadge({ role, className }: { role: RoleKey; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        ROLE_STYLES[role].badge,
        className,
      )}
    >
      {ROLES[role].title} work
    </span>
  );
}

const STEP_LABELS = ["Paraplanning", "Reviews", "Admin", "Your team", "Adviser", "Result"];

export function AuditProgress({ step }: { step: number }) {
  return (
    <ol className="mb-8 flex" aria-label="Progress">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const complete = n < step;
        const current = n === step;
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center gap-2" aria-current={current ? "step" : undefined}>
            {n < STEP_LABELS.length && (
              <span aria-hidden="true" className="absolute left-1/2 top-[18px] h-1 w-full -translate-y-1/2 overflow-hidden rounded-full bg-border">
                <span className={cn("gradient-primary block h-full transition-[width] duration-500", complete ? "w-full" : "w-0")} />
              </span>
            )}
            <span
              className={cn(
                "relative z-10 grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-all duration-300",
                complete && "gradient-primary text-primary-foreground shadow-md",
                current && "gradient-primary scale-110 text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/15",
                !complete && !current && "border-2 border-border bg-card text-muted-foreground",
              )}
            >
              {complete ? <Check className="h-4 w-4" /> : n}
            </span>
            <span
              className={cn(
                "text-center text-xs font-semibold",
                current ? "block text-foreground" : "hidden sm:block",
                complete && "text-primary",
                !complete && !current && "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

// export function AuditProgress({ step }: { step: number }) {
//   return (
//     <nav aria-label="Progress" className="mb-8">
//       <ol className="flex">
//         {STEP_LABELS.map((label, i) => {
//           const n = i + 1;
//           const complete = n < step;
//           const current = n === step;
//           return (
//             <li key={label} className="relative flex flex-1 flex-col items-center gap-2" aria-current={current ? "step" : undefined}>
//               {n < STEP_LABELS.length && (
//                 <span
//                   aria-hidden="true"
//                   className={cn(
//                     "absolute left-1/2 top-4 h-0.5 w-full -translate-y-1/2 transition-colors",
//                     complete ? "bg-primary" : "bg-border",
//                   )}
//                 />
//               )}
//               <span
//                 className={cn(
//                   "relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 text-sm font-semibold transition-colors",
//                   complete && "border-primary bg-primary text-primary-foreground",
//                   current && "border-primary bg-card text-primary ring-4 ring-primary/15",
//                   !complete && !current && "border-border bg-card text-muted-foreground",
//                 )}
//               >
//                 {complete ? <Check className="h-4 w-4" /> : n}
//               </span>
//               <span
//                 className={cn(
//                   "text-center text-xs font-medium",
//                   current ? "block text-foreground" : "hidden sm:block",
//                   complete && "text-primary",
//                   !complete && !current && "text-muted-foreground",
//                 )}
//               >
//                 {label}
//               </span>
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// }

export const cardClass = "rounded-2xl border border-border bg-card shadow-sm";
