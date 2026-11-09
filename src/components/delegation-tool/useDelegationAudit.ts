import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useDelegationStore from "@/store/useDelegationStore";
import { buildAuditRequest, fetchDelegationAudit } from "@/store/delegationAuditApi";

const RECALCULATE_DELAY_MS = 400;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debouncedValue;
}

export function useHasOwnTasks() {
  return useDelegationStore((state) =>
    Object.values(state.answers).some((answer) => answer === "me" || answer === "team"),
  );
}

export function useDelegationAudit() {
  const { answers, hours, rate, st, ppSalary, csoSalary, team } = useDelegationStore();
  const hasOwnTasks = useHasOwnTasks();

  const auditRequest = useMemo(
    () => buildAuditRequest({ answers, hours, rate, st, ppSalary, csoSalary, team }),
    [answers, hours, rate, st, ppSalary, csoSalary, team],
  );
  const debouncedRequest = useDebouncedValue(auditRequest, RECALCULATE_DELAY_MS);

  return useQuery({
    queryKey: ["delegation-audit", debouncedRequest],
    queryFn: ({ signal }) => fetchDelegationAudit(debouncedRequest, signal),
    enabled: hasOwnTasks,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
}
