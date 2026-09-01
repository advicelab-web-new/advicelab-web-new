import { Button } from "@/components/ui/button";
import { usePricingCalculator } from "@/hooks/usePricingCalculator";
import { Calculator, ArrowRight, CheckCircle } from "lucide-react";

export function PricingCalculatorCTALeftSection() {
  const { open: openPricingCalculator } = usePricingCalculator();

  return (
    <section className="py-16 flex justify-center items-center">
      <div className="w-full max-w-xl px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          {/* Header */}
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

          {/* Description */}
          <div className="space-y-4 mb-8">
            <p className="text-muted-foreground leading-relaxed">
              Whether you need a simple or complex SOA, use our calculator to:
            </p>

            <ul className="space-y-3">
              {[
                "Compare regular vs urgent SOA & ROA",
                "Estimate cost for single or multiple strategies",
                "Plan your monthly paraplanning budget",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full h-14 gradient-primary text-white font-semibold rounded-xl group shadow-lg hover:opacity-90 transition"
            onClick={openPricingCalculator}
          >
            <Calculator className="mr-2 w-5 h-5" />
            Go to the Pricing Calculator
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-xs text-muted-foreground/60 mt-4">
            Free to use
          </p>
        </div>
      </div>
    </section>
  );
}
