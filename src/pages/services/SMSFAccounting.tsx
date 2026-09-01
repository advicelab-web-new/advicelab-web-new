import Seo from "@/components/ui/Seo";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { ContactPopup } from "@/components/ui/ContactPopup";

const offerings = [
  {
    title: "Manage Every SMSF Smoothly From Setup to Daily Administration",
    description:
      "Start every SMSF on solid ground with accurate, compliant setup and ongoing admin handled for you, so you can stay focused on client strategy, not paperwork. We take care of setup, processing, transactions, and compliance, ensuring every fund runs smoothly year‑round.",
    helps: [
      "Reduce setup complexity and avoid costly compliance mistakes from day one.",
      "Eliminate manual admin work with accurate processing and documentation handled for you.",
      "Maintain high accuracy across every fund with steady, reliable management even during peak periods.",
    ],
  },
  {
    title: "Bookkeeping That Keeps Every Detail Right",
    description:
      "Have confidence in your bookkeeping done right. Your dedicated support member will work as your own team member ensuring consistent accuracy and clarity you can depend on.",
    helps: [
      "Get client‑ready numbers fast with receivables, payables, and reconciliations always up‑to‑date.",
      "Reduce review time with accurate GST, PAYG, IAS/BAS prep backed by proper documentation.",
      "Scale your firm confidently with every transaction tracked, reconciled, and compliant.",
    ],
  },
  {
    title: "Accounting Support That Extends Your Team Seamlessly",
    description:
      "Expand your firm’s output with dependable accounting support that handles detailed work so your team can focus on advisory.",
    helps: [
      "Take on more clients without overwhelming your internal team.",
      "Ensure continuity with a dedicated resource who follows your workflow and quality standards.",
      "Minimize ATO risks with schedules and lodgement prep aligned to Australian compliance standards.",
    ],
  },
  {
    title:
      "Keep Your Core Accounting Tasks Accurate, Compliant, and Off Your Plate",
    description:
      "Providing you the support you need to handle reconciliation, payroll, and compliance workloads with steady, reliable output that helps your firm maintain quality, even as client volumes grow.",
    helps: [
      "Fewer downstream errors because every transaction is matched correctly the first time.",
      "Cleaner workpapers that make reviews faster and more predictable.",
      "More reliable reporting with ledgers that stay consistent across all client files.",
    ],
  },
  {
    title: "Strengthen Operational Consistency",
    description:
      "Deliver faster, clearer, and more accurate outcomes with a support system that reduces delays, minimises errors, and keeps you informed at every step.",
    helps: [
      "Deliver faster turnaround to your clients",
      "Stay informed with clear communication and monthly updates",
      "Work with fewer delays, fewer errors, and greater confidence",
    ],
  },
];

const trustIndicators = [
  {
    title: "Robust advice-industry experience",
    description:
      "Having partnered with over 70+ advisers in the financial planning industry, we understand the realities advisers face. Our back office support is shaped by hands-on knowledge of advice practices, regulatory requirements, and quality to provide you the precise support you need.",
  },
  {
    title: "Driven by people, not just process.",
    description:
      "We're a people-driven team that values learning and accountability. Our back office support receive ongoing training and regular updates to stay aligned with industry changes, supported by a strong working culture that encourages efficiency, collaboration, and quality outcomes for advisers.",
  },
  {
    title: "ISO27001 certified for information security",
    description:
      "Advice Lab is ISO 27001 certified, giving you the peace of mind, confirming that we prioritize data privacy and applies strong security measures across all paraplanning activities.",
  },
  {
    title: "Extended coverage across two locations",
    description:
      "Our teams in Sri Lanka and the Philippines allows to support advice delivery across extended hours. This means work can continue beyond your day, helping reduce delays and maintain momentum.",
  },
];

