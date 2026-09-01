import Seo from "@/components/ui/Seo";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { ContactPopup } from "@/components/ui/ContactPopup";
import { PricingCalculatorCTA } from "@/components/services/PricingCalculatorCTA";

const offerings = [
  {
    title: "Statement of Advice preparation",
    description:
      "Our experienced paraplanners prepare clear, well-structured Statements of Advice (SoAs) across a broad range of advice scenarios, from simple cases to comprehensive strategies. We operate as an extension of your team, following your templates, preferences, and advice style.",
    helps: [
      "Receive well-structured plans that are ready to present",
      "Spend less time reviewing and refining documents",
      "Maintain consistency across all client advice",
    ],
  },
  {
    title: "Consistent and fast turnaround times",
    description:
      "Our established workflows and experienced paraplanning team deliver plans within clear timeframes so you can manage client expectations and advice schedules with confidence.",
    helps: [
      "Keep advice moving without unnecessary delays",
      "Plan meetings and reviews with greater certainty",
      "Reduce pressure caused by last-minute documentation",
    ],
  },
  {
    title: "Accuracy you can rely on",
    description:
      "Every plan is reviewed by our dedicated QA team with a strong focus on accuracy and consistency. We pay close attention to detail so you're not fixing avoidable errors or inconsistencies.",
    helps: [
      "Fewer revisions after delivery",
      "Cleaner, more reliable advice documents",
      "Greater confidence when presenting to clients",
    ],
  },
  {
    title: "Support aligned with current compliance standards",
    description:
      "Our paraplanners stay aligned with current professional and regulatory expectations, ensuring your documentation supports compliance obligations without becoming overly complex.",
    helps: [
      "Reduce compliance-related concerns",
      "Be better prepared for audits and file reviews",
      "Maintain professional standards across your advice documents",
    ],
  },
  {
    title: "Cost-efficient paraplanning with built-in flexibility",
    description:
      "Our paraplanning service is an efficient alternative to in-house hiring, helping you reduce overheads without sacrificing quality. Engage a dedicated paraplanner on a part-time or full-time basis and match support with your workload.",
    helps: [
      "Reduce staffing and operational costs compared to in-house resourcing",
      "Access a dedicated paraplanner without long-term employment commitments",
      "Scale support easily as advice volumes increase or slow",
      "Maintain consistent quality while keeping paraplanning costs under control",
    ],
  },
  {
    title: "Extended support across two time zones",
    description:
      "We offer paraplanning support from teams in Sri Lanka and the Philippines so your work progresses beyond standard business hours. Choose one location or combine both for extended coverage and faster turnaround.",
    helps: [
      "Improve efficiency with work progressing across extended hours",
      "Reduce turnaround times without increasing in-house pressure",
      "Choose support from Sri Lanka, the Philippines, or both",
      "Maintain consistency and quality across all plans, regardless of location",
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

const benefits = [
  {
    title: "Save 20+ Hours Weekly",
    description:
      "Free up your time to focus on client relationships and business development.",
  },
  {
    title: "Reduce Operational Costs",
    description:
      "Access skilled professionals at a fraction of local hiring costs.",
  },
  {
    title: "Scale On Demand",
    description:
      "Easily adjust your team size based on workload and business needs.",
  },
  {
    title: "Quality Assured",
    description: "All work undergoes rigorous quality checks before delivery.",
  },
];

const Paraplanning = () => {
  // Responsive hover/click logic for Accordion
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
        title="Expert Paraplanning Services for Financial Advisers"
        description="Professional paraplanning support: SOA preparation, client file management, compliance documentation & portfolio reviews. Scale your practice with our experts."
        keywords="paraplanning services, statement of advice preparation, financial planning support, client file management, portfolio review services, compliance documentation, SOA preparation, financial adviser support, paraplanning outsourcing"
        pathname="/services/paraplanning"
        schemaData={{
          "@type": "LocalBusiness",
          name: "Advice Lab Paraplanning Services",
          description:
            "Expert paraplanning services for financial advisers including SOA preparation and compliance documentation",
          url: "https://advicelab.com.au/services/paraplanning",
        }}
      />
      {/* Hero */}
      <section className="py-24 gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 flex justify-center">
          <ScrollAnimation animation="fade-up" className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              {/* <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground/80 font-medium">
                Services
              </span> */}
            </div>
            <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
              Paraplanning
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 text-center">
              Providing you accurate plans with fast turnaround times and
              consistent quality, giving you hours back to focus more on your
              clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="heroOutline"
                size="lg"
                onClick={() => {
                  const element = document.getElementById(
                    "pricing-calculator-cta",
                  );
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                Get Instant Pricing
              </Button>
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

      {/* Features */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {/* Header */}
          <ScrollAnimation
            animation="fade-up"
            className="w-full text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              Our Offering
            </span>
            {/* <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
           Our offering{" "}
              <span className="gradient-text"> - it must be our offering</span>
            </h2> */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive paraplanning solutions tailored to your practice
              needs
            </p>
          </ScrollAnimation>

          {/* Accordion */}
          <div className=" mx-auto">
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
                    {/* Gradient accent bar */}
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
                      {/* Smooth expand/collapse content */}
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
                        {/* Description */}
                        <div className="">
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
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {/* Header */}
          <ScrollAnimation animation="fade-up" className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              Why Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Why Partner With Advice Lab
            </h2>
            {/* <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our paraplanning service combines deep industry knowledge with
              robust processes and security
            </p> */}
          </ScrollAnimation>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8  mx-auto">
            {trustIndicators.map((indicator, index) => (
              <ScrollAnimation
                key={indicator.title}
                animation="fade-up"
                delay={index * 140}
                className="group relative"
              >
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Main card */}
                <div className="relative bg-white rounded-2xl p-8 shadow-md  transition-all duration-300 border border-gray-100 h-full">
                  {/* Number badge with icon background */}
                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-blue-600/10 mb-6 group-hover:from-primary/20 group-hover:to-blue-600/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <span className="relative text-2xl font-bold bg-gradient-to-br from-primary to-blue-600 bg-clip-text text-transparent">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {indicator.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {indicator.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="mt-6 h-1 w-0 bg-gradient-to-r from-primary to-blue-600 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>{" "}
        <ContactPopup
          open={isContactPopupOpen}
          onOpenChange={setIsContactPopupOpen}
          title="Support Designed for You"
          description="We know that your practice back-office needs are unique.
                                      So we want to help you to give the support your practice
                                      deserves, just let us know and we'll take you on a quick
                                      walkthrough."
        />
      </section>

      {/* Pricing Calculator CTA Section */}
      <section id="pricing-calculator-cta">
        <PricingCalculatorCTA />
      </section>
    </Layout>
  );
};

export default Paraplanning;
