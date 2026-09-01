import Seo from "@/components/ui/Seo";
import { Layout } from "@/components/layout/Layout";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { Cookie } from "lucide-react";

const CookiesPolicy = () => {
  const cookiesSchema = {
    "@type": "WebPage",
    name: "Cookies Policy - Advice Lab",
    description:
      "Learn about how Advice Lab uses cookies and similar technologies to improve your browsing experience.",
    url: "https://advicelab.com.au/cookies-policy",
  };

  return (
    <Layout>
      <Seo
        title="Cookies Policy - Advice Lab"
        description="Learn about how Advice Lab uses cookies and similar technologies to improve your browsing experience and understand your preferences."
        keywords="cookies policy, cookie usage, website cookies, data privacy, Advice Lab cookies"
        pathname="/cookies-policy"
        schemaData={cookiesSchema}
      />
      {/* Hero Section */}
      <section className="py-24 gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 flex justify-center">
          <ScrollAnimation animation="fade-up">
            <div className="flex flex-col items-center">
              <Cookie className="w-16 h-16 text-primary-foreground mb-6" />
              <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
                Cookies Policy
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-3xl text-center">
                Last updated: January 22nd, 2026
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
              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Introduction
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Advice Lab is committed to protecting the privacy of visitors
                  to our website and being transparent about how information is
                  collected and used. This Cookie Policy explains how cookies
                  are used on our website and the choices available to users.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This policy should be read together with our{" "}
                  <a
                    href="/pdf/AL_Privacy-policy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline"
                  >
                    Privacy Policy.
                  </a>{" "}
                </p>
              </div>

              {/* Overview */}

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Overview
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Advice Lab uses cookies to support the secure and effective
                  operation of its website and to gain limited insights into how
                  the website is used. Cookies are used in a proportionate
                  manner that reflects our role as a professional advisory firm
                  and our focus on client trust and confidentiality.
                </p>
              </div>

              {/* What Are Cookies */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  What Are Cookies?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Cookies are small text files stored on your device when you
                  visit a website. They help the site function correctly,
                  improve performance, and provide information about how
                  visitors interact with it. These files do not give Advice Lab
                  access to your device or personal information beyond what you
                  choose to share.
                </p>
              </div>

              {/* How cookies relate to personal information */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  How cookies relate to personal information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Some cookies may collect information that is considered
                  personal information under applicable privacy laws. Where this
                  occurs, such information is handled in accordance with Advice
                  Lab’s Privacy Policy and the Australian Privacy Principles.
                </p>
              </div>

              {/* How we use cookies */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  How we use cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Advice Lab uses cookies for the following purposes :
                </p>

                {/* Essential Cookies */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    1. Essential Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies are necessary for the website to operate
                    securely and reliably. They support core website
                    functionality, session management, and security controls.
                    Without these cookies, the website may not function as
                    intended.
                  </p>
                  {/* <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Session management cookies</li>
                    <li>Security cookies</li>
                    <li>Cookie consent preferences</li>
                  </ul> */}
                </div>

                {/* Analytics Cookies */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    2. Performance & Analytics Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies collect aggregated and anonymized information
                    about website usage, such as pages visited, time spent on
                    the site, and general traffic patterns. This information is
                    used solely to improve website performance and content and
                    does not identify individual users.
                  </p>
                </div>

                {/* Functional Cookies */}
                {/* <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    3. Functional Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies enable enhanced functionality and
                    personalization, such as remembering your preferences.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Language preferences</li>
                    <li>Display preferences</li>
                    <li>Form data retention</li>
                  </ul>
                </div> */}

                {/* Marketing Cookies */}
                {/* <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    4. Marketing Cookies
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These cookies are used to track visitors across websites.
                    The intention is to display ads that are relevant and
                    engaging for the individual user.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                    <li>Social media tracking (LinkedIn, YouTube, etc.)</li>
                    <li>Advertising personalization</li>
                    <li>Conversion tracking</li>
                  </ul>
                </div> */}
              </div>

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Cookies We Do Not Use
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Advice Lab does not use cookies for cross-website tracking,
                  third-party behavioural advertising, or user profiling across
                  other websites. We do not track user's activity beyond the
                  Advice Lab website, and we do not sell, rent, or trade
                  personal information collected through cookies.
                  <br />
                  <br />
                  Advice Lab may analyse on-site visitor behaviour using
                  first-party analytics cookies to understand website usage,
                  assess the effectiveness of content or campaigns, and improve
                  user experience. This analysis is limited to activity on our
                  website only and does not involve tracking users across
                  external websites.
                </p>
              </div>

              {/* How We Use Cookies */}
              {/* <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  How We Use Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-3 ml-4">
                  <li>
                    <strong>Authentication:</strong> To remember your login
                    status and preferences
                  </li>
                  <li>
                    <strong>Security:</strong> To protect against fraudulent
                    activity and enhance security
                  </li>
                  <li>
                    <strong>Analytics:</strong> To understand how users interact
                    with our website and improve our services
                  </li>
                  <li>
                    <strong>Performance:</strong> To measure and improve website
                    loading times and functionality
                  </li>
                  <li>
                    <strong>Personalization:</strong> To remember your
                    preferences and provide tailored content
                  </li>
                </ul>
              </div> */}

              {/* Third-Party Cookies */}
              {/* <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Third-Party Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may use third-party services that set their own cookies:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-3 ml-4">
                  <li>
                    <strong>Google Analytics:</strong> For website analytics and
                    user behavior insights
                  </li>
                  <li>
                    <strong>LinkedIn:</strong> For social media integration and
                    tracking
                  </li>
                  <li>
                    <strong>YouTube:</strong> For embedded video content
                  </li>
                  <li>
                    <strong>Instagram:</strong> For social media integration
                  </li>
                  <li>
                    <strong>TikTok:</strong> For social media integration
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Please refer to these third parties' privacy policies for more
                  information about their cookie practices.
                </p>
              </div> */}

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Third-Party Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Advice Lab does not intentionally deploy third-party marketing
                  or advertising cookies. Limited third-party cookies may be
                  used where required to support website hosting, security
                  services, or performance monitoring. Any such cookies are used
                  strictly for operational purposes and not for advertising or
                  cross-site tracking.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Managing Cookies
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can manage or disable cookies through your browser
                  settings at any time. Most browsers allow you to view, delete,
                  or block cookies. Please note that disabling essential cookies
                  may affect the functionality and security of the website.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Consent
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By continuing to use the Advice Lab website, you consent to
                  the use of cookies in accordance with this Cookie Policy and
                  our Privacy Policy. Where required, cookie notifications or
                  consent mechanisms may be displayed to provide additional
                  control.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Updates to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Advice Lab may update this Cookie Policy from time to time to
                  reflect changes in technology, legal requirements, or website
                  functionality. Any updates will be published on this page with
                  a revised “Last updated” date.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about this Cookie Policy or how
                  cookies are used on our website, please contact Advice Lab
                  using the contact details provided in our Privacy Policy.
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

export default CookiesPolicy;
