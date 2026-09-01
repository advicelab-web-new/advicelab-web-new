import { Layout } from "@/components/layout/Layout";
import Seo from "@/components/ui/Seo";
import { CareersPageTemplate } from "@/components/careers/CareersPageTemplate";

const SriLankaVacancies = () => {
  const sriLankaJobSchema = {
    "@type": "JobPosting",
    title: "Career Opportunities in Sri Lanka",
    description:
      "Discover job opportunities in Sri Lanka with Advice Lab providing paraplanning and financial support services to Australian advisers",
    url: "https://advicelab.com.au/careers/srilanka",
    datePosted: new Date().toISOString().split("T")[0],
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Advice Lab",
      sameAs: "https://advicelab.com.au",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "No.75, Keththarama Mawatha",
        addressLocality: "Colombo 14",
        addressRegion: "Western Province",
        postalCode: "01400",
        addressCountry: "LK",
      },
    },
  };

  return (
    <Layout>
      <Seo
        title="Career Opportunities in Sri Lanka | Advice Lab"
        description="Discover job opportunities in Sri Lanka with Advice Lab. Join a growing team providing paraplanning and financial support services to Australian advisers."
        keywords="Sri Lanka jobs, paraplanning jobs, financial services careers, Colombo jobs, offshore support jobs, financial adviser support, career opportunities Asia, Advice Lab Sri Lanka"
        pathname="/careers/srilanka"
        schemaData={sriLankaJobSchema}
      />
      <CareersPageTemplate
        pageTitle="Sri Lanka Opportunities"
        pageDescription="Explore exciting career opportunities in Sri Lanka"
        location="Colombo"
        locationShowcase="Colombo"
        backLink="/careers"
      />
    </Layout>
  );
};

export default SriLankaVacancies;
