import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";

//Cover_img2
import allServiceHeroImage from "@/assets/HPImg/service-hero.jpg";
import white from "@/assets/HPImg/white.png";
import { useState } from "react";
import { ContactPopup } from "../ui/ContactPopup";

const ServicesHero = () => {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <section className="py-10 md:py-14 lg:py-16 gradient-primary relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <ScrollAnimation animation="fade-right">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight">
                Make Your Time Work for You While We Work on Your Documents
              </h1>
              <p className="text-base sm:text-lg text-white/80 mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Feel confident knowing your back-office work is handled - no
                stress, no guessing
              </p>

              {/* CTA Card — animated */}
              <div
                className="mt-8 relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 transition-all duration-500 hover:bg-white/15 hover:border-white/35 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                style={{
                  animation: "ctaFloat 4s ease-in-out infinite",
                }}
              >
                {/* Shimmer line across top */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full" />

                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="mt-0.5 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0"
                    style={{ animation: "sparkSpin 3s ease-in-out infinite" }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    Want to know how we make your back-office work is taken care
                    of with quality?
                  </p>
                </div>

                {/* Button with proper color hover */}
                <Button
                  size="default"
                  asChild
                  className="group relative overflow-hidden border border-white/40 bg-white/15 text-white font-semibold backdrop-blur-sm transition-all duration-300 shadow-lg shadow-black/10
                    hover:bg-white hover:border-white hover:shadow-xl hover:shadow-white/20 hover:scale-[1.02]
                    active:scale-[0.98]"
                  onClick={() => setIsContactPopupOpen(true)}
                >
                  <span className="flex items-center gap-2 cursor-pointer">
                    {/* Ripple shimmer on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    Take Your Live Walkthrough
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Button>
              </div>
            </div>
          </ScrollAnimation>

          {/* Right Content */}
          <ScrollAnimation animation="fade-left" delay={200}>
            <div className="relative">
              {/* Main image container */}
              <div className="aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                <img
                  src={allServiceHeroImage}
                  srcSet={`${allServiceHeroImage} 1200w`}
                  sizes="(max-width: 768px) 100vw, 640px"
                  alt="Professional financial advisory services team collaboration"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  width="1200"
                  height="900"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>

              {/* Floating accent card */}
              <div className="absolute -bottom-2 -left-2 bg-white rounded-xl px-3 py-2 shadow-md hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-primary whitespace-nowrap">
                    Save time & value
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              {/* <div className="absolute -top-3 -right-3 gradient-primary  rounded-full p-2 shadow-xl hidden lg:block">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <img
                    src={banner}
                    alt="icon"
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </div> */}

              <div className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-xl hidden lg:block">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                  <img
                    src={white}
                    alt="icon"
                    loading="lazy"
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </div>

              {/* <div className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-xl hidden lg:block">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div> */}
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes ctaFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes sparkSpin {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(15deg) scale(1.15); }
        }
      `}</style>

      <ContactPopup
        open={isContactPopupOpen}
        onOpenChange={setIsContactPopupOpen}
        title="Support Designed for You"
        description="We know that your practice back-office needs are unique.
                                    So we want to help you to give the support your practice
                                    deserves, just let us know and we'll take you on a quick
                                    walkthrough."
      />
    </section>
  );
};

export default ServicesHero;
