import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, X } from "lucide-react";
import { trackFormSubmission } from "@/lib/analytics";

const API_BASE_URL =
  "https://oxch4uog7g.execute-api.ap-southeast-2.amazonaws.com/prod";

const serviceOptions = [
  { id: "paraplanning", label: "Paraplanning Services" },
  { id: "client-support", label: "Client Support Services" },
  { id: "smsf-accounting", label: "SMSF & Accounting Services" },
  { id: "mortgage-support", label: "Mortgage Support Services" },
];

interface ContactPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function ContactPopup({
  open,
  onOpenChange,
  title = "Get in Touch",
  description = "Ready to scale your practice? Let's discuss how we can help.",
}: ContactPopupProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    interests: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
    company?: string;
    interests?: string;
  }>({});

  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    message?: boolean;
    company?: boolean;
  }>({});

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

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
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        break;
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^\d+$/.test(value))
          return "Phone number must contain numbers only";
        break;
      case "company":
        if (!value.trim()) return "Company is required";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interestId]
        : prev.interests.filter((id) => id !== interestId),
    }));
    if (checked) {
      setErrors((prev) => ({ ...prev, interests: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const nameError = validateField("name", formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validateField("phone", formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const companyError = validateField("company", formData.company);
    if (companyError) newErrors.company = companyError;

    if (formData.interests.length === 0) {
      newErrors.interests = "Please select at least one service";
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      message: true,
      phone: true,
      company: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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

    const selectedServices = formData.interests
      .map((id) => serviceOptions.find((opt) => opt.id === id)?.label)
      .filter(Boolean);

    const emailBody = `
ADVICELAB - NEW PRODUCT INTEREST LEAD
=========================================

A user has expressed interest in the following services:

Interested Services:
----------------------------------------
${
  selectedServices.length > 0
    ? selectedServices
        .map((service, index) => `${index + 1}. ${service}`)
        .join("\n")
    : "None selected"
}
----------------------------------------

Contact Details:
----------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Company: ${formData.company || "Not provided"}

Message:
--------
${formData.message}

Submission Details:
-------------------
Date: ${submissionDate}
Timezone: ${userTimeZone}

---
This inquiry was submitted through the AdviceLab Popup Form.
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
          subject: `New Services Inquiry: ${formData.name}`,
          body: emailBody,
          is_html: false,
          attachments: [],
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setSubmitted(true);
      try {
        trackFormSubmission("contact_popup_form", {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          interests: formData.interests,
        });
      } catch (err) {
        // swallow analytics errors
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
        interests: [],
      });
      setSubmitted(false);
      setErrors({});
      setTouched({});
    }, 200);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  if (!open) return null;

  /* ─────────────── small helpers for field styling ─────────────── */
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
    /* Backdrop */
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
      aria-labelledby="contact-popup-title"
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-[520px] bg-background rounded-2xl shadow-2xl ring-1 ring-border/60 flex flex-col"
        style={{ maxHeight: "95dvh" }}
      >
        {/* Decorative top accent bar */}

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-7 py-6">
          {/* Header */}
          <div className="pb-5 text-center space-y-2">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold uppercase tracking-widest text-[11px] rounded-full">
              {title}
            </span>
            <p className="text-sm font-semibold text-foreground leading-snug">
              {description}
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/60 mb-5" />

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Thank you for your interest in{" "}
                <span className="font-semibold text-primary">Advice Lab</span>.
                We've received your enquiry and a member of our team will
                contact you shortly.
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
              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldCls(!!(errors.name && touched.name))}
                  />
                  {errors.name && touched.name && (
                    <p className="text-[11px] text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="Your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldCls(!!(errors.email && touched.email))}
                  />
                  {errors.email && touched.email && (
                    <p className="text-[11px] text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Company and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="company"
                    placeholder="Your company"
                    value={formData.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldCls(!!(errors.company && touched.company))}
                  />
                  {errors.company && touched.company && (
                    <p className="text-[11px] text-red-500">{errors.company}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldCls(!!(errors.phone && touched.phone))}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-[11px] text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Service interests */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Interested in <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 rounded-xl border border-border/60 bg-muted/30 p-4">
                  {serviceOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2.5"
                    >
                      <Checkbox
                        id={option.id}
                        checked={formData.interests.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleInterestChange(option.id, checked as boolean)
                        }
                        className="h-4 w-4 shrink-0 rounded"
                      />
                      <label
                        htmlFor={option.id}
                        className="text-sm cursor-pointer leading-snug text-foreground/80 hover:text-foreground transition-colors"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.interests && (
                  <p className="text-[11px] text-red-500">{errors.interests}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Message
                </label>
                <Textarea
                  placeholder="Tell us about your needs..."
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`resize-none rounded-lg border bg-muted/40 px-3 py-2.5 text-sm
                    transition-colors placeholder:text-muted-foreground/50
                    focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/30
                    hover:border-primary/40
                    ${errors.message && touched.message ? "border-red-400" : "border-border"}
                  `}
                />
                {errors.message && touched.message && (
                  <p className="text-[11px] text-red-500">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-primary-foreground font-semibold
                  hover:opacity-90 transition-opacity h-10 rounded-lg text-sm tracking-wide"
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
                  "Send Message"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
