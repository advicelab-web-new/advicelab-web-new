import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Download, Handshake, Loader2, Mail, RotateCcw, Scale, UserPlus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import useDelegationStore from "@/store/useDelegationStore";
import type { PlanPath as Path } from "@/store/delegationAuditApi";
import { CONTACT_URL, FREE_EMAIL, PRIVACY_URL } from "./data";
// import { downloadPlanPdf } from "./downloadPlanPdf";
import { emailPlanPdf, PlanRequestError } from "./emailPlanPdf";
import { track } from "./shared";

const PATHS: [Path, string, LucideIcon][] = [
  ["hire", "Hire in-house", UserPlus],
  ["outsource", "A dedicated resource", Handshake],
  ["compare", "Not sure yet", Scale],
];

const SERVER_ERRORS: Record<string, string> = {
  work_email: "Please use your work email address. We send plans with pricing to business email addresses only.",
  email_domain: "We couldn't find that email domain. Please check your work email address.",
  missing: 'Please check your details and make sure at least one task is marked "I do this".',
};
const GENERIC_ERROR = "We couldn't send that just now. Please try again, or contact us and we'll send it by hand.";

export function PlanForm() {
  const store = useDelegationStore();
  const { first_name: name, email, practice, plan_path: path } = store.contact;
  const setName = (first_name: string) => store.setContact({ first_name });
  const setEmail = (email: string) => store.setContact({ email });
  const setPractice = (practice: string) => store.setContact({ practice });
  const setPath = (plan_path: Path) => store.setContact({ plan_path });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<{ text: string; contact?: boolean } | null>(null);
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // const handleDownload = async () => {
  //   setDownloading(true);
  //   setDownloadError(null);
  //   track("audit_plan_download", { plan_path: path });
  //   try {
  //     await downloadPlanPdf();
  //   } catch (err) {
  //     setDownloadError(err instanceof Error ? err.message : GENERIC_ERROR);
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const first = name.trim();
    const mail = email.trim().toLowerCase();
    const org = practice.trim();
    const domain = mail.split("@")[1] || "";

    if (!first || !org || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) || !consent) {
      setError({ text: "Please add your first name, a valid work email and your practice name, and tick the box so we can send the plan." });
      return;
    }
    if (FREE_EMAIL.includes(domain)) {
      setError({
        text: "Please use your work email address. We send plans with pricing to business email addresses only. If your practice doesn't have one, contact us and we'll help.",
        contact: true,
      });
      return;
    }

    setError(null);
    track("audit_plan_request", { plan_path: path });

    setSending(true);
    try {
      const j = await emailPlanPdf({ consent, website });
      store.setField({
        sent:
          j.status === "sent"
            ? `Thanks, ${first}. Your plan is on its way to ${mail}.`
            : `Thanks, ${first}. We've received your request and will email your plan to ${mail} shortly.`,
      });
    } catch (err) {
      const code = err instanceof PlanRequestError ? err.code : "";
      setError({ text: SERVER_ERRORS[code] || GENERIC_ERROR, contact: true });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="plan" className="scroll-mt-28 overflow-hidden rounded-2xl border border-primary/20 bg-primary/5">
      <div className="grid gap-2 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </span>
          <h3 className="text-xl text-foreground">Email me my personalised hand-off plan</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Your plan compares a local hire with an Advice Lab resource for each role, shows your yearly saving and
          recommends which way to go. Sent to work email addresses only.
        </p>
      </div>

      <div className="border-t border-primary/10 bg-card p-6 md:p-8">
        {store.sent ? (
          <div className="grid gap-4">
            <div role="status" className="flex items-start gap-3 rounded-xl bg-primary/10 p-4 text-sm text-foreground">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              {store.sent}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* <Button onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Preparing PDF…
                  </>
                ) : (
                  <>
                    <Download className="mr-1 h-4 w-4" />
                    Download my plan (PDF)
                  </>
                )}
              </Button> */}
              <Button
                variant="outline"
                onClick={() => {
                  setConsent(false);
                  setDownloadError(null);
                  store.setField({ sent: null });
                }}
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                Request an updated plan
              </Button>
              <span className="text-sm text-muted-foreground">
                Changed your answers? Edit them and send yourself a fresh plan.
              </span>
            </div>
            {downloadError && (
              <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                {downloadError}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="pf-name">First name</Label>
              <Input id="pf-name" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pf-email">Work email</Label>
              <Input id="pf-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="pf-practice">Practice name</Label>
              <Input id="pf-practice" autoComplete="organization" value={practice} onChange={(e) => setPractice(e.target.value)} required />
            </div>

            <fieldset className="grid gap-2 sm:col-span-2">
              <legend className="mb-2 text-sm font-medium">Which way are you leaning?</legend>
              <div className="flex flex-wrap gap-2">
                {PATHS.map(([value, label, Icon]) => (
                  <label
                    key={value}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                      path === value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary hover:text-primary",
                    )}
                  >
                    <input
                      type="radio"
                      name="plan_path"
                      value={value}
                      checked={path === value}
                      onChange={() => setPath(value)}
                      className="sr-only"
                    />
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex items-start gap-3 sm:col-span-2">
              <Checkbox id="pf-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
              <div className="grid gap-1">
                <Label htmlFor="pf-consent" className="text-sm font-medium leading-relaxed text-foreground">
                  Send me my plan <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  We send occasional related emails from Advice Lab. See our{" "}
                  <a href={PRIVACY_URL} className="text-primary underline-offset-2 hover:underline">
                    privacy policy.
                  </a>
                </p>
              </div>
            </div>

            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm sm:col-span-2">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <span>
                  {error.text}{" "}
                  {error.contact && (
                    <Link to={CONTACT_URL} className="font-medium text-primary hover:underline">
                      Contact us
                    </Link>
                  )}
                </span>
              </div>
            )}

            <div className="sm:col-span-2">
              <Button type="submit" disabled={sending} size="lg" className="w-full sm:w-auto">
                {sending ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Email me my plan"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
