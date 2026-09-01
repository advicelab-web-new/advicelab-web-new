import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { trackFormSubmission } from "@/lib/analytics";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import {
  CheckCircle,
  ArrowRight,
  FileText,
  Users,
  BarChart3,
  Home,
  Shield,
  Lock,
  Quote,
} from "lucide-react";

const API_BASE_URL =
  "https://oxch4uog7g.execute-api.ap-southeast-2.amazonaws.com/prod";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  icon: React.ReactNode;
  color: string;
  accentColor: string;
  bgColor: string;
}
import smsfAccountingImage from "@/assets/HPImg/smsf-accounting.jpeg";
import client1 from "@/assets/ClientImg/client1.webp";
import paraplanning from "@/assets/HPImg/paraplanning.jpg";
import clientSupport from "@/assets/HPImg/client-support.jpg";
import mortgageSupport from "@/assets/HPImg/mortgage-support.jpeg";
import { PricingCalculatorCTALeftSection } from "./PricingCalculatorCTALeftSection";

const serviceCards: ServiceCard[] = [
  {
    id: "paraplanning",
    title: "Paraplanning",
    description: "On-time, first-pass-ready SOAs so you can see more clients",
    image: paraplanning,
    link: "/services/paraplanning",
    icon: <FileText className="w-5 h-5" />,
    color: "text-primary",
    accentColor: "from-primary/30 to-primary/8",
    bgColor: "bg-primary/10",
  },
  {
    id: "client-support",
    title: "Client Support Services",
    description:
      "A dependable team to keep your client work moving forward - accurate, on time",
    image: clientSupport,
    link: "/services/clientsupport",
    icon: <Users className="w-5 h-5" />,
    color: "text-primary",
    accentColor: "from-primary/20 to-primary/5",
    bgColor: "bg-primary/10",
  },
  {
    id: "smsf-accounting",
    title: "SMSF & Accounting",
    description:
      "A team that works with your rhythm, keeping your workflow stress free",
    image: smsfAccountingImage,
    link: "/services/smsf-accounting",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "text-primary",
    accentColor: "from-primary/25 to-primary/10",
    bgColor: "bg-primary/10",
  },
  {
    id: "mortgage-support",
    title: "Mortgage Support",
    description:
      "Loan pack prep and follow-ups that meet lender-ready standards every time",
    image: mortgageSupport,
    link: "/services/mortgage-support",
    icon: <Home className="w-5 h-5" />,
    color: "text-primary",
    accentColor: "from-primary/15 to-primary/5",
    bgColor: "bg-primary/10",
  },
];

