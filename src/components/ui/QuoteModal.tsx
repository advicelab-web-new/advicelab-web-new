import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Send, X } from "lucide-react";
import { trackFormSubmission } from "@/lib/analytics";

const API_BASE_URL =
  "https://oxch4uog7g.execute-api.ap-southeast-2.amazonaws.com/prod";

const soaOptions = [
  { value: "1-5", label: "1-5" },
  { value: "6-10", label: "6-10" },
  { value: "11-20", label: "11-20" },
];

const PERSONAL_EMAIL_PROVIDERS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "me.com",
  "gmx.com",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (details: {
    firstName: string;
    lastName: string;
    companyName: string;
    dealerGroup: string;
    recipientEmail: string;
    soasPerMonth: string;
  }) => void;
  isLoading: boolean;
}

type FormFields = {
  firstName: string;
  lastName: string;
  companyName: string;
  dealerGroup: string;
  recipientEmail: string;
  soasPerMonth: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;
type FormTouched = Partial<Record<keyof FormFields, boolean>>;

export function QuoteModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: QuoteModalProps) {
  const [form, setForm] = useState<FormFields>({
    firstName: "",
    lastName: "",
    companyName: "",
    dealerGroup: "",
    recipientEmail: "",
    soasPerMonth: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  // ── A/B variant (mirrors PricingCalculatorPopup logic) ────────────────────
  const [variant, setVariant] = useState<"A" | "B">("A");

  useEffect(() => {
    setVariant(Math.random() < 0.5 ? "A" : "B");
  }, []);

  if (!open) return null;

  // ── Validation ────────────────────────────────────────────────────────────
  const validateField = (
    name: keyof FormFields,
    value: string,
  ): string | undefined => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        break;
      case "lastName":
        if (!value.trim()) return "Last name is required";
        break;
      case "companyName":
        if (!value.trim()) return "Company name is required";
        break;
      case "dealerGroup":
        // Only required in variant A (matches PricingCalculatorPopup)
        if (variant === "A" && !value.trim()) return "Dealer group is required";
        break;
      case "recipientEmail": {
        if (!value.trim()) return "Work email is required";
        if (!EMAIL_REGEX.test(value))
          return "Please enter a valid email address";
        const domain = value.split("@")[1]?.toLowerCase();
        if (domain && PERSONAL_EMAIL_PROVIDERS.includes(domain))
          return "Please use your company email (not Gmail/Yahoo/Outlook, etc.)";
        break;
      }
      case "soasPerMonth":
        // Only required in variant A (matches PricingCalculatorPopup)
        if (variant === "A" && !value.trim()) return "Please select an option";
        break;
    }
    return undefined;
  };

  const handleChange = (name: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (name: keyof FormFields) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, form[name]) }));
  };

  const validateAll = (): boolean => {
    const allTouched: FormTouched = {
      firstName: true,
      lastName: true,
      companyName: true,
      dealerGroup: true,
      recipientEmail: true,
      soasPerMonth: true,
    };
    const newErrors: FormErrors = {};
    (Object.keys(form) as (keyof FormFields)[]).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setTouched(allTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit: persist locally, send lead email, fire analytics, then delegate
  const handleSubmit = async () => {
    if (!validateAll()) return;

    // Persist for the pricing page PDF flow
    try {
      localStorage.setItem("pricingCalculatorEmail", form.recipientEmail);
      localStorage.setItem("pricingCalculatorCompany", form.companyName);
      localStorage.setItem("pricingCalculatorFirstName", form.firstName);
    } catch {
      // ignore if storage is unavailable
    }

    // Fire analytics (non-blocking, swallow errors)
    try {
      trackFormSubmission("pricing_calculator_quote_modal", {
        firstName: form.firstName,
        lastName: form.lastName,
        companyName: form.companyName,
        dealerGroup: form.dealerGroup,
        workEmail: form.recipientEmail,
        soasPerMonth: form.soasPerMonth,
      });
    } catch {
      // swallow analytics errors
    }

    // Send lead notification email (non-blocking)
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const submissionDate = new Date().toLocaleString("en-AU", {
      timeZone: userTimeZone,
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const leadEmailBody = `
ADVICE LAB - PRICING CALCULATOR LEAD
=========================================

A/B Test Variant:
-----------------
Variant: ${variant}

Contact Details:
----------------
First Name: ${form.firstName}
Last Name: ${form.lastName}
Company: ${form.companyName}
Dealer Group: ${form.dealerGroup}
Work Email: ${form.recipientEmail}
SOAs / Month: ${form.soasPerMonth}

Submission Details:
-------------------
Date: ${submissionDate}
Timezone: ${userTimeZone}

---
This inquiry was submitted through the Pricing Calculator quote modal.
`;

    // Non-blocking — don't await or surface errors to the user here;
    // the real quote email is handled by the parent (PricingCalculator).
    fetch(`${API_BASE_URL}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: "noreply@advicelab.com.au",
        recipient: "rasanjali@advicelab.com.au",
        subject: `🅰️🅱️ - Pricing Calculator Lead: ${form.firstName} ${form.lastName} (Variant ${variant})`,
        body: leadEmailBody,
        is_html: false,
        attachments: [],
      }),
    }).catch(() => {
      // silently ignore — lead email failure must not block the quote flow
    });

    // Delegate to parent for PDF generation + client email
    onSubmit({
      firstName: form.firstName,
      lastName: form.lastName,
      companyName: form.companyName,
      dealerGroup: form.dealerGroup,
      recipientEmail: form.recipientEmail,
      soasPerMonth: form.soasPerMonth,
    });
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fieldCls = (name: keyof FormFields) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
      errors[name] && touched[name]
        ? "border-red-400 focus:ring-red-300"
        : "border-border focus:ring-primary/30 hover:border-primary/40"
    }`;

  const ErrorMsg = ({ field }: { field: keyof FormFields }) =>
    errors[field] && touched[field] ? (
      <p className="text-[11px] text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-border flex flex-col"
        style={{ maxHeight: "95dvh" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Send Your Quote
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your details and we'll email the PDF quote directly to you.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1 rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-4">
          {/* Row 1: First Name + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                First Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                onBlur={() => handleBlur("firstName")}
                placeholder="First name"
                className={fieldCls("firstName")}
              />
              <ErrorMsg field="firstName" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Last Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                onBlur={() => handleBlur("lastName")}
                placeholder="Last name"
                className={fieldCls("lastName")}
              />
              <ErrorMsg field="lastName" />
            </div>
          </div>

          {/* Row 2: Company + Dealer Group */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Company Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                onBlur={() => handleBlur("companyName")}
                placeholder="Company name"
                className={fieldCls("companyName")}
              />
              <ErrorMsg field="companyName" />
            </div>
            <div>
              {/* Label shows * only in variant A */}
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Dealer Group{" "}
                {variant === "A" && <span className="text-destructive">*</span>}
              </label>
              <input
                type="text"
                value={form.dealerGroup}
                onChange={(e) => handleChange("dealerGroup", e.target.value)}
                onBlur={() => handleBlur("dealerGroup")}
                placeholder="Dealer group"
                className={fieldCls("dealerGroup")}
              />
              <ErrorMsg field="dealerGroup" />
            </div>
          </div>

          {/* Row 3: Work Email + SOAs/Month */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Work Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={form.recipientEmail}
                onChange={(e) => handleChange("recipientEmail", e.target.value)}
                onBlur={() => handleBlur("recipientEmail")}
                placeholder="you@company.com"
                className={fieldCls("recipientEmail")}
              />
              <ErrorMsg field="recipientEmail" />
            </div>
            <div>
              {/* Label shows * only in variant A */}
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                SOAs / Month{" "}
                {variant === "A" && <span className="text-destructive">*</span>}
              </label>
              <select
                value={form.soasPerMonth}
                onChange={(e) => handleChange("soasPerMonth", e.target.value)}
                onBlur={() => handleBlur("soasPerMonth")}
                className={fieldCls("soasPerMonth")}
              >
                <option value="" disabled>
                  Select
                </option>
                {soaOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ErrorMsg field="soasPerMonth" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 gradient-primary text-primary-foreground font-semibold"
            >
              {isLoading ? (
                <>
                  <Mail className="w-4 h-4 mr-2 animate-pulse" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Quote
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
