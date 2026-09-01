import {
  Users,
  TrendingUp,
  Clock,
  Headphones,
  Unlock,
  Globe,
} from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";

const features = [
  {
    icon: Users,
    title: "Dedicated Team",
    description:
      "Your own trained professionals working exclusively for your practice.",
  },
  {
    icon: TrendingUp,
    title: "Scale Efficiently",
    description:
      "Grow your practice at a lower cost than managing local staff overheads. ",
  },
  {
    icon: Unlock,
    title: "No Lock-in",
    description:
      "Pay only for the services you use — flexible, pay‑as‑you‑go outsourcing. ",
  },
  {
    icon: Globe,
    title: "Extended Practice Hours",
    description:
      "Offshore teams across Sri Lanka & Philippines keep your practice running longer and smoother.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollAnimation animation="fade-up">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
              Why Choose Advice Lab
            </span>
            <h2 className="font-display font-semibold mt-2 mb-4 text-muted-foreground text-[1.3rem]">
              Trusted by Leading Financial Advisers in Australia
            </h2>
            {/* <h3 className="font-display font-normal mb-4 text-muted-foreground text-[1rem]">
              With more than 30 years of financial services expertise, we’re
              committed to delivering high‑quality, cost‑effective outsourced
              solutions.
            </h3> */}
          </div>
        </ScrollAnimation>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <ScrollAnimation key={index} animation="scale" delay={index * 100}>
              <div className="text-center hover-lift p-6 rounded-2xl transition-all duration-300 hover:bg-background/50">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-background flex items-center justify-center mb-6 shadow-soft">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