const ServicesInquirySection = () => {
  const { toast } = useToast();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
    companyName?: string;
  }>({});

  const [touched, setTouched] = useState<{
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
    message?: boolean;
    companyName?: boolean;
  }>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name: string, value: string): string | undefined => {
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
      case "email":
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        break;
      // case "message":
      //   if (!value.trim()) return "Message is required";
      //   break;
    }
    return undefined;
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
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

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const firstNameError = validateField("firstName", formData.firstName);
    if (firstNameError) newErrors.firstName = firstNameError;
    const lastNameError = validateField("lastName", formData.lastName);
    if (lastNameError) newErrors.lastName = lastNameError;
    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;
    const companyError = validateField("companyName", formData.companyName);
    if (companyError) newErrors.companyName = companyError;
    const messageError = validateField("message", formData.message);
    if (messageError) newErrors.message = messageError;
    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      message: true,
      companyName: true,
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

    const selectedServiceNames = selectedServices
      .map((id) => serviceCards.find((s) => s.id === id)?.title)
      .filter(Boolean);

    const emailBody = `
ADVICELAB - SERVICES INQUIRY FORM SUBMISSION
=============================================
Submission Date: ${submissionDate}
Contact Details:
First Name: ${formData.firstName}
Last Name: ${formData.lastName}
Email: ${formData.email}
Company: ${formData.companyName || "Not provided"}
Services Interested In:
----------------------------------------
${
  selectedServiceNames.length > 0
    ? selectedServiceNames.map((se, i) => `${i + 1}. ${se}`).join("\n")
    : "None selected"
}
 ----------------------------------------
Message: ${formData.message}
---
This inquiry was submitted through the AdviceLab Services page.
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
          subject: `New Services Inquiry: ${formData.firstName} ${formData.lastName}`,
          body: emailBody,
          is_html: false,
          attachments: [],
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setSubmitted(true);
      try {
        trackFormSubmission("services_inquiry_form", {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          company: formData.companyName,
          services: selectedServiceNames,
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

  const inputClass = (hasError: boolean) =>
    `bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200 ${
      hasError
        ? "border-red-400 focus-visible:ring-red-400 bg-red-50"
        : "focus:border-primary focus-visible:ring-primary/30"
    }`;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Left Side ── */}
          <ScrollAnimation animation="fade-right">
            <div className="space-y-6">
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
                  Our Services
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Explore Our Services
                </h2>
                <p className="text-muted-foreground">
                  Click on any service card to learn more about how we can help
                  your practice grow.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {serviceCards.map((service, index) => (
                  <ScrollAnimation
                    key={service.id}
                    animation="fade-up"
                    delay={index * 100}
                  >
                    <Link
                      to={service.link}
                      className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-primary/15 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]"
                    >
                      {/* <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                        <div className="p-5 flex flex-col flex-1">
                        
                        <div className="flex items-center gap-2.5 mb-3">
                          <span className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shrink-0 text-white group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                            {service.icon}
                          </span>
                          <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors leading-tight">
                            {service.title}
                          </h3>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                          {service.description}
                        </p>

                        <div className="mt-4 flex items-center text-primary text-sm font-semibold">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      
                      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500 gradient-primary" />
                     */}

                      {/* Curved gradient top band — unique per card */}
                      <div
                        className={`relative h-28 bg-gradient-to-br ${service.accentColor} flex items-center justify-start gap-3 px-4 pl-5 overflow-hidden`}
                      >
                        {/* decorative blurred circle */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20 blur-lg" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/15 blur-md" />

                        {/* Icon badge */}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-xl gradient-primary flex flex-col items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                        >
                          {service.icon}
                        </div>
                        <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300 leading-snug mb-1.5 text-center">
                          {service.title}
                        </h3>
                      </div>

                      {/* Content */}
                      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
                        {/* Title */}
                        {/* <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300 leading-snug mb-1.5 text-center">
                          {service.title}
                        </h3> */}

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed text-center">
                          {service.description}
                        </p>

                        {/* Learn More */}
                        <div
                          aria-label={`Learn more about ${service.title}`}
                          className="mt-4 flex items-center justify-center gap-1.5 text-primary text-xs font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          Learn More
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                        </div>
                      </div>

                      {/* Bottom accent bar */}
                      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500 gradient-primary" />
                    </Link>
                  </ScrollAnimation>
                ))}
              </div>
            </div>

            <section id="left-calculator-cta">
              <PricingCalculatorCTALeftSection />
            </section>
          </ScrollAnimation>

          {/* ── Right Side ── */}
          <ScrollAnimation animation="fade-left" delay={200}>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 20px 60px -10px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
              }}
            >
              {/* Gradient header */}
              <div className="gradient-primary px-6 md:px-8 py-7 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/10 rounded-full" />
                <div className="absolute top-3 right-14 w-10 h-10 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -left-6 w-24 h-24 bg-white/8 rounded-full" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-4 border border-white/30">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    We're here for you
                  </span>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2 leading-tight">
                    Still unsure outsourcing your back-office would work out the
                    way you want?
                  </h2>
                </div>
              </div>

              {/* White body overlapping header with rounded top */}
              <div className="bg-white rounded-t-2xl -mt-4 relative z-10 px-6 md:px-8 pt-6 pb-7">
                {submitted ? (
                  <div className="min-h-[400px] flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Inquiry Sent!</h3>
                    <p className="text-muted-foreground max-w-md">
                      Thank you for your interest. Our team will get back to you
                      shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Service Checkboxes */}
                    <div>
                      <p className="text-sm text-foreground font-semibold">
                        We know that your practice back-office needs are unique.
                        So we want to help you to give the support your practice
                        deserves, just let us know and we'll take you on a quick
                        walkthrough.
                      </p>
                      <br />
                      <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
                        Services you're interested in
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {serviceCards.map((service) => {
                          const checked = selectedServices.includes(service.id);
                          return (
                            <label
                              key={service.id}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                checked
                                  ? "border-primary bg-primary/8 shadow-sm scale-[1.02]"
                                  : "border-gray-150 bg-white hover:border-primary/30 hover:bg-primary/3 hover:shadow-sm"
                              }`}
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={() =>
                                  handleServiceToggle(service.id)
                                }
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0"
                              />
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`${checked ? service.color : "text-gray-400"} transition-colors`}
                                >
                                  {service.icon}
                                </span>
                                <span
                                  className={`text-xs font-semibold transition-colors ${
                                    checked ? "text-primary" : "text-gray-600"
                                  }`}
                                >
                                  {service.title}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Labeled divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Your Details
                      </span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Name Fields */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Your first name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={inputClass(
                            !!(errors.firstName && touched.firstName),
                          )}
                        />
                        {errors.firstName && touched.firstName && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Your last name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={inputClass(
                            !!(errors.lastName && touched.lastName),
                          )}
                        />
                        {errors.lastName && touched.lastName && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email & Company */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="Your email address"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={inputClass(
                            !!(errors.email && touched.email),
                          )}
                        />
                        {errors.email && touched.email && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Your company"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={inputClass(
                            !!(errors.companyName && touched.companyName),
                          )}
                        />{" "}
                        {errors.companyName && touched.companyName && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.companyName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Message
                      </label>
                      <Textarea
                        placeholder="Tell us about your practice and what you're looking for..."
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={inputClass(
                          !!(errors.message && touched.message),
                        )}
                      />
                      {errors.message && touched.message && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Privacy notice */}
                    <div className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/80 rounded-xl px-4 py-3.5">
                      <div className="mt-0.5 shrink-0 w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-primary" />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Your email will be used by Advice Lab to keep you posted
                        with the latest news, insights and tips. You can
                        unsubscribe from these emails at any time.{" "}
                        <a
                          href="/pdf/AL_Privacy-policy.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          Privacy Policy
                        </a>
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full group relative overflow-hidden gradient-primary border-0 text-white font-bold hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 py-6 text-base"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending your inquiry...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Submit
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Testimonial Section */}
            <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border backdrop-blur-sm relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Decorative Quote Icon */}
              <div className="absolute top-3 right-3 text-primary/10">
                <Quote size={40} fill="currentColor" />
              </div>

              {/* Quote */}
              <p className="text-foreground text-base mb-6 leading-relaxed relative z-10 pr-10">
                "Ever since we've partnered with Advice Lab, we've never looked
                back."
              </p>

              {/* Author Info with Image */}
              <div className="flex items-center gap-4 relative z-10">
                {/* Profile Image */}
                <img
                  src={client1}
                  alt="Louella Jorge"
                  className="w-14 h-14 rounded-full object-cover shadow-lg flex-shrink-0 ring-2 ring-primary/20"
                />

                {/* Author Details */}
                <div>
                  <p className="font-semibold text-foreground text-base">
                    Louella Jorge
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Principal Adviser - Discovery Wealth Advisers
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default ServicesInquirySection;
