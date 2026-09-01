import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactPopup } from "@/components/ui/ContactPopup";

import paraplanning from "@/assets/HPImg/paraplanning-hero.webp";
import financialPrecision from "@/assets/HPImg/financial-precision-hero.webp";
import smsfAccountingImage from "@/assets/HPImg/hero-smsf-accounting.webp";
import mortgageSupport from "@/assets/HPImg/hero-mortgage-support.webp";

const slides = [
  {
    image: paraplanning,
    title: "Paraplanning Services ",
    subtitle: "Expert Assistance",
    description:
      "Quality, fast, compliant paraplanning – delivered by experienced offshore specialists from Sri Lanka and Philippines.  ",
    link: "/services/paraplanning",
    showLearnMore: true, // Show Learn More button
  },
  {
    image: financialPrecision,
    title: "Client Support Officers",
    subtitle: "Financial Precision",
    description:
      "Reliable offshore client support that keeps your practice moving.  ",
    link: "/services/clientsupport",
    showLearnMore: true, // Show Learn More button
  },
  // {
  //   image: hero3,
  //   title: "Accounting & Bookkeeping",
  //   subtitle: "Property Finance",
  //   description:
  //     "Financial management services delivered by experienced accounting specialists.",
  //   link: "/services/mortgage",
  //   showLearnMore: false, // Don't show Learn More button
  // },
  {
    image: smsfAccountingImage,
    title: "SMSF & Accounting",
    subtitle:
      "Scale your SMSF & Accounting operations with dependable offshore expertise",
    description:
      "Scale your SMSF & Accounting operations with dependable offshore expertise ",
    link: "/services/smsf-accounting",
    showLearnMore: true, // Don't show Learn More button
  },
  {
    image: mortgageSupport,
    title: "Mortgage Support ",
    subtitle: "Property Finance",
    description:
      "Streamlined mortgage support that speeds up lodgments and approvals. ",
    link: "/services/mortgage-support",
    showLearnMore: true, // Don't show Learn More button
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[currentSlide];

  return (
    <section className="relative min-h-[89vh] h-[89vh] md:min-h-[600px] md:h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
        <img
          src={activeSlide.image}
          srcSet={`${activeSlide.image} 1200w`}
          sizes="100vw"
          alt={activeSlide.title}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex items-center px-4 lg:px-8">
        <div className="max-w-2xl w-full px-2">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute"
              }`}
            >
              {index === currentSlide && (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight text-balance animate-slide-up">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 mb-8 animate-slide-up delay-150">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">
                    {/* Conditionally render Learn More button */}
                    {slide.showLearnMore && (
                      <Button variant="heroOutline" size="lg" asChild>
                        <Link
                          aria-label={`Learn more about ${slide.title}`}
                          to={slide.link}
                        >
                          Learn More <ArrowRight className="w-5 h-5" />
                          {/* SEO issues in button here */}
                        </Link>
                      </Button>
                    )}
                    {/* <Button variant="hero" size="lg" asChild>
                      <Link to="/contact-us">Get in Touch</Link>
                    </Button> */}
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={() => setIsContactPopupOpen(true)}
                    >
                      Get in Touch
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-4">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-1.5 md:p-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="flex gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${slides[index].title}`}
              aria-current={index === currentSlide ? "true" : undefined}
              className="flex h-10 w-10 items-center justify-center rounded-full"
            >
              <span
                className={`block rounded-full transition-all ${
                  index === currentSlide
                    ? "w-6 h-3 bg-primary-foreground"
                    : "w-3 h-3 bg-primary-foreground/40 hover:bg-primary-foreground/60"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-1.5 md:p-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Contact Popup */}
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
}
