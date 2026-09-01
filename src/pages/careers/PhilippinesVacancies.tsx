import { Layout } from "@/components/layout/Layout";
import Seo from "@/components/ui/Seo";
import { CareersPageTemplate } from "@/components/careers/CareersPageTemplate";

const PhilippinesVacancies = () => {
  const philippinesJobSchema = {
    "@type": "JobPosting",
    title: "Career Opportunities in Philippines",
    description:
      "Explore exciting career opportunities in the Philippines with Advice Lab supporting Australian financial advisers",
    url: "https://advicelab.com.au/careers/philippines",
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
        streetAddress: "Level 29, World Plaza, 5th Avenue, BGC Fort Bonifacio",
        addressLocality: "Taguig City",
        addressRegion: "NCR",
        postalCode: "1634",
        addressCountry: "PH",
      },
    },
  };

  return (
    <Layout>
      <Seo
        title="Job Opportunities in Philippines | Paraplanning Careers | Advice Lab"
        description="Explore career opportunities in the Philippines with Advice Lab. Join our dynamic team supporting Australian financial advisers. Apply now for paraplanning roles."
        keywords="Philippines jobs, paraplanning jobs Philippines, financial services jobs Manila, careers in Philippines, offshore jobs, support services jobs, financial adviser support, job opportunities Asia"
        pathname="/careers/philippines"
        schemaData={philippinesJobSchema}
      />
      <CareersPageTemplate
        pageTitle="Philippines Opportunities"
        pageDescription="Explore exciting career opportunities in the Philippines"
        location="Manila"
        backLink="/careers"
        locationShowcase="Metro Manila"
      />
    </Layout>
  );
};

export default PhilippinesVacancies;
