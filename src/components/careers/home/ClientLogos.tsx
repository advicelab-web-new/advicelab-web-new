import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import newCastleEmpoweredWealth from "@/assets/CLImg/new-castle-empowered-wealth.webp";
import abacusWealthSolution from "@/assets/CLImg/abacus-wealth-solution.webp";
import accountplan from "@/assets/CLImg/accountplan.webp";
import atlasWealthAdvisory from "@/assets/CLImg/atlas-wealth-advisory.webp";
import coastalAdviceGroup from "@/assets/CLImg/coastal-advice-group.webp";
import finsuraWealthManagement from "@/assets/CLImg/finsura-wealth-management.webp";
import ftfCapital from "@/assets/CLImg/ftf-capital.webp";
import financeUnlimitedWealth from "@/assets/CLImg/finance-unlimited-wealth.webp";
import lifelongWealth from "@/assets/CLImg/lifelong-wealth.webp";
import frostFinancial from "@/assets/CLImg/frost-financial.webp";
import discoveryWealthAdvisers from "@/assets/CLImg/discovery-wealth-advisers.webp";
import makairaFinancialSolution from "@/assets/CLImg/makaira-financial-solution.webp";
import miscoastFinancialPlanningGroup from "@/assets/CLImg/miscoast-financial-planning-group.webp";
import mpmWealthManagement from "@/assets/CLImg/mpm-wealth-management.webp";
import zebraTailloredWealth from "@/assets/CLImg/zebra-taillored-wealth.webp";

const logos = [
  { src: newCastleEmpoweredWealth, alt: "New Castle Empowered Wealth logo" },
  { src: abacusWealthSolution, alt: "Abacus Wealth Solution logo" },
  { src: accountplan, alt: "Accountplan logo" },
  { src: atlasWealthAdvisory, alt: "Atlas Wealth Advisory logo" },
  { src: coastalAdviceGroup, alt: "Coastal Advice Group logo" },
  { src: finsuraWealthManagement, alt: "Finsura Wealth Management logo" },
  { src: ftfCapital, alt: "FTF Capital logo" },
  { src: financeUnlimitedWealth, alt: "Finance Unlimited Wealth logo" },
  { src: lifelongWealth, alt: "Lifelong Wealth logo" },
  { src: frostFinancial, alt: "Frost Financial logo" },
  { src: discoveryWealthAdvisers, alt: "Discovery Wealth Advisers logo" },
  { src: makairaFinancialSolution, alt: "Makaira Financial Solution logo" },
  {
    src: miscoastFinancialPlanningGroup,
    alt: "Miscoast Financial Planning Group logo",
  },
  { src: mpmWealthManagement, alt: "MPM Wealth Management logo" },
  { src: zebraTailloredWealth, alt: "Zebra Tailored Wealth logo" },
];

export function ClientLogos() {
  return (
    <section className="gradient-primary py-6 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollAnimation animation="fade-up">
          <div className="flex items-center justify-center">
            <p className="text-primary-foreground text-xl sm:text-2xl md:text-[30px] font-bold text-center leading-tight px-2">
              Australian financial advisers grow together with Advice Lab
            </p>
          </div>
        </ScrollAnimation>
      </div>

      <div className="mt-4 relative overflow-hidden">
        <div className="inline-flex animate-marquee-clients whitespace-nowrap will-change-transform">
          {/* First set */}
          {logos.map((logo, index) => (
            <div
              key={`set1-${index}`}
              className="inline-flex flex-shrink-0 w-40 h-20 p-3 mx-6 rounded-lg transition-all duration-300 items-center justify-center sm:w-48 sm:h-24 sm:p-4 sm:mx-8 md:w-56 md:h-28 md:p-5 md:mx-10"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}

          {/* Second set - duplicate for seamless loop */}
          {logos.map((logo, index) => (
            <div
              key={`set2-${index}`}
              className="inline-flex flex-shrink-0 w-40 h-20 p-3 mx-6 rounded-lg hover:shadow-lg transition-all duration-300 items-center justify-center sm:w-48 sm:h-24 sm:p-4 sm:mx-8 md:w-56 md:h-28 md:p-5 md:mx-10"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}

          {/* Third set - for extra smoothness */}
          {logos.map((logo, index) => (
            <div
              key={`set3-${index}`}
              className="inline-flex flex-shrink-0 w-40 h-20 p-3 mx-6 rounded-lg hover:shadow-lg transition-all duration-300 items-center justify-center sm:w-48 sm:h-24 sm:p-4 sm:mx-8 md:w-56 md:h-28 md:p-5 md:mx-10"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-clients {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-marquee-clients {
          animation: marquee-clients 180s linear infinite;
          will-change: transform;
        }

        .animate-marquee-clients:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
