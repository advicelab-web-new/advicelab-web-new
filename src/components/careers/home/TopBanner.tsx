import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


export function TopBanner() {
  return (
    <section className="py-5 gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-4xl">
          <p
            className="font-display font-bold text-primary-foreground/80 text-2xl md:text-3xl"
          >
            Build Your Own Back-Office
          </p>
          <p
            className="text-primary-foreground/80 max-w-2xl tracking-tight"
          >
            Choose the services to create a tailored package that fits your
            practice perfectly.
          </p>
        </div>
        <div className="flex items-center sm:justify-end">
          <Button
            variant="white"
            size="sm"
            asChild
            className="hover:scale-105 transition-transform duration-300 px-3 py-2 text-sm"
          >
            <Link to="/contact">
              Start Here <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
