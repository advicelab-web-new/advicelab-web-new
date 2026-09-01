import React, { Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import Seo from "@/components/ui/Seo";
import { TopBanner } from "@/components/careers/home/TopBanner";
import { HeroSlider } from "@/components/careers/home/HeroSlider";

const ClientLogos = React.lazy(() =>
  import("@/components/careers/home/ClientLogos").then((mod) => ({
    default: mod.ClientLogos,
  })),
);
const ServicesOverview = React.lazy(() =>
  import("@/components/careers/home/ServicesOverview").then((mod) => ({
    default: mod.ServicesOverview,
  })),
);
const WhyChooseUs = React.lazy(() =>
  import("@/components/careers/home/WhyChooseUs").then((mod) => ({
    default: mod.WhyChooseUs,
  })),
);
const Testimonials = React.lazy(() =>
  import("@/components/careers/home/Testimonials").then((mod) => ({
    default: mod.Testimonials,
  })),
);
const Index = () => {
  const organizationSchema = {
    "@type": "Organization",
    name: "Advice Lab",
    url: "https://advicelab.com.au",
    logo: "https://advicelab.com.au/logo.png",
    description:
      "Offshore paraplanning, client support and compliance services for Australian financial advisers",
    address: {
      "@type": "PostalAddress",
      streetAddress: "368 Sussex St",
      addressLocality: "Sydney",
      addressRegion: "NSW",
      postalCode: "2000",
      addressCountry: "AU",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+61280740884",
      email: "hello@advicelab.com.au",
    },
    sameAs: [
      "https://www.linkedin.com/company/advice-lab",
      "https://www.facebook.com/advicelab",
    ],
  };

  return (
    <Layout>
      <Seo
        title="Advice Lab | Comprehensive Offshore Support for Australian Financial Advisers"
        description="Offshore paraplanning, client support & compliance services for Australian financial advisers—scale your practice with reliable, qualified teams."
        keywords="paraplanning services, financial advice support, offshore paraplanning, financial adviser outsourcing, compliance support, client service support, financial planning support, advice lab"
        pathname="/"
        schemaData={organizationSchema}
      />
      {/* <TopBanner /> */}
      <HeroSlider />

      <Suspense fallback={<div className="h-24" />}>
        <ClientLogos />
        <ServicesOverview />
        <WhyChooseUs />
        <Testimonials />
      </Suspense>
    </Layout>
  );
};

export default Index;
