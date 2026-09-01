import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { usePricingCalculator } from "@/hooks/usePricingCalculator";
import {
  Calculator,
  ArrowRight,
  DollarSign,
  Clock,
  Zap,
  CheckCircle,
  FileText,
  PieChart,
  Shield,
  TrendingUp,
  Sparkles,
  BarChart3,
} from "lucide-react";

import newCastleEmpoweredWealth from "@/assets/CLImg/new-castle-empowered-wealth.webp";
import abacusWealthSolution from "@/assets/CLImg/abacus-wealth-solution.webp";
import accountplan from "@/assets/CLImg/accountplan.webp";
import atlasWealthAdvisory from "@/assets/CLImg/atlas-wealth-advisory.webp";
import { Layout } from "../layout/Layout";

import louellaJorge from "@/assets/ClientImg/client1.webp";
import harryFlaskas from "@/assets/ClientImg/client2.webp";
import louisMatheson from "@/assets/ClientImg/client3.webp";

interface PricingFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

const features: PricingFeature[] = [
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: "Transparent Pricing",
    description:
      "Get upfront pricing for single or complex paraplanning services. We don't surprise with hidden fees",
    highlight: "No surprises",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Flexible Turnaround",
    description:
      "Choose between regular to urgent service options to match your deadlines",
    highlight: "On-time delivery",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "All-Inclusive Service",
    description:
      "Every SOA & ROA includes QA review, compliance checks and on-time delivery",
    highlight: "Quality assured",
  },
];

const serviceCategories = [
  {
    icon: <FileText className="w-5 h-5" />,
    name: "Standard SOA",
    price: "Starting at $275",
  },
  {
    icon: <PieChart className="w-5 h-5" />,
    name: "Fast Track SOA",
    price: "Starting at $350",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    name: "Standard ROA",
    price: "Starting at $120",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    name: "Fast Track ROA",
    price: "Starting at $280",
  },
];

export function PricingCalculatorCTAForMarketing() {
  const { open: openPricingCalculator } = usePricingCalculator();
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="py-8 bg-muted-foreground/5 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <ScrollAnimation animation="fade-up" className="text-center mb-16">
              <div>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
                  Get Instant Pricing
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                  Calculate Your{" "}
                  <span className="gradient-text">Paraplanning Costs</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Get a quote tailored to your specific need instantly.
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Side - CTA Card */}
              <ScrollAnimation animation="fade-right">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-foreground">
                        Pricing Calculator
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Get your quote in seconds
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-muted-foreground leading-relaxed">
                      Whether you need a simple SOA or a complex one, use our
                      calculator to help you on:
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Compare regular vs urgent SOA&ROA preparation",
                        "Get cost for single or multiple strategies",
                        "Calculate your monthly SOA cost and compare best options ",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    size="lg"
                    className="w-full h-14 gradient-primary text-primary-foreground hover:opacity-90 font-semibold rounded-xl group shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl"
                    onClick={() => navigate("/services/paraplanning-quote")}
                  >
                    <Calculator className="mr-2 w-5 h-5" />
                    Go to the Pricing Calculator
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-center text-muted-foreground/60 text-xs mt-4">
                    Free to use
                  </p>
                </div>
              </ScrollAnimation>

              {/* Right Side - Features Grid */}
              <ScrollAnimation animation="fade-left" delay={200}>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="group bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center text-primary group-hover:from-primary/20 group-hover:to-blue-600/20 transition-colors flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">
                              {feature.title}
                            </h4>
                            {feature.highlight && (
                              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                {feature.highlight}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Trust Badge */}
                  <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-primary/5 to-blue-600/5 border border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {/* Replace this array with your actual client images */}
                        {[
                          newCastleEmpoweredWealth,
                          abacusWealthSolution,
                          accountplan,
                          atlasWealthAdvisory,
                        ].map((src, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 border-2 border-white overflow-hidden"
                          >
                            <img
                              src={src}
                              alt={`Client ${i + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="w-20% h-20% object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Trusted by 70+ Financial Advice practices across
                          Australia
                        </p>
                        {/* <p className="text-xs text-muted-foreground">
                        Across Australia who use our calculator monthly
                      </p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Client Reviews Section ===== */}
      <section className="py-16 pt-1 bg-muted-foreground/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center pt-0 pb-12">
          <div className="flex items-center w-full max-w-2xl">
            {/* Left fading line */}
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400 to-indigo-500" />

            {/* Center ornament */}
            <div className="flex flex-col items-center gap-2 px-5">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-md shadow-blue-200">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            </div>

            {/* Right fading line */}
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-400 to-indigo-500" />
          </div>
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Reviews Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  initials: "LJ",
                  review:
                    "Ever since we've partnered with Advice Lab, we've never looked back",
                  name: "Louella Jorge",
                  company: "Principal Adviser - Discovery Wealth Advisers",
                  image: louellaJorge,
                },
                {
                  initials: "HF",
                  review:
                    "We have grown our business from zero clients to several hundred clients in 3 ½ years thanks to the support we have from Advice Lab.",
                  name: "Harry Flaskas",
                  company: "Atlas Wealth Advisory",
                  image: harryFlaskas,
                },
                {
                  initials: "LM",
                  review:
                    "Coastal has had a positive experience working with Advice Lab. The team are professional, approachable, and always strive to become better. Overall, we would recommend Advice Lab to any business looking for structured, thoughtful financial services support.",
                  name: "Louis Matheson",
                  company: "Coastal Advice Group",
                  image: louisMatheson,
                },
              ].map((review, index) => (
                <ScrollAnimation
                  key={review.name}
                  animation="fade-up"
                  delay={index * 100}
                >
                  <div className="group bg-white rounded-2xl border border-gray-100 p-7 flex flex-col items-center text-center hover:border-primary/20 hover:shadow-lg transition-all duration-300 h-full">
                    {/* Avatar — replace div with <img> when you have real photos */}
                    <div className="w-20 h-20 rounded-full border-[3px] border-primary/60 overflow-hidden mb-5 flex-shrink-0 bg-primary/5 flex items-center justify-center">
                      {review.image ? (
                        <img
                          src={review.image}
                          alt={review.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-semibold text-primary">
                          {review.initials}
                        </span>
                      )}
                    </div>

                    {/* Review text */}
                    <p className="text-muted-foreground text-sm leading-relaxed italic flex-1 mb-5">
                      "{review.review}"
                    </p>

                    {/* Divider */}
                    <div className="w-8 h-px bg-primary/25 mb-4" />

                    {/* Name & company */}
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.company}
                    </p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
