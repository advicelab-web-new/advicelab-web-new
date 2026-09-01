import Seo from "@/components/ui/Seo";
import { trackFormSubmission } from "@/lib/analytics";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";

const API_BASE_URL =
  "https://m5nx3mij5l.execute-api.ap-southeast-2.amazonaws.com/prod";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@advicelab.com.au",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+61 2 8074 0884",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "368 Sussex St, Sydney, NSW 2000, Australia",
  },
  // {
  //   icon: MapPin,
  //   title: "Address",
  //   value: "75 Keththarama Mawatha, Colombo 14,Sri Lanka",
  // },
  // {
  //   icon: MapPin,
  //   title: "Address",
  //   value:
  //     "Level 29, World Plaza, 5thAvenue, BGC Fort Bonifacio 1634 Taguig City",
  // },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon-Fri 9am-5pm AEST",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
    company?: string;
  }>({});

  const [touched, setTouched] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    message?: boolean;
    company?: boolean;
  }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (name: string, value: string): string | undefined => {
    const stringValue = typeof value === "string" ? value : "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          return "Phone number is required";
        }
        if (!/^\d+$/.test(value)) {
          return "Phone number must contain numbers only";
        }
        break;

      case "message":
        if (!value.trim()) {
          return "Message is required";
        }
        break;
      case "company":
        if (!value.trim()) {
          return "Company is required";
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

  const handleChange = (
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

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const nameError = validateField("name", formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;

    const messageError = validateField("message", formData.message);
    if (messageError) newErrors.message = messageError;

    const phoneError = validateField("phone", formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const companyError = validateField("company", formData.company);
    if (companyError) newErrors.company = companyError;

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
    setHasSubmitted(true);
    if (!validateForm()) {
      return;
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
ADVICELAB - NEW CONTACT FORM SUBMISSION
=========================================

Submission Date: ${submissionDate}

Contact Details:
----------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Company: ${formData.company || "Not provided"}

Message:
--------
${formData.message}

---
This inquiry was submitted through the AdviceLab Contact page.
    `;

    try {
      const response = await fetch(`${API_BASE_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "x-api-key": "n4wSKrdsls7LO2vpHj78Qa9sR28ozfxS4qcCK9fL",
        },
        //  sender: "marketing@advicelab.com.au",
        //   recipient: "hello@advicelab.com.au",

        body: JSON.stringify({
          sender: "mail@notify.advicelab.com.au",
          recipient: "hello@advicelab.com.au",
          subject: `New Contact Form Submission: ${formData.name}`,
          body: emailBody,
          is_html: false,
          attachments: [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
      // Track form submission in GA4
      try {
        trackFormSubmission("contact_form", {
          name: formData.name,
          email: formData.email,
          company: formData.company,
        });
      } catch (err) {
        // swallow analytics errors
      }
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
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

  const contactSchema = {
    "@type": "ContactPage",
    name: "Contact Us - Advice Lab",
    url: "https://advicelab.com.au/contact-us",
    description: "Contact page for Advice Lab",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+61280740884",
      email: "hello@advicelab.com.au",
      url: "https://advicelab.com.au/contact-us",
    },
  };

  return (
    <Layout>
      <Seo
        title="Contact Us"
        description="Get in touch with Advice Lab. Phone, email, or contact form. We're based in Sydney and serve Australian financial advisers. Response within 24 hours."
        keywords="contact us Advice Lab, get in touch, financial services support, customer service, Sydney office, Advice Lab contact, contact information"
        pathname="/contact-us"
        schemaData={contactSchema}
      />
      {/* Hero */}
      <section className="py-24 gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="sr-only">Contact Us</h1>
          <ScrollAnimation animation="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto text-center">
              Ready to scale your practice? Let's discuss how we can help.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <ScrollAnimation animation="fade-right">
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitted ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                      <h3 className="text-3xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground max-w-md">
                        Thank you for reaching out. We'll get back to you within
                        24 hours.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="Your name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`transition-all duration-300 focus:scale-[1.02] ${
                              errors.name && touched.name
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                          />
                          {errors.name && touched.name && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="email"
                            placeholder="Your email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`transition-all duration-300 focus:scale-[1.02] ${
                              errors.email && touched.email
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                          />
                          {errors.email && touched.email && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Company
                          </label>
                          <Input
                            name="company"
                            placeholder="Your company"
                            value={formData.company}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="transition-all duration-300 focus:scale-[1.02]"
                          />
                          {errors.company && touched.company && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.company}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Phone
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="Your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="transition-all duration-300 focus:scale-[1.02]"
                          />
                          {errors.phone && touched.phone && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          placeholder="Tell us about your needs..."
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`transition-all duration-300 focus:scale-[1.01] ${
                            errors.message && touched.message
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                        />
                        {errors.message && touched.message && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.message}
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full sm:w-auto hover:scale-105 transition-transform"
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </Button>
                    </>
                  )}
                </form>
              </div>
            </ScrollAnimation>

            {/* Contact Info */}
            <ScrollAnimation animation="fade-left" delay={200}>
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6 mb-12">
                  {contactInfo.map((info, index) => {
                    // Determine the href based on the type
                    let href = "";
                    if (info.title === "Email") href = `mailto:${info.value}`;
                    if (info.title === "Phone")
                      href = `tel:${info.value.replace(/\s+/g, "")}`; // remove spaces for tel

                    return (
                      <a
                        key={index}
                        href={href || "#"} // fallback
                        className="flex items-start gap-4 hover-lift p-3 rounded-xl transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{info.title}</p>
                          <p className="text-muted-foreground">{info.value}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
