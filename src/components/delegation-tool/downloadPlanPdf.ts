import useDelegationStore from "@/store/useDelegationStore";
import { buildAuditRequest } from "@/store/delegationAuditApi";
// import { PLAN_PDF_URL } from "./data";

const DEFAULT_FILE_NAME = "AdviceLab-Delegation-Audit.pdf";

export function buildPlanPayload() {
  const auditInputs = useDelegationStore.getState();
  const { contact, refCode } = auditInputs;

  return {
    first_name: contact.first_name.trim(),
    email: contact.email.trim().toLowerCase(),
    practice: contact.practice.trim(),
    plan_path: contact.plan_path,
    ref_code: refCode,
    ...buildAuditRequest(auditInputs),
  };
}

function fileNameFrom(res: Response) {
  return res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ?? DEFAULT_FILE_NAME;
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// export async function downloadPlanPdf() {
//   const res = await fetch(PLAN_PDF_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(buildPlanPayload()),
//   });

//   if (!res.ok) {
//     const body = await res.json().catch(() => null);
//     throw new Error(body?.message || "We couldn't create your PDF just now. Please try again.");
//   }

//   saveBlob(await res.blob(), fileNameFrom(res));
// }
