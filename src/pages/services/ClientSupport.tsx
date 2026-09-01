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
    title: "Review Support, Done Right",
    description:
      "Our CSO's manages every aspect of your pre and post review workflow from building complete review packs to updating Xplan and finalizing post-meeting tasks. Keeping your review cycle organized, consistent and compliant, so your team can stay focused on client conversations.",
    helps: [
      "Receive complete, ready-to-use review packs",
      "Reduce admin time before and after review meetings",
      "Maintain an accurate and compliant advice history",
    ],
  },
  {
    title: "Expert Administrative Support",
    description:
      "We take care of the everyday administration that supports your financial advice. By managing documents, coordination, and routine tasks in the background, we keep processes moving smoothly while you remain focused on strategy and meaningful conversations with your clients.",
    helps: [
      "Less admin to manage or follow up on",
      "Faster responses and smoother processes",
      "More time spent on your goals",
    ],
  },
  {
    title: "Advice Document Preparation & Implementation",
    description:
      "We prepare accurate, well-structured SOAs and ROAs, manage all fee consent requirements including DDR, CPP agreements and CSA related tasks. In addition, your experienced CSO will complete application preparation and end-to-end implementation ensuring recommendations move smoothly without delays or follow-ups.",
    helps: [
      "Professionally prepared advice documents aligned to your standards",
      "Accurate, timely application and implementation handling",
      "Consistent and compliant documentation across all files",
      "Less rework and fewer workflow delays",
    ],
  },
  {
    title: "Comprehensive Research Assistance",
    description:
      "Our CSO's conduct detailed, comparisons and product research to support the advice you deliver. They also manage insurance quotes and policy updates, ensuring your recommendations are informed and ready for implementation.",
    helps: [
      "Comprehensive research completed directly by skilled CSO's",
      "Receive accurate comparisons reducing your workload",
      "Speed up research-heavy stages of the advice process",
    ],
  },
  {
    title: "Proactive Provider Management",
    description:
      "Your CSO manages insurer and platform communication proactively, following up applications, monitoring renewals, resolving delays and actioning corporate notifications. You stay informed while we take care of the coordination.",
    helps: [
      "Save time on repetitive follow-ups and provider calls",
      "Keep applications and renewals progressing smoothly",
      "Gain full visibility without the manual workload",
    ],
  },
  {
    title: "Compliance & Verification Support",
    description:
      "Our CSO's can complete mandatory checks including AML, FSC, ensuring your process remains audit-ready without slowing down your advice delivery.",
    helps: [
      "Reduce compliance risks and documentation errors",
      "Maintain an audit-ready process year-round",
      "Save adviser time on compulsory admin tasks",
    ],
  },
  {
    title: "Client Lifecycle & Digital Workflow Management",
    description:
      "Your CSO's manage key client lifecycle steps, from onboarding to offboarding, deceased estates and client detail changes ensuring every transition is handled accurately and with care. They also oversee your mailbox, digital documents and workflow management, keeping communication organized, actioned and properly recorded.",
    helps: [
      "Smooth, well-managed lifecycle changes handled",
      "Timely processing of digital documents and communications",
      "Reduced manual workload and fewer missed tasks",
      "Clean, accurate and up-to-date client records",
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

const ClientSupport = () => {
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
        title="Client Support & Administrative Support"
        description="Professional client support officers for financial advisers. Bookkeeping, reporting, BAS preparation, payroll & reconciliations. Streamline your operations."
        keywords="client support officers, bookkeeping services, financial reporting, BAS preparation, payroll processing, financial reconciliation, business administration, advisory support services"
        pathname="/services/clientsupport"
        schemaData={{
          "@type": "LocalBusiness",
          name: "Advice Lab Client Support Services",
          description:
            "Professional client service and administrative support for financial advisers",
          url: "https://advicelab.com.au/services/clientsupport",
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
              Client Support Officers
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 text-center">
              Reliable support services that strengthens your workflow and
              helping you deliver excellent client services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="white"
                size="lg"
                onClick={() => setIsContactPopupOpen(true)}
              >
                Get in Touch
              </Button>
              {/* <Button variant="heroOutline" size="lg" asChild>
                <Link to="/contact-us">Get Pricing</Link>
              </Button> */}
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
              Client support service that elevates your practice
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

                        <div className=" bg-gradient-to-br from-blue-50/50 to-purple-50/30 rounded-xl p-6 border border-blue-100/50">
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
        </div>
      </section>{" "}
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

export default ClientSupport;
