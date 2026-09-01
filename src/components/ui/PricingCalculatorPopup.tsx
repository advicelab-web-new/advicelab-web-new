import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, X } from "lucide-react";
import { trackFormSubmission } from "@/lib/analytics";

const API_BASE_URL =
  "https://oxch4uog7g.execute-api.ap-southeast-2.amazonaws.com/prod";

const soaOptions = [
  { value: "1-5", label: "1-5" },
  { value: "6-10", label: "6-10" },
  { value: "11-20", label: "11-20" },
];

interface PricingCalculatorPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PricingCalculatorPopup({
  open,
  onOpenChange,
  onSuccess,
}: PricingCalculatorPopupProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    dealerGroup: "",
    workEmail: "",
    soasPerMonth: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    companyName?: string;
    dealerGroup?: string;
    workEmail?: string;
    soasPerMonth?: string;
  }>({});

  const [variant, setVariant] = useState<"A" | "B">("A");

  useEffect(() => {
    const randomVariants = Math.random() < 0.5 ? "A" : "B";
    setVariant(randomVariants);
  }, []);

  const [touched, setTouched] = useState<{
    firstName?: boolean;
    lastName?: boolean;
    companyName?: boolean;
    dealerGroup?: boolean;
    workEmail?: boolean;
    soasPerMonth?: boolean;
  }>({});

  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onOpenChange(false);
    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        dealerGroup: "",
        workEmail: "",
        soasPerMonth: "",
      });
      setSubmitted(false);
      setErrors({});
      setTouched({});
    }, 200);
  }, [onOpenChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name: string, value: string): string | undefined => {
    const personalProviders = [
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
        if (variant === "A" && !value.trim()) return "Dealer group is required";
        break;
      case "workEmail": {
        if (!value.trim()) return "Work or Company email is required";
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        const domain = value.split("@")[1]?.toLowerCase();
        if (domain && personalProviders.includes(domain)) {
          return "Please use your company email (not Gmail/Yahoo/Outlook, etc.)";
        }
        break;
      }
      case "soasPerMonth":
        if (variant === "A" && !value.trim()) return "Please select an option";
        break;
    }
    return undefined;
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSoasChange = (value: string) => {
    setFormData((prev) => ({ ...prev, soasPerMonth: value }));
    setTouched((prev) => ({ ...prev, soasPerMonth: true }));
    const error = validateField("soasPerMonth", value);
    setErrors((prev) => ({ ...prev, soasPerMonth: error }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const firstNameError = validateField("firstName", formData.firstName);
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateField("lastName", formData.lastName);
    if (lastNameError) newErrors.lastName = lastNameError;

    const companyError = validateField("companyName", formData.companyName);
    if (companyError) newErrors.companyName = companyError;

    const dealerGroupError = validateField("dealerGroup", formData.dealerGroup);
    if (dealerGroupError) newErrors.dealerGroup = dealerGroupError;

    const emailError = validateField("workEmail", formData.workEmail);
    if (emailError) newErrors.workEmail = emailError;

    const soasError = validateField("soasPerMonth", formData.soasPerMonth);
    if (soasError) newErrors.soasPerMonth = soasError;

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      companyName: true,
      dealerGroup: true,
      workEmail: true,
      soasPerMonth: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Save email/company locally so the pricing page can email the PDF quote
    // Note: Using localStorage for pricing page to access email/company
    // The form submission status is tracked via React state (usePricingCalculator)
    try {
      localStorage.setItem("pricingCalculatorEmail", formData.workEmail);
      localStorage.setItem("pricingCalculatorCompany", formData.companyName);
      localStorage.setItem("pricingCalculatorFirstName", formData.firstName);
    } catch {
      // ignore if storage is unavailable
    }

    setLoading(true);

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

    const emailBody = `
ADVICE LAB - PRICING CALCULATOR LEAD
=========================================

A/B Test Variant:
-----------------
Variant: ${variant}

Contact Details:
----------------
First Name: ${formData.firstName}
Last Name: ${formData.lastName}
Company: ${formData.companyName}
Dealer Group: ${formData.dealerGroup}
Work Email: ${formData.workEmail}
SOAs / Month: ${formData.soasPerMonth}

Submission Details:
-------------------
Date: ${submissionDate}
Timezone: ${userTimeZone}

---
This inquiry was submitted through the Pricing Calculator popup form.
`;

    try {
      const response = await fetch(`${API_BASE_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "x-api-key": "n4wSKrdsls7LO2vpHj78Qa9sR28ozfxS4qcCK9fL",
        },
        body: JSON.stringify({
          sender: "noreply@advicelab.com.au",
          recipient: "hello@advicelab.com.au",
          subject: `🅰️🅱️ - Pricing Calculator Lead: ${formData.firstName} ${formData.lastName}`,
          body: emailBody,
          is_html: false,
          attachments: [],
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      // Persist the user's email (and company name) so the calculator can email a PDF quote
      // Note: Using localStorage for pricing page to access email/company
      try {
        localStorage.setItem("pricingCalculatorEmail", formData.workEmail);
        localStorage.setItem("pricingCalculatorCompany", formData.companyName);
      } catch {
        // ignore if storage is unavailable
      }

      setSubmitted(true);
      try {
        trackFormSubmission("pricing_calculator_lead", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          dealerGroup: formData.dealerGroup,
          workEmail: formData.workEmail,
          soasPerMonth: formData.soasPerMonth,
        });
      } catch {
        // swallow analytics errors
      }

      // Give a short moment to show the confirmation before redirecting
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 800);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send details. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  if (!open) return null;

  const fieldCls = (hasError: boolean) =>
    `h-10 rounded-lg border bg-muted/40 px-3 text-sm transition-colors
     focus-visible:bg-background focus-visible:ring-2
     placeholder:text-muted-foreground/50
     ${
       hasError
         ? "border-red-400 focus-visible:ring-red-300"
         : "border-border focus-visible:ring-primary/30 hover:border-primary/40"
     }`;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(2px)",
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="pricing-calculator-popup-title"
    >
      <div
        className="relative w-full max-w-[520px] bg-background rounded-2xl shadow-2xl ring-1 ring-border/60 flex flex-col"
        style={{ maxHeight: "95dvh" }}
      >
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto flex-1 px-7 py-6">
          <div className="pb-5 text-center space-y-2">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold uppercase tracking-widest text-[11px] rounded-full">
              Pricing Calculator
            </span>
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
              Instant pricing starts here
            </h2>
            <p className="text-sm text-muted-foreground max-w-[28rem] mx-auto leading-relaxed">
              Tell us a bit about your practice and we’ll send a tailored quote
              straight to your inbox in seconds.
            </p>
          </div>

          <div className="h-px bg-border/60 mb-5" />

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All set!</h3>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Thanks for the details. We’re redirecting you to the pricing
                calculator now.
              </p>
              <Button
                onClick={handleClose}
                className="mt-6 gradient-primary text-primary-foreground px-8"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldCls(
                      !!(errors.firstName && touched.firstName),
                    )}
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="text-[11px] text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldCls(
                      !!(errors.lastName && touched.lastName),
                    )}
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="text-[11px] text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Company name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldCls(
                      !!(errors.companyName && touched.companyName),
                    )}
                  />
                  {errors.companyName && touched.companyName && (
                    <p className="text-[11px] text-red-500">
                      {errors.companyName}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Dealer Group{" "}
                    {variant === "A" && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    placeholder="Dealer group"
                    name="dealerGroup"
                    value={formData.dealerGroup}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldCls(
                      !!(errors.dealerGroup && touched.dealerGroup),
                    )}
                  />
                  {errors.dealerGroup && touched.dealerGroup && (
                    <p className="text-[11px] text-red-500">
                      {errors.dealerGroup}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Work Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="Work email"
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldCls(
                      !!(errors.workEmail && touched.workEmail),
                    )}
                  />

                  {errors.workEmail && touched.workEmail && (
                    <p className="text-[11px] text-red-500">
                      {errors.workEmail}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    SOAs / Month{" "}
                    {variant === "A" && <span className="text-red-500">*</span>}
                  </label>
                  <Select
                    value={formData.soasPerMonth}
                    onValueChange={handleSoasChange}
                  >
                    <SelectTrigger className={fieldCls(!!errors.soasPerMonth)}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {soaOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.soasPerMonth && touched.soasPerMonth && (
                    <p className="text-[11px] text-red-500">
                      {errors.soasPerMonth}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity h-10 rounded-lg text-sm tracking-wide"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  "Get Pricing"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
