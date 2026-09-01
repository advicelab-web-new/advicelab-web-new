import { useParams, useNavigate } from "react-router-dom";
import { trackFormSubmission } from "@/lib/analytics";
import { Layout } from "@/components/layout/Layout";
import Seo from "@/components/ui/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  MapPin,
  Briefcase,
  Clock,
  ArrowLeft,
  AlertCircle,
  Upload,
  Check,
} from "lucide-react";

import { useState } from "react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import jobVacancies from "@/data/jobVacancies.json";

// particular country page submit form

const API_BASE_URL =
  "https://oxch4uog7g.execute-api.ap-southeast-2.amazonaws.com/prod";

type KeyResponsibility =
  | string
  | {
      title: string;
      items: string[];
    };

interface Job {
  id: string;
  title: string;
  location: string;
  locationType: string;
  type: string;
  category: string;
  isActive: boolean;
  aboutTheRole: string;
  whatIsParaplanning?: string;
  whatIsAdviceSupport?: string;
  keyResponsibilities: KeyResponsibility[];
  skillsWeAreLookingFor?: string[];
  mustHaves?: string[];
  skillsWeValue?: string[];
  benefits?: string[];
  programs?: string[];
  whatYouWillLearn?: {
    paraplanning?: string[];
    adviceSupport?: string[];
  };
  note?: string;
  // Structured data fields
  datePosted?: string;
  validThrough?: string;
  employmentType?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
  salaryCurrency?: string;
  salaryMin?: number;
  salaryMax?: number;
}

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const job = (jobVacancies as Job[]).find((j) => j.id === jobId && j.isActive);

  if (!job) {
    return (
      <Layout>
        <section className="py-24 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Job Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The job you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate("/careers")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

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
        // Clear error when file is uploaded
        setErrors((prev) => ({ ...prev, resume: undefined }));
      } else {
        alert("Please upload a PDF, DOC, or DOCX file");
      }
    }
  };

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
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileBlur = () => {
    setTouched((prev) => ({ ...prev, resume: true }));
    const error = validateField("resume", formData.resume);
    setErrors((prev) => ({ ...prev, resume: error }));
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

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
ADVICELAB - NEW JOB APPLICATION: ${formData.fullName}
==================================================================

Submission Date: ${submissionDate}

Applicant Details:
------------------
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}

