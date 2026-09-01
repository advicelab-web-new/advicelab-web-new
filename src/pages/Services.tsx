import Seo from "@/components/ui/Seo";
import { Layout } from "@/components/layout/Layout";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceCards from "@/components/services/ServiceCards";
import ServicesInquirySection from "@/components/services/ServicesInquirySection";
import BookWalkthrough from "@/components/services/BookWalkthrough";

const Services = () => {
  const servicesSchema = {
    "@type": "LocalBusiness",
    name: "Advice Lab Services",
    description:
      "Comprehensive financial services including paraplanning, client support, SMSF & accounting, and mortgage support for Australian financial advisory practices.",
    url: "https://advicelab.com.au/services",
    hasOfferingDetails: [
      {
        "@type": "Offer",
        name: "Paraplanning Services",
        description:
          "Comprehensive paraplanning support including SOA preparation, client file management, and compliance documentation for financial advisers",
        url: "https://advicelab.com.au/services/paraplanning",
      },
      {
        "@type": "Offer",
        name: "Client Support Services",
        description:
          "Professional client service officers for administrative support, review pack preparation, and workflow management",
        url: "https://advicelab.com.au/services/clientsupport",
      },
      {
        "@type": "Offer",
        name: "SMSF & Accounting Services",
        description:
          "Specialized SMSF administration and accounting services for advisory practices",
        url: "https://advicelab.com.au/services/smsf-accounting",
      },
      {
        "@type": "Offer",
        name: "Mortgage Support Services",
        description:
          "End-to-end mortgage processing and documentation assistance for loan applications",
        url: "https://advicelab.com.au/services/mortgage",
      },
    ],
  };

  return (
    <Layout>
      <Seo
        title="Financial Services for Advisers | Paraplanning, Client Support, SMSF & Mortgage"
        description="Comprehensive offshore services for Australian financial advisers: paraplanning, client support officers, SMSF & accounting, and mortgage support. Scale your practice efficiently with expert support."
        keywords="paraplanning services, client support officers, SMSF administration, mortgage support, financial adviser services, offshore support, Australian financial services, SOA preparation, compliance documentation, advisory support services"
        pathname="/services"
        schemaData={servicesSchema}
      />
      {/* Hero Section */}
      <ServicesHero />
      {/* <ServiceCards /> remove after all finalised */}
      {/* Services Inquiry Section */}

      <ServicesInquirySection />
    </Layout>
  );
};

export default Services;
