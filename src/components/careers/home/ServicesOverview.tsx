import { Link } from "react-router-dom";
import { FileText, Home, ArrowRight, BarChart3, Users } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";

const services = [
  {
    icon: FileText,
    title: "Paraplanning ",
    description:
      "Comprehensive support for financial planning documentation and client administration.",
    link: "/services/paraplanning",
  },
  {
    icon: Users,
    title: "Client Support Officers",
    description:
      "Professional bookkeeping and financial reporting services for advisory practices.",
    link: "/services/clientsupport",
  },
  // {
  //   icon: Home,
  //   title: "Accounting ",
  //   description: "End-to-end mortgage processing and documentation assistance.",
  //   link: "/services/mortgage",
  // },
  {
    icon: BarChart3,
    title: "SMSF & Accounting",
    description:
      "Scale your SMSF & Accounting operations with dependable offshore expertise",
    link: "/services/smsf-accounting",
  },
  {
    icon: Home,
    title: "Mortgage Support",
    description: "End-to-end mortgage processing and documentation assistance.",
    link: "/services/mortgage-support",
  },
];

export function ServicesOverview() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollAnimation animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              Our Services
            </h2>
            {/* <h2
              className={`font-display font-bold mt-2 mb-4 text-muted-foreground ${styles.mainHeader}`}
            >
              Complete Support for Australian Financial Advisors
            </h2> */}
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide dedicated back-office support to help you scale your
              practice.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <ScrollAnimation
              key={index}
              animation="fade-up"
              delay={index * 150}
            >
              <Link
                to={service.link}
                className="group block p-8 bg-card rounded-3xl border border-border hover:border-primary/30 hover-lift"
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow">
                  <service.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </Link>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
