import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { usePageViewTracking } from "@/hooks/usePageViewTracking";
import { CookieConsent } from "@/components/CookieConsent";
import { PricingCalculatorProvider } from "@/hooks/usePricingCalculator";
import { PricingCalculatorPopupWrapper } from "@/components/ui/PricingCalculatorPopupWrapper";
import PageLoader from "./components/ui/PageLoader";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Paraplanning = lazy(() => import("./pages/services/Paraplanning"));
const ClientSupport = lazy(() => import("./pages/services/ClientSupport"));
const Marketing = lazy(() => import("./pages/services/Marketing"));
const Mortgage = lazy(() => import("./pages/services/Mortgage"));
const Blog = lazy(() => import("./pages/Resources/Blog"));
const Careers = lazy(() => import("./pages/Careers"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
// const PhilippinesVacancies = lazy(
//   () => import("./pages/careers/PhilippinesVacancies"),
// );
// const SriLankaVacancies = lazy(
//   () => import("./pages/careers/SriLankaVacancies"),
// );
// const JobDetail = lazy(() => import("./pages/careers/JobDetail"));
const SubmitResume = lazy(() => import("./pages/careers/SubmitResume"));
const Contact = lazy(() => import("./pages/Contact"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SMSFAccounting = lazy(() => import("./pages/services/SMSFAccounting"));
const PricingCalculator = lazy(
  () => import("./pages/services/PricingCalculator"),
);
const Foundation = lazy(() => import("./pages/Foundation"));
const PricingCalculatorCTAForMarketing = lazy(() =>
  import("./components/services/PricingCalculatorCTAForMarketing").then(
    (mod) => ({
      default: mod.PricingCalculatorCTAForMarketing,
    }),
  ),
);
const PricingCalculatorLogicForMarketing = lazy(
  () => import("./pages/services/PricingCalculatorLogicForMarketing"),
);
const InformationSecurityStatement = lazy(
  () => import("./pages/InformationSecurityStatement"),
);

const queryClient = new QueryClient();

/**
 * AppRoutes Component
 * Separated to use React Router hooks (useLocation) for GA4 page tracking
 * This component must be inside BrowserRouter to access location context
 */
const AppRoutes = () => {
  // Track page views on route changes
  // usePageViewTracking();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<Navigate to="/about-us" replace />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/paraplanning" element={<Paraplanning />} />
          <Route path="/services/clientsupport" element={<ClientSupport />} />
          <Route path="/services/mortgage-support" element={<Mortgage />} />
          <Route path="/services/smsf-accounting" element={<SMSFAccounting />} />
          <Route path="/services/marketing" element={<Marketing />} />
          <Route
            path="/services/paraplanning-pricing" //? Marketing calculator page
            element={<PricingCalculatorCTAForMarketing />}
          />
          <Route
            path="/services/paraplanning-quote" //? Marketing calculator page with logic
            element={<PricingCalculatorLogicForMarketing />}
          />
          <Route
            path="/resources/pricing-calculator"
            element={<PricingCalculator />}
          />
          <Route path="/resources/blogs" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/giving-back" element={<Foundation />} />
          {/* <Route path="/careers/philippines" element={<PhilippinesVacancies />} />
          <Route path="/careers/srilanka" element={<SriLankaVacancies />} />
          // <Route path="/careers/job/:jobId" element={<JobDetail />} /> */}
          <Route path="/careers/submit-resume" element={<SubmitResume />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route
            path="/information-security-statement"
            element={<InformationSecurityStatement />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PricingCalculatorProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
          <CookieConsent />
          <PricingCalculatorPopupWrapper />
        </BrowserRouter>
      </PricingCalculatorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
