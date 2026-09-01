import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";


export function CustomizeSection() {
  return (
    <section className="py-24 gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <ScrollAnimation animation="scale">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-primary-foreground/90 font-medium mb-6 tracking-tight">
              The Advice Lab Advisor Platform
            </span>
            <h2 className="font-display font-bold text-primary-foreground/80 mb-6 text-2xl md:text-3xl">
              Build Your Own Custom Solution
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Choose the services you need to create a tailored support package that fits your practice perfectly.
            </p>
            <Button variant="white" size="lg" asChild className="hover:scale-105 transition-transform duration-300">
              <Link to="/contact">
                Start Here <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
