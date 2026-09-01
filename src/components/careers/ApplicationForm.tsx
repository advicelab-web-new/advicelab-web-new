import { useState } from "react";
import { trackFormSubmission } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";

// careers page submit resume

const API_BASE_URL =
  "https://oxch4uog7g.execute-api.ap-southeast-2.amazonaws.com/prod";

interface ApplicationFormProps {
  jobTitle: string;
  jobId: string;
  onClose: () => void;
}

export const ApplicationForm = ({
  jobTitle,
  jobId,
  onClose,
}: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    coverLetter?: string;
    resume?: string;
  }>({});

  const [touched, setTouched] = useState<{
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
    coverLetter?: boolean;
    resume?: boolean;
  }>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (
    name: string,
    value: string | File | null,
  ): string | undefined => {
    const stringValue = typeof value === "string" ? value : "";

    switch (name) {
      case "fullName":
        if (!stringValue.trim()) {
          return "Full Name is required";
        }
        break;
      case "email":
        if (!stringValue.trim()) {
          return "Email is required";
        }
        if (!emailRegex.test(stringValue)) {
          return "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!stringValue.trim()) {
          return "Phone number is required";
        }
        if (!/^\d+$/.test(stringValue)) {
          return "Phone number must contain numbers only";
        }

        break;
      case "coverLetter":
        if (!stringValue.trim()) {
          return "Cover Letter is required";
        }
        break;
      case "resume":
        if (!value) {
          return "Resume/CV is required";
        }
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

  const handleFileBlur = () => {
    setTouched((prev) => ({ ...prev, resume: true }));
    const error = validateField("resume", formData.resume);
    setErrors((prev) => ({ ...prev, resume: error }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (allowedTypes.includes(file.type)) {
        setFormData((prev) => ({
          ...prev,
          resume: file,
        }));
        setFileName(file.name);
      } else {
        alert("Please upload a PDF, DOC, or DOCX file");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (allowedTypes.includes(file.type)) {
        setFormData((prev) => ({
          ...prev,
          resume: file,
        }));
        setFileName(file.name);
        // Clear error when file is uploaded
        setErrors((prev) => ({ ...prev, resume: undefined }));
      } else {
        alert("Please upload a PDF, DOC, or DOCX file");
        e.target.value = "";
      }
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const fullNameError = validateField("fullName", formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validateField("phone", formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const coverLetterError = validateField("coverLetter", formData.coverLetter);
    if (coverLetterError) newErrors.coverLetter = coverLetterError;

    const resumeError = validateField("resume", formData.resume);
    if (resumeError) newErrors.resume = resumeError;

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      coverLetter: true,
      resume: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Get current date and time for email body
    const submissionDate = new Date().toLocaleString("en-AU", {
      timeZone: userTimeZone,
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    try {
      // Create a plain text email body for the resume submission
      const emailBody = `
ADVICELAB - NEW JOB APPLICATION - ${formData.fullName}
==================================================================

Submission Date: ${submissionDate}

Applicant Details:
------------------
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}

Position Details:
-----------------
Position Applied: ${jobTitle}

Cover Letter:
-------------
${formData.coverLetter}

Resume Attached:
----------------
${formData.resume?.name || "No file attached"}

---
This application was submitted through the AdviceLab Careers page.
      `;

      // Convert resume file to base64 for attachment
      let attachmentData = null;
      if (formData.resume) {
        const reader = new FileReader();
        attachmentData = await new Promise<string | null>((resolve) => {
          reader.onload = () => {
            const base64String = reader.result as string;
            // Extract the base64 data portion (remove data:application/pdf;base64, prefix)
            const base64Data = base64String.split(",")[1] || base64String;
            resolve(base64Data);
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(formData.resume!);
        });
      }

      // Send the email with attachment via the API
      const response = await fetch(`${API_BASE_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "x-api-key": "n4wSKrdsls7LO2vpHj78Qa9sR28ozfxS4qcCK9fL",
        },
        body: JSON.stringify({
          sender: "noreply@advicelab.com.au",
          recipient: "hello@advicelab.com.au",
          // sender: formData.email,

          subject: `🚀 Website Application: New Job Application: ${jobTitle} - ${formData.fullName}`,
          body: emailBody,
          is_html: false,
          attachments: attachmentData
            ? [
                {
                  filename: formData.resume?.name,
                  content: attachmentData,
                  content_type: formData.resume?.type,
                },
              ]
            : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setSubmitted(true);
      try {
        trackFormSubmission("job_application", {
          job_id: jobId,
          job_title: jobTitle,
          name: formData.fullName,
          email: formData.email,
        });
      } catch (err) {
        // ignore analytics errors
      }
      // Scroll to the top of the form content area to show the success message
      setTimeout(() => {
        const contentSection =
          document.getElementById("submit-resume-content") ||
          document.getElementById("job-detail-content") ||
          document.querySelector('section[class*="bg-secondary"]');
        if (contentSection) {
          contentSection.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-3xl font-bold mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground max-w-md">
          Thank you for applying for the {jobTitle} position. We'll review your
          application and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-4xl font-bold mb-8">Apply for this position</h3>
        <p className="text-lg text-muted-foreground mb-6">{jobTitle}</p>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <Label
            htmlFor="fullName"
            className="text-base font-semibold mb-2 block"
          >
            Full Name *
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`h-12 ${errors.fullName && touched.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.fullName && touched.fullName && (
            <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-base font-semibold mb-2 block">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your email address"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`h-12 ${errors.email && touched.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.email && touched.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-base font-semibold mb-2 block">
            Phone *
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`h-12 ${errors.phone && touched.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.phone && touched.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <Label
            htmlFor="coverLetter"
            className="text-base font-semibold mb-2 block"
          >
            Cover Letter *
          </Label>
          <Textarea
            id="coverLetter"
            name="coverLetter"
            placeholder="Tell us why you're interested in this position and what makes you a great fit for the role..."
            value={formData.coverLetter}
            onChange={handleInputChange}
            onBlur={handleBlur}
            rows={6}
            className={`resize-none ${errors.coverLetter && touched.coverLetter ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          />
          {errors.coverLetter && touched.coverLetter && (
            <p className="text-sm text-red-500 mt-1">{errors.coverLetter}</p>
          )}
        </div>

        {/* Resume Upload */}
        <div>
          <Label
            htmlFor="resume"
            className="text-base font-semibold mb-2 block"
          >
            Upload CV/Resume *
          </Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : errors.resume && touched.resume
                  ? "border-red-500 bg-red-50"
                  : "hover:border-primary/50 border-border"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onBlur={handleFileBlur}
          >
            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="resume" className="cursor-pointer block">
              <div className="flex justify-center mb-2">
                <Upload
                  className={`w-8 h-8 ${errors.resume && touched.resume ? "text-red-500" : "text-muted-foreground"}`}
                />
              </div>
              {formData.resume ? (
                <div>
                  <p className="font-semibold text-primary">
                    {formData.resume.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click to change file
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOC or DOCX (max. 5MB)
                  </p>
                </div>
              )}
            </label>
          </div>
          {errors.resume && touched.resume && (
            <p className="text-sm text-red-500 mt-1">{errors.resume}</p>
          )}
        </div>

        {/* Agreement */}
        <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
          <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <label className="flex items-start gap-2 cursor-pointer flex-1">
            <input type="checkbox" required className="mt-1 accent-primary" />
            <span className="text-sm text-muted-foreground">
              By using this form you agree with the storage and handling of your
              data by this website. <span className="text-red-500">*</span>
            </span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 h-12"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1 h-12" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
};
