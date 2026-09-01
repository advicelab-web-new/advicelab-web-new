import Seo from "@/components/ui/Seo";
import { Layout } from "@/components/layout/Layout";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { ShieldCheck } from "lucide-react";

const ISMSStatement = () => {
  const ismsSchema = {
    "@type": "WebPage",
    name: "Information Security Management System Statement - Advice Lab",
    description:
      "Learn about how Advice Lab protects the confidentiality, integrity, and availability of information through its Information Security Management System.",
    url: "https://advicelab.com.au/information-security-statement",
  };

  return (
    <Layout>
      <Seo
        title="ISMS Statement - Advice Lab"
        description="Learn about how Advice Lab protects the confidentiality, integrity, and availability of information through its ISO/IEC 27001:2022 aligned Information Security Management System."
        keywords="ISMS, information security, ISO 27001, data protection, security policy, Advice Lab"
        pathname="/information-security-statement"
        schemaData={ismsSchema}
      />

      {/* Hero Section */}
      <section className="py-24 gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 flex justify-center">
          <ScrollAnimation animation="fade-up">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-16 h-16 text-primary-foreground mb-6" />
              <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
                Information Security Management System Statement
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-3xl text-center">
                Last updated: May 26th, 2026
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollAnimation animation="fade-up" threshold={0.0}>
            <div className="max-w-4xl mx-auto">
              {/* Our Commitment */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Our Commitment
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At Advice Lab, we are committed to protecting the
                  confidentiality, integrity, and availability of information
                  entrusted to us by our clients, partners, and staff.
                  Information security is not just a technical obligation — it
                  is a core part of how we deliver trusted advice and maintain
                  the confidence of everyone we work with.
                </p>
              </div>

              {/* Scope */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Scope
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our ISMS applies to all information assets, systems, people,
                  and processes involved in the delivery of Advice Lab's
                  advisory services, including client data, internal systems,
                  third-party relationships, and remote working environments.
                </p>
              </div>

              {/* What We Do */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  What We Do
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We have established, implemented, and maintain an Information
                  Security Management System aligned with the requirements of
                  ISO/IEC 27001:2022. This system is reviewed regularly to
                  ensure it remains appropriate to the nature and scale of our
                  business.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our ISMS is designed to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>
                    Identify and manage information security risks in a
                    structured and consistent way
                  </li>
                  <li>
                    Protect client and business information from unauthorized
                    access, disclosure, alteration, or loss
                  </li>
                  <li>
                    Meet our legal, regulatory, and contractual obligations,
                    including applicable Australian privacy legislation
                  </li>
                  <li>
                    Build and maintain trust with our clients and stakeholders
                  </li>
                  <li>
                    Continuously improve our security posture based on lessons
                    learned and evolving threats
                  </li>
                </ul>
              </div>

              {/* Leadership and Accountability */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Leadership and Accountability
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Senior leadership at Advice Lab is fully committed to this
                  ISMS. Security responsibilities are clearly assigned, and all
                  staff are expected to understand and uphold their role in
                  protecting information assets.
                </p>
              </div>

              {/* Continuous Improvement */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Continuous Improvement
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We treat information security as an ongoing discipline. We
                  regularly assess risks, test our controls, review incidents,
                  and update our practices to reflect changes in our business
                  environment and the threat landscape.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4 italic">
                  This statement is reviewed annually and approved by Advice
                  Lab's senior leadership.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about our Information Security
                  Management System or our security practices, please contact
                  Advice Lab using the contact details provided in our Privacy
                  Policy.
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:hello@advicelab.com.au"
                      className="text-primary hover:underline"
                    >
                      hello@advicelab.com.au
                    </a>
                  </li>
                  <li>
                    <strong>Phone:</strong>{" "}
                    <a
                      href="tel:+61280740884"
                      className="text-primary hover:underline"
                    >
                      +61 2 8074 0884
                    </a>
                  </li>
                  <li>
                    <strong>Address:</strong> 368 Sussex St, Sydney, NSW 2000,
                    Australia
                  </li>
                </ul>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
};

export default ISMSStatement;
