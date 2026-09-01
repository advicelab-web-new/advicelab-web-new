import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import accaProfessionalDev from "@/assets/TrainingPartnersImg/acca-professional-development.webp";
import accaTraineeGold from "@/assets/TrainingPartnersImg/acca-trainee-development-gold.webp";
import aicpaCima from "@/assets/TrainingPartnersImg/aicpa-and-cima.webp";
import sliitCampus from "@/assets/TrainingPartnersImg/sliit-campus-logo.webp";
import royalInstitute from "@/assets/TrainingPartnersImg/royal-institute-of-colombo.webp";
import nsbmUniversity from "@/assets/TrainingPartnersImg/nsbm-university.webp";
import bmsCampus from "@/assets/TrainingPartnersImg/bms-logo.webp";
import nibmCampus from "@/assets/TrainingPartnersImg/nibm-logo.webp";

const universityLogos = [
  { src: accaProfessionalDev, alt: "ACCA Professional Development" },
  { src: accaTraineeGold, alt: "ACCA Trainee Development Gold" },
  { src: aicpaCima, alt: "AICPA and CIMA" },
  { src: sliitCampus, alt: "SLIIT Campus" },
  { src: royalInstitute, alt: "Royal Institute of Colombo" },
  { src: nsbmUniversity, alt: "NSBM University" },
  { src: bmsCampus, alt: "BMS Campus" },
  { src: nibmCampus, alt: "NIBM Campus" },
];

export function TrainingPartnersLogos() {
  return (
    <section className="bg-secondary py-12 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollAnimation animation="fade-up">
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-foreground text-3xl sm:text-4xl md:text-[42px] font-bold text-center leading-tight mb-3">
              Our Training and University Partners
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl text-center max-w-2xl px-4">
              We support your journey every step of the way
            </p>
          </div>
        </ScrollAnimation>
      </div>

      <div className="mt-8 relative overflow-hidden">
        <div className="inline-flex animate-marquee whitespace-nowrap will-change-transform">
          {/* First set */}
          {universityLogos.map((logo, index) => (
            <div
              key={`set1-${index}`}
              className="inline-flex flex-shrink-0 w-44 h-28 p-4 mx-4 rounded-lg  transition-all duration-300 items-center justify-center sm:w-56 sm:h-32 sm:p-5 sm:mx-6 md:w-64 md:h-36 md:p-6 md:mx-8"
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
          {universityLogos.map((logo, index) => (
            <div
              key={`set2-${index}`}
              className="inline-flex flex-shrink-0 w-44 h-28 p-4 mx-4 rounded-lg  transition-all duration-300 items-center justify-center sm:w-56 sm:h-32 sm:p-5 sm:mx-6 md:w-64 md:h-36 md:p-6 md:mx-8"
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
          {universityLogos.map((logo, index) => (
            <div
              key={`set3-${index}`}
              className="inline-flex flex-shrink-0 w-44 h-28 p-4 mx-4 rounded-lg transition-all duration-300 items-center justify-center sm:w-56 sm:h-32 sm:p-5 sm:mx-6 md:w-64 md:h-36 md:p-6 md:mx-8"
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
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-marquee {
          animation: marquee 80s linear infinite;
          will-change: transform;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
