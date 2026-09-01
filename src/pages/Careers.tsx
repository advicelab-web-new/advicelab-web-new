import Seo from "@/components/ui/Seo";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Play, Linkedin, Instagram } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { TrainingPartnersLogos } from "@/components/careers/home/TrainingPartnersLogos";
import {
  Users,
  Lightbulb,
  Heart,
  MessageCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import greatPlaceToWorkCertificate1 from "@/assets/About/great-place-to-work-2024.webp";
import greatPlaceToWorkCertificate2 from "@/assets/About/great-place-to-work-2025.webp";
import { CompanyLifeShowcase } from "@/components/careers/home/CompanyLifeShowcase";

const resources = [
  {
    icon: Users,
    title: "Team Work",
    description:
      "We collaborate openly, support one another, and combine our strengths to deliver the best outcomes. Every win is shared, and every challenge is tackled as a team.",

    link: "#",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "We care deeply about our work and take pride in delivering our best. Our enthusiasm drives us to learn, grow, and constantly raise the bar.",

    link: "#",
  },
  {
    icon: MessageCircle,
    title: "Communication",
    description:
      "We share information, listen actively, and ensure everyone has what they need to succeed. Transparency helps us work smarter and stay aligned.",

    link: "#",
  },
  {
    icon: Lightbulb,
    title: "Entrepreneurial",
    description:
      "We look for smarter ways to work, challenge the status quo, and bring ideas that move us forward. Thinking out of the box isn’t optional, it’s part of how we grow.",

    link: "#",
  },
  {
    icon: RefreshCw,
    title: "Adaptability",
    description:
      "We embrace new ideas, respond quickly to change, and remain open to different perspectives. Adaptability helps us stay resilient and ahead of the curve.",

    link: "#",
  },
];

const benefits = [
  "Competitive salary packages",
  "Health and wellness benefits",
  "Professional development programs",
  "Flexible working arrangements",
  "Career growth opportunities",
  "Collaborative team culture",
];

const Careers = () => {
  const careersSchema = {
    "@type": "JobPosting",
    title: "Multiple Positions Available",
    description: "Join Advice Lab and support Australian financial advisers",
    url: "https://advicelab.com.au/careers",
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
        addressLocality: "Multiple Locations",
        addressRegion: "International",
        addressCountry: "AU",
      },
    },
  };

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <Layout>
      <Seo
        title="Join Our Team - Careers & Job Opportunities"
        description="Exciting career opportunities at Advice Lab. Join our growing team of paraplanning & financial services professionals. Check current vacancies in Australia & Asia."
        keywords="Advice Lab careers, job opportunities, paraplanning jobs, financial services jobs, Philippine careers, Sri Lanka careers, Australia jobs, financial adviser support careers, offshore support jobs"
        pathname="/careers"
        schemaData={careersSchema}
      />
      {/* Hero */}
      <section className="py-24 gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <ScrollAnimation animation="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto text-center">
              Build your career with a team that's transforming the financial
              advisory industry.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimation animation="fade-right">
              <div>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
                  Why Work With Us
                </span>
                <h2 className="font-display font-bold mt-2 mb-6 text-foreground text-2xl md:text-3xl">
                  A Great Place to Grow
                </h2>
                <p className="text-muted-foreground mb-8">
                  At Advice Lab, we are driven by people. We take pride in
                  nurturing, supporting, and shaping the career growth of every
                  individual who becomes part of our team. When you join us,
                  you're not just starting a job, you're stepping into a
                  workplace that believes in your potential, celebrates your
                  strengths, and grows with you.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}

                  {/* Buttons aligned under the grid */}
                  {/* <Button
                    size="sm"
                    asChild
                    className="h-12 px-12 text-md w-full sm:w-auto sm:min-w-[190px] transition-transform hover:scale-105"
                  >
                    <Link
                      to="/careers/srilanka"
                      className="flex items-center gap-2 justify-center sm:justify-start w-full"
                    >
                      Explore Sri Lanka
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button> */}

                  {/* ATS Linked */}
                  <Button
                    size="sm"
                    asChild
                    className="h-12 px-12 text-md w-full sm:w-auto sm:min-w-[190px] transition-transform hover:scale-105"
                  >
                    <a
                      href="https://ats.advicelab.com.au/careers?location=Colombo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 justify-center sm:justify-start w-full"
                    >
                      Explore Sri Lanka
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>

                  {/* <Button
                    size="sm"
                    asChild
                    className="h-12 px-12 text-md w-full sm:w-auto sm:min-w-[190px] transition-transform hover:scale-105"
                  >
                    <Link
                      to="/careers/philippines"
                      className="flex items-center gap-2 justify-center sm:justify-start w-full"
                    >
                      Explore Philippines
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button> */}

                  {/* ATS linked */}
                  <Button
                    size="sm"
                    asChild
                    className="h-12 px-12 text-md w-full sm:w-auto sm:min-w-[190px] transition-transform hover:scale-105"
                  >
                    <a
                      href="https://ats.advicelab.com.au/careers?location=Manila"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 justify-center sm:justify-start w-full"
                    >
                      Explore Philippines
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-left" delay={200}>
              <div className="relative">
                <div className="aspect-video rounded-3xl overflow-hidden hover-lift shadow-2xl group">
                  {!isVideoPlaying ? (
                    // Thumbnail with play button
                    <div
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <img
                        src="https://img.youtube.com/vi/rzZQsTnatDI/maxresdefault.jpg"
                        alt="Advice Lab Video"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                          <Play
                            className="w-10 h-10 text-white ml-1"
                            fill="white"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // YouTube iframe
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/rzZQsTnatDI?autoplay=1&rel=0&modestbranding=1"
                      title="Advice Lab - Life at Work"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Great Place to Work Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Left Side - Two Certificates */}
            <ScrollAnimation
              animation="fade-right"
              className="order-2 lg:order-1"
            >
              {/* className="-ml-6" */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {/* Certificate 1 */}
                <div>
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src={greatPlaceToWorkCertificate1}
                      alt="Great Place to Work Certificate 2024"
                      className="w-full max-w-[220px] h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Certificate 2 */}
                <div>
                  <div className="rounded-2xl overflow-hidden">
                    <img
                      src={greatPlaceToWorkCertificate2}
                      alt="Great Place to Work Certificate 2025"
                      className="w-full max-w-[220px] h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Right Side - Content */}
            <ScrollAnimation
              animation="fade-left"
              className="order-1 lg:order-2"
              delay={200}
            >
              <div>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-6">
                  Certified Excellence
                </span>

                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
                  A Workplace That Believes in You
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  You're stepping into a workplace that believes in your
                  potential, celebrates your strengths, and grows with you.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Curious to learn more about who we are? Check out our{" "}
                  <span className="text-foreground/80"> Instagram </span>
                  and <span className="text-foreground/80"> LinkedIn </span> to
                  get a peek into our culture and community.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="sm"
                    asChild
                    className="h-12 px-12 text-sm w-full sm:w-auto sm:min-w-[190px] transition-transform hover:scale-105"
                  >
                    <a
                      href="https://www.instagram.com/advice.lab/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <Instagram className="w-5 h-5 group-hover:text-primary transition-colors" />
                      <span>Follow on Instagram</span>
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    asChild
                    className="h-12 px-12 text-sm w-full sm:w-auto sm:min-w-[190px] transition-transform hover:scale-105"
                  >
                    <a
                      href="https://www.linkedin.com/company/advice-intel/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <Linkedin className="w-5 h-5 group-hover:text-primary transition-colors" />
                      <span>Connect on LinkedIn</span>
                    </a>
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      {/* <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
                Follow Us
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                Life at Advice Lab
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what it's like to be part of our team
              </p>
            </div>
          </ScrollAnimation>

          <div className="max-w-6xl mx-auto ">
            <div
              className="instagram-feed-widget bg-white rounded-2xl p-4 flex items-center justify-center"
              id="instagram-feed-container"
              style={{ position: "relative" }}
            >
              <iframe
                src="https://www.juicer.io/api/feeds/advice-lab-270a837c-9b66-449e-8c6c-23d850295bef/iframe"
                frameBorder="0"
                width="100%"
                height="700"
                style={{ display: "block", margin: "0 auto" }}
              ></iframe>

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "50px",
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
                  pointerEvents: "none",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "200px",
                  background:
                    "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
                  pointerEvents: "none",
                }}
              ></div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="hover:scale-105 transition-transform h-14 w-full sm:w-auto sm:min-w-[240px]"
            >
              <a
                href="https://www.instagram.com/advice.lab/"
                target="_blank"
                rel="noopener noreferrer"
              >
                See more <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section> */}

      <CompanyLifeShowcase />

      {/* Lead Magnets */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
                Our Values
              </span>

              <h2 className="font-display font-bold mt-2 text-muted-foreground text-2xl md:text-3xl">
                These values shape our culture and our team spirit
              </h2>
            </div>
          </ScrollAnimation>
          <div className="max-w-6xl mx-auto space-y-8">
            {/* First Row - 2 Items */}
            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {resources.slice(0, 2).map((resource, index) => (
                <ScrollAnimation
                  key={index}
                  animation="fade-up"
                  delay={index * 100}
                >
                  <div className="group p-8 bg-card rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 h-full hover:shadow-xl hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                      <resource.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            {/* Second Row - 3 Items */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.slice(2, 5).map((resource, index) => (
                <ScrollAnimation
                  key={index + 2}
                  animation="fade-up"
                  delay={(index + 2) * 100}
                >
                  <div className="group p-8 bg-card rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 h-full hover:shadow-xl hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                      <resource.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrainingPartnersLogos />

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <ScrollAnimation animation="scale">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Don't See the Right Role?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals. Send us your resume
              and we'll keep you in mind for future opportunities.
            </p>
            <Button
              size="lg"
              asChild
              className="hover:scale-105 transition-transform h-14 w-full sm:w-auto sm:min-w-[240px]"
            >
              <Link to="/careers/submit-resume">
                Submit Your Resume <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