const SMSFAccounting = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = (idx: number) => {
    if (!isMobile) setOpenIndex(idx);
  };
  const handleMouseLeave = () => {
    if (!isMobile) setOpenIndex(null);
  };
  const handleClick = (idx: number) => {
    if (isMobile) setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <Layout>
      <Seo
        title="SMSF & Accounting Support | Advice Lab"
        description="Expert SMSF administration and accounting support for financial advisers and accountants. Tax returns, BAS preparation, financial statements, audit coordination and more."
        keywords="SMSF administration, accounting support, tax returns, BAS preparation, financial statements, SMSF audit, bookkeeping, payroll, superannuation, BGL, Class Super, Xero"
        pathname="/services/smsf-accounting"
        schemaData={{
          "@type": "LocalBusiness",
          name: "Advice Lab SMSF & Accounting Support",
          description:
            "Expert SMSF administration and accounting support for financial advisers and accountants",
          url: "https://advicelab.com.au/services/smsf-accounting",
        }}
      />

      {/* Hero */}
      <section className="py-24 gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 flex justify-center">
          <ScrollAnimation animation="fade-up" className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6"></div>
            <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
              SMSF & Accounting Support
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 text-center">
              Increase your SMSF & Accounting capacity effortlessly with
              end‑to‑end outsourcing that keeps you compliant, accurate, and
              ahead of deadlines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="white"
                size="lg"
                onClick={() => setIsContactPopupOpen(true)}
              >
                Get in Touch
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Offerings */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <ScrollAnimation
            animation="fade-up"
            className="w-full text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              Our Offering
            </span>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seamless SMSF & Accounting support that fits your operational
              needs
            </p>
          </ScrollAnimation>

          <div className="mx-auto">
            <div className="space-y-4">
              {offerings.map((offering, index) => (
                <ScrollAnimation
                  key={offering.title}
                  animation="fade-up"
                  delay={index * 120}
                >
                  <div
                    className="group rounded-2xl border-0 bg-white shadow-md transition-all duration-300 overflow-hidden"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="h-1 w-0 bg-gradient-to-r from-primary to-blue-600 group-hover:w-full transition-all duration-500"></div>

                    <div className="px-8">
                      <div
                        className="text-left text-lg md:text-xl font-display font-bold py-6 hover:text-primary transition-colors group-hover:no-underline cursor-pointer select-none flex items-start gap-4 pr-4"
                        onClick={() => handleClick(index)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:from-primary/20 group-hover:to-blue-600/20 transition-colors">
                          <span className="text-sm font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <span>{offering.title}</span>
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          openIndex === index
                            ? "max-h-[1000px] opacity-100 py-8 space-y-6"
                            : "max-h-0 opacity-0 py-0"
                        }`}
                        style={{
                          transitionProperty: "max-height, opacity, padding",
                        }}
                      >
                        <div>
                          <p className="text-muted-foreground leading-relaxed">
                            {offering.description}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/30 rounded-xl p-6 border border-blue-100/50">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-[5px] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wide text-primary">
                              How this helps you
                            </p>
                          </div>
                          <ul className="space-y-3">
                            {offering.helps.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-blue-600 mt-2 flex-shrink-0"></div>
                                <span className="text-sm text-foreground leading-relaxed">
                                  {point}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-24 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <ScrollAnimation animation="fade-up" className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              Why Us
            </span>{" "}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Why Partner With Advice Lab
            </h2>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 gap-8 mx-auto">
            {trustIndicators.map((indicator, index) => (
              <ScrollAnimation
                key={indicator.title}
                animation="fade-up"
                delay={index * 140}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative bg-white rounded-2xl p-8 shadow-md transition-all duration-300 border border-gray-100 h-full">
                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-blue-600/10 mb-6 group-hover:from-primary/20 group-hover:to-blue-600/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <span className="relative text-2xl font-bold bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent">
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {indicator.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {indicator.description}
                  </p>

                  <div className="mt-6 h-1 w-0 bg-gradient-to-r from-primary to-blue-600 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>
      <ContactPopup
        open={isContactPopupOpen}
        onOpenChange={setIsContactPopupOpen}
        title="Support Designed for You"
        description="We know that your practice back-office needs are unique.
                                    So we want to help you to give the support your practice
                                    deserves, just let us know and we'll take you on a quick
                                    walkthrough."
      />
    </Layout>
  );
};

export default SMSFAccounting;
