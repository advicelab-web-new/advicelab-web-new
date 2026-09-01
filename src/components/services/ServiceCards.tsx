import { useState } from "react";
import { FileText, Users, Landmark, Home } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import ServicePopup from "./ServicePopup";

interface Service {
  id: string;
  icon: React.ElementType;
  title: string;
  shortDescription: string;
  link: string;
  fullDescription: string;
  features: string[];
  benefits: string[];
  image: string;
}

const services: Service[] = [
  {
    id: "paraplanning",
    icon: FileText,
    title: "Paraplanning",
    shortDescription:
      "Comprehensive SOA preparation and documentation support for financial advisers.",
    link: "/services/paraplanning",
    fullDescription:
      "Our experienced paraplanners deliver accurate, well-structured Statements of Advice with fast turnaround times. We operate as an extension of your team, following your templates, preferences, and advice style to ensure consistency across all client documentation.",
    features: [
      "Statement of Advice (SOA) preparation",
      "Record of Advice (ROA) preparation",
      "Client file management & reviews",
      "Research and strategy analysis",
      "Portfolio reviews & comparisons",
      "Compliance documentation support",
    ],
    benefits: [
      "Save 20+ hours weekly on documentation",
      "Consistent quality with dedicated QA review",
      "Fast turnaround times you can rely on",
      "Cost-efficient alternative to in-house hiring",
    ],
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "client-support",
    icon: Users,
    title: "Client Support",
    shortDescription:
      "Dedicated client service officers to streamline your practice operations.",
    link: "/services/clientsupport",
    fullDescription:
      "Our Client Support Officers (CSOs) manage every aspect of your pre and post-review workflow. From building complete review packs to updating Xplan and finalizing post-meeting tasks, we keep your review cycle organized, consistent, and compliant.",
    features: [
      "Review pack preparation & management",
      "Advice document preparation (SOAs/ROAs)",
      "Application & implementation support",
      "Provider management & follow-ups",
      "Compliance & verification support",
      "Client lifecycle management",
    ],
    benefits: [
      "Reduce administrative burden significantly",
      "Maintain audit-ready processes year-round",
      "Faster responses and smoother workflows",
      "More time for client relationships",
    ],
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "smsf-accounting",
    icon: Landmark,
    title: "SMSF & Accounting",
    shortDescription:
      "Specialized SMSF administration and accounting services for advisory practices.",
    link: "/services/smsf-accounting",
    fullDescription:
      "Our SMSF specialists provide comprehensive self-managed super fund administration and accounting support. We handle the complexities of SMSF compliance, reporting, and regulatory requirements, allowing you to offer holistic superannuation advice to your clients.",
    features: [
      "SMSF annual financial statements",
      "Fund administration & compliance",
      "Tax return preparation & lodgment support",
      "Member contribution management",
      "Pension setup & administration",
      "Audit coordination & support",
    ],
    benefits: [
      "Expert SMSF compliance management",
      "Reduce risk of regulatory breaches",
      "Comprehensive reporting on time",
      "Scale your SMSF service offering",
    ],
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mortgage-support",
    icon: Home,
    title: "Mortgage Support",
    shortDescription:
      "End-to-end mortgage processing and documentation assistance.",
    link: "/services/mortgage",
    fullDescription:
      "Our mortgage support team provides comprehensive loan processing assistance, from initial application through to settlement. We handle document verification, lender communication, and coordination, ensuring smooth transactions for your clients' property financing needs.",
    features: [
      "Loan application processing",
      "Document verification & collection",
      "Lender communication & follow-ups",
      "Settlement coordination",
      "Post-settlement support",
      "Refinancing assistance",
    ],
    benefits: [
      "Streamlined loan processing workflow",
      "Reduce processing time significantly",
      "Professional lender management",
      "Enhanced client experience",
    ],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const ServiceCards = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleCardClick = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      setPopupOpen(true);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollAnimation animation="fade-up" className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Comprehensive Services for Your Practice
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Select a service to explore how our expert teams can help streamline
            your operations and enhance your advisory capabilities.
          </p>
        </ScrollAnimation>

        {/* Service Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <ScrollAnimation
                key={service.id}
                animation="fade-up"
                delay={index * 100}
              >
                <button
                  onClick={() => handleCardClick(service.id)}
                  className="w-full group relative p-6 rounded-2xl transition-all duration-300 text-left bg-white hover:bg-gray-50 border border-gray-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors bg-gradient-to-br from-primary/10 to-blue-600/10 group-hover:from-primary/20 group-hover:to-blue-600/20">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-display font-bold mb-2 transition-colors text-foreground group-hover:text-primary">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.shortDescription}
                  </p>

                  {/* Bottom accent */}
                  <div className="mt-4 h-1 rounded-full transition-all duration-300 bg-primary/20 w-0 group-hover:w-full"></div>
                </button>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>

      {/* Service Popup */}
      <ServicePopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        service={selectedService}
      />
    </section>
  );
};

export default ServiceCards;