Position Details:
-----------------
Position Applied: ${job.title}
Location: ${job.locationType}
Type: ${job.type}
Category: ${job.category}

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
            // Extract the base64 data portion
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
          subject: `🚀 Website Application: ${job.title} - ${formData.fullName}`,
          body: emailBody,
          is_html: false,
          attachments: attachmentData
            ? [
                {
                  filename: formData.resume?.name,
                  contentType: formData.resume?.type,
                  content: attachmentData,
                },
              ]
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setSubmitted(true);
      try {
        trackFormSubmission("job_application", {
          job_id: jobId,
          job_title: job.title,
          name: formData.fullName,
          email: formData.email,
        });
      } catch (err) {
        // ignore analytics errors
      }
      // Scroll to the top of the content area to show the success message
      const contentSection = document.getElementById("job-detail-content");
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setTimeout(() => {
        navigate("/careers");
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Seo
        title={`${job.title} - Apply Now | Advice Lab Careers`}
        description={`${job.title} position at Advice Lab in ${job.locationType}. ${job.aboutTheRole.substring(0, 100)}... Join our team supporting Australian financial advisers. Apply today.`}
        keywords={`${job.title}, ${job.locationType} jobs, paraplanning jobs, financial services careers, Advice Lab careers, offshore support jobs, ${job.title} position`}
        pathname={`/careers/job/${jobId}`}
        schemaData={{
          "@type": "JobPosting",
          title: job.title,
          description: job.aboutTheRole,
          url: `https://advicelab.com.au/careers/job/${jobId}`,
          datePosted: job.datePosted || new Date().toISOString().split("T")[0],
          validThrough: job.validThrough,
          employmentType: job.employmentType || "FULL_TIME",
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress: job.streetAddress,
              addressLocality: job.addressLocality || job.location,
              addressRegion: job.addressRegion,
              postalCode: job.postalCode,
              addressCountry:
                job.addressCountry ||
                (job.location.includes("Manila")
                  ? "PH"
                  : job.location.includes("Colombo")
                    ? "LK"
                    : "AU"),
            },
          },
          hiringOrganization: {
            "@type": "Organization",
            name: "Advice Lab",
            url: "https://advicelab.com.au",
          },
          baseSalary:
            job.salaryMin && job.salaryMax
              ? {
                  "@type": "MonetaryAmount",
                  currency: job.salaryCurrency || "AUD",
                  value: {
                    "@type": "QuantitativeValue",
                    minValue: job.salaryMin,
                    maxValue: job.salaryMax,
                    unitText: "MONTH",
                  },
                }
              : undefined,
        }}
      />
      {/* Hero Section */}
      <section className="py-16 gradient-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollAnimation animation="fade-up">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-primary-foreground/90">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {job.locationType}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {job.type}
              </span>
              <span className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {job.category}
              </span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Content Section */}
      <section id="job-detail-content" className="py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {submitted ? (
              <ScrollAnimation animation="fade-up">
                <div className="bg-background rounded-2xl border border-green-500/30 p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <Check className="w-16 h-16 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    Application Submitted!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Thank you for applying to {job.title}. We'll review your
                    application and get back to you soon.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting you back...
                  </p>
                </div>
              </ScrollAnimation>
            ) : (
              <>
                {/* About the Role */}
                <ScrollAnimation animation="fade-up">
                  <div className="mb-12">
                    <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
                      {/* <FileText className="w-9 h-9 text-primary" /> */}
                      About the Role
                    </h2>

                    {job.aboutTheRole?.trim() && (
                      <p className="text-lg text-muted-foreground whitespace-pre-line leading-relaxed">
                        {job.aboutTheRole}
                      </p>
                    )}
                  </div>
                </ScrollAnimation>

                {/* Available Programs */}
                {job.programs?.length > 0 && (
                  <ScrollAnimation animation="fade-up" delay={250}>
                    <div className="mb-12">
                      <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
                        Available Programs
                      </h2>
                      <ul className="space-y-4">
                        {job.programs.map((item, index) => (
                          <li
                            key={`program-${index}`}
                            className="flex gap-4 text-lg text-muted-foreground"
                          >
                            <span className="text-primary font-bold flex-shrink-0 mt-1">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollAnimation>
                )}

                {/* What is Paraplanning */}
                {job.whatIsParaplanning && (
                  <ScrollAnimation animation="fade-up" delay={50}>
                    <div className="mb-12">
                      <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
                        What is Paraplanning?
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        {job.whatIsParaplanning}
                      </p>

                      {job.whatYouWillLearn?.paraplanning?.length > 0 && (
                        <>
                          <h3 className="text-2xl font-semibold mb-4">
                            Hands-On Learning Opportunities During Your
                            Paraplanning Internship
                          </h3>
                          <ul className="space-y-4">
                            {job.whatYouWillLearn.paraplanning.map(
                              (item, index) => (
                                <li
                                  key={`paraplanning-${index}`}
                                  className="flex gap-4 text-lg text-muted-foreground"
                                >
                                  <span className="text-primary font-bold flex-shrink-0 mt-1">
                                    •
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </>
                      )}
                    </div>
                  </ScrollAnimation>
                )}

                {/* What is Advice Support */}
                {job.whatIsAdviceSupport && (
                  <ScrollAnimation animation="fade-up" delay={100}>
                    <div className="mb-12">
                      <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
                        What is Advice Support?
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                        {job.whatIsAdviceSupport}
                      </p>

                      {job.whatYouWillLearn?.adviceSupport?.length > 0 && (
                        <>
                          <h3 className="text-2xl font-semibold mb-4">
                            Hands-On Learning Opportunities During Your Advice
                            Support Internship
                          </h3>
                          <ul className="space-y-4">
                            {job.whatYouWillLearn.adviceSupport.map(
                              (item, index) => (
                                <li
                                  key={`adviceSupport-${index}`}
                                  className="flex gap-4 text-lg text-muted-foreground"
                                >
                                  <span className="text-primary font-bold flex-shrink-0 mt-1">
                                    •
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </>
                      )}
                    </div>
                  </ScrollAnimation>
                )}

                {/* Key Responsibilities */}
                {job.keyResponsibilities &&
                  job.keyResponsibilities.length > 0 && (
                    <ScrollAnimation animation="fade-up" delay={100}>
                      <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
                          Key Responsibilities
                        </h2>
                        <ul className="space-y-6">
                          {job.keyResponsibilities.map((item, index) =>
                            typeof item === "string" ? (
                              <li
                                key={index}
                                className="flex gap-4 text-lg text-muted-foreground"
                              >
                                <span className="text-primary font-bold flex-shrink-0 mt-1">
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ) : (
                              <li key={index} className="space-y-3 ml-4">
                                <h3 className="text-lg font-semibold">
                                  {item.title}
                                </h3>
                                <ul className="space-y-4 pl-6">
                                  {item.items.map((subItem, subIndex) => (
                                    <li
                                      key={`${index}-${subIndex}`}
                                      className="flex gap-4 text-lg text-muted-foreground"
                                    >
                                      <span className="text-primary font-bold flex-shrink-0 mt-1">
                                        •
                                      </span>
                                      <span>{subItem}</span>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </ScrollAnimation>
                  )}

                {/* Skills We Are Looking For */}
                {job.skillsWeAreLookingFor &&
                  job.skillsWeAreLookingFor.length > 0 && (
                    <ScrollAnimation animation="fade-up" delay={100}>
                      <div className="mb-12">
                        <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
                          Skills We Are Looking For
                        </h2>
                        <ul className="space-y-4">
                          {job.skillsWeAreLookingFor.map((item, index) => (
                            <li
                              key={index}
                              className="flex gap-4 text-lg text-muted-foreground"
                            >
                              <span className="text-primary font-bold flex-shrink-0 mt-1">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </ScrollAnimation>
                  )}

                {/* Must-Haves */}
                {job.mustHaves?.length > 0 && (
                  <ScrollAnimation animation="fade-up" delay={200}>
                    <div className="mb-12">
                      <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
                        Must-Haves
                      </h2>
                      <ul className="space-y-4">
                        {job.mustHaves.map((item, index) => (
                          <li
                            key={`mustHave-${index}`}
                            className="flex gap-4 text-lg text-muted-foreground"
                          >
                            <span className="text-primary font-bold flex-shrink-0 mt-1">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollAnimation>
                )}

                {/* Skills We Value */}
                {job.skillsWeValue && job.skillsWeValue.length > 0 && (
                  <ScrollAnimation animation="fade-up" delay={300}>
                    <div className="mb-12">
                      <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
                        Skills We Value
                      </h2>
                      <ul className="space-y-4">
                        {job.skillsWeValue.map((item, index) => (
                          <li
                            key={index}
                            className="flex gap-4 text-lg text-muted-foreground"
                          >
                            <span className="text-primary font-bold flex-shrink-0 mt-1">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollAnimation>
                )}

                {/* What's in It for You */}
                {job.benefits?.length > 0 && (
                  <ScrollAnimation animation="fade-up" delay={400}>
                    <div className="mb-12">
                      <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
                        What's in It for You
                      </h2>
                      <ul className="space-y-4">
                        {job.benefits.map((item, index) => (
                          <li
                            key={`benefit-${index}`}
                            className="flex gap-4 text-lg text-muted-foreground"
                          >
                            <span className="text-primary font-bold flex-shrink-0 mt-1">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollAnimation>
                )}

                {/* Superstar Note - keep as is */}
                {/* Superstar Note */}
                {job.note && (
                  <ScrollAnimation animation="fade-up" delay={450}>
                    <div className="mb-12">
                      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 border-l-4 border-r-4 border-primary rounded-2xl px-4 py-4 overflow-hidden group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-[1.02]">
                        {/* Animated shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                        {/* Floating particles background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse delay-300"></div>

                        {/* Content */}
                        <div className="flex items-center gap-5 relative z-10">
                          {/* Animated icon */}
                          <div className="flex-shrink-0 relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                              <Sparkles className="w-6 h-6 text-primary-foreground animate-pulse" />
                            </div>
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          {/* Text content */}
                          <div className="flex-1">
                            <p className="text-lg text-foreground leading-relaxed font-medium">
                              {job.note}
                            </p>
                          </div>
                        </div>

                        {/* Decorative corner elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary/20 rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-primary/20 rounded-bl-2xl"></div>
                      </div>
                    </div>
                  </ScrollAnimation>
                )}

                {/* {job.note && (
                  <ScrollAnimation animation="fade-up" delay={450}>
                    <div className="mb-12">
                      <div className="bg-primary/10 border-l-4 border-r-4 border-primary rounded-xl px-8 py-6 hover:bg-primary/15 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <span className="text-2xl flex-shrink-0 animate-bounce">
                            <Sparkles />
                          </span>
                          <p className="text-lg text-foreground leading-relaxed">
                            {job.note}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollAnimation>
                )} */}

                {/* Application Form */}
                <ScrollAnimation animation="fade-up" delay={500}>
                  <div className="mb-12 bg-background rounded-2xl border border-border p-8">
                    <h2 className="text-4xl font-bold mb-8">
                      Apply for this Position
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                          <p className="text-sm text-red-500 mt-1">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-base font-semibold mb-2 block"
                        >
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
                          <p className="text-sm text-red-500 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-base font-semibold mb-2 block"
                        >
                          Phone *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`h-12 ${errors.phone && touched.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {errors.phone && touched.phone && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.phone}
                          </p>
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
                          placeholder="Tell us why you're a great fit for this role..."
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          rows={6}
                          className={`resize-none ${errors.coverLetter && touched.coverLetter ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {errors.coverLetter && touched.coverLetter && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.coverLetter}
                          </p>
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
                          <label
                            htmlFor="resume"
                            className="cursor-pointer block"
                          >
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
                          <p className="text-sm text-red-500 mt-1">
                            {errors.resume}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full h-12 mt-8"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Submitting..."
                          : "Apply for this Position"}
                      </Button>
                    </form>
                  </div>
                </ScrollAnimation>

                {/* Back Button */}
                <ScrollAnimation animation="fade-up" delay={600}>
                  <div className="text-center mb-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                    </Button>
                  </div>
                </ScrollAnimation>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default JobDetail;
