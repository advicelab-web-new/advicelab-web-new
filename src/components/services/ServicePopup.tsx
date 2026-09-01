import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  Users,
  Star,
  FileText,
  Landmark,
  Home,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Service {
  id: string;
  icon: React.ElementType;
  title: string;
  shortDescription: string;
  link: string;
  fullDescription: string;
  features: string[];
  benefits: string[];
  image: string;
}

interface ServicePopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

// Team group images for each service
const teamImages: Record<string, string> = {
  paraplanning:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "client-support":
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "smsf-accounting":
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "mortgage-support":
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
};

// Icon content items for each service
const iconContent: Record<
  string,
  { icon: React.ElementType; title: string; description: string }[]
> = {
  paraplanning: [
    {
      icon: FileText,
      title: "SOA Preparation",
      description:
        "Comprehensive Statement of Advice documents tailored to your templates and style.",
    },
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description:
        "Every plan undergoes rigorous QA review for accuracy and compliance.",
    },
    {
      icon: Users,
      title: "Dedicated Team",
      description:
        "Experienced paraplanners who understand your practice needs.",
    },
  ],
  "client-support": [
    {
      icon: Users,
      title: "Review Packs",
      description:
        "Complete review pack preparation and management for client meetings.",
    },
    {
      icon: CheckCircle,
      title: "Workflow Management",
      description:
        "Streamlined pre and post-meeting workflows to keep you organized.",
    },
    {
      icon: FileText,
      title: "Documentation",
      description:
        "Professional advice document preparation and implementation support.",
    },
  ],
  "smsf-accounting": [
    {
      icon: Landmark,
      title: "Fund Administration",
      description:
        "Comprehensive SMSF administration and compliance management.",
    },
    {
      icon: CheckCircle,
      title: "Financial Statements",
      description:
        "Annual financial statements and tax return preparation support.",
    },
    {
      icon: Users,
      title: "Audit Coordination",
      description: "Seamless audit coordination and compliance support.",
    },
  ],
  "mortgage-support": [
    {
      icon: Home,
      title: "Loan Processing",
      description: "End-to-end loan application processing and documentation.",
    },
    {
      icon: CheckCircle,
      title: "Lender Management",
      description: "Professional lender communication and follow-ups.",
    },
    {
      icon: Users,
      title: "Settlement Support",
      description: "Coordinated settlement process for smooth transactions.",
    },
  ],
};

export function ServicePopup({
  open,
  onOpenChange,
  service,
}: ServicePopupProps) {
  if (!service) return null;

  const Icon = service.icon;
  const teamImage = teamImages[service.id] || teamImages.paraplanning;
  const contentItems = iconContent[service.id] || iconContent.paraplanning;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 max-h-[95vh] overflow-hidden">
        {/* Header with gradient background */}
        <div className="gradient-primary p-6 pb-8">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-display font-bold text-white">
                  {service.title}
                </DialogTitle>
                <DialogDescription className="text-white/80 mt-1">
                  {service.shortDescription}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Full Description */}
          <p className="text-muted-foreground leading-relaxed">
            {service.fullDescription}
          </p>

          {/* Statistics Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/10">
              <Clock className="w-6 h-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground">24-48h</span>
              <span className="text-xs text-muted-foreground text-center">
                Turnaround
              </span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/10">
              <Award className="w-6 h-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground">99%</span>
              <span className="text-xs text-muted-foreground text-center">
                Quality Rate
              </span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/10">
              <Users className="w-6 h-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground">50+</span>
              <span className="text-xs text-muted-foreground text-center">
                Happy Clients
              </span>
            </div>
          </div>

          {/* Icon + Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-foreground">
              What We Offer
            </h3>
            <div className="grid gap-4">
              {contentItems.map((item, index) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-100 hover:border-primary/20 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-blue-600/20 transition-colors">
                      <ItemIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-4">
            {/* Group Photo */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary/10 shadow-lg group">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={teamImage}
                alt={`${service.title} Team`}
                className="w-full h-36 object-cover"
                loading="lazy"
              />
            </div>

            {/* Team Description */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-blue-50 border border-primary/10">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our dedicated team of experienced professionals is committed to
                delivering exceptional quality and support for your practice.
                With expertise spanning {service.title.toLowerCase()} and a
                passion for excellence, we ensure your success is our priority.
              </p>
            </div>
          </div>

          {/* Service Features Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-bold text-foreground">
              Key Features
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {service.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-primary/5 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Benefits */}
          <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl p-5">
            <h3 className="text-lg font-display font-bold text-foreground mb-4">
              Key Benefits
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {service.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial Section */}
          <div className="relative p-5 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/50 border border-gray-100">
            <div className="absolute top-3 left-4 text-4xl text-primary/20 font-serif">
              "
            </div>
            <div className="pl-8">
              <p className="text-sm text-muted-foreground italic leading-relaxed mb-3">
                Working with Advice Lab has transformed our practice efficiency.
                Their team delivers exceptional quality with quick turnaround
                times, allowing us to focus on what matters most - our clients.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  — Financial Adviser, Sydney
                </span>
              </div>
            </div>
          </div>

          {/* Learn More Button */}
          <div className="pt-2">
            <Button
              size="lg"
              asChild
              className="w-full hover:scale-[1.02] transition-transform group"
              onClick={() => onOpenChange(false)}
            >
              <Link to={service.link}>
                Learn More About {service.title}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ServicePopup;
