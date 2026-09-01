import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { ArrowRight, Clock, DollarSign, TrendingUp, Users, Zap } from "lucide-react";

interface ParaplanningCalculatorProps {
  onContactOpen?: () => void;
}

const HOURLY_RATE = 120; // avg AU adviser hourly rate
const HOURS_PER_SOA = 4; // avg hours to write one SOA in-house
const ADVICELAB_COST_PER_SOA = 180; // AdviceLab cost per SOA
const WEEKS_PER_YEAR = 48;

export function ParaplanningCalculator({ onContactOpen }: ParaplanningCalculatorProps) {
  const [soasPerWeek, setSoasPerWeek] = useState(5);
  const [advisers, setAdvisers] = useState(1);
  const [calculated, setCalculated] = useState(false);

  const results = useMemo(() => {
    const totalSoasPerYear = soasPerWeek * advisers * WEEKS_PER_YEAR;
    const inHouseCostPerYear = totalSoasPerYear * HOURS_PER_SOA * HOURLY_RATE;
    const adviceLabCostPerYear = totalSoasPerYear * ADVICELAB_COST_PER_SOA;
    const annualSavings = inHouseCostPerYear - adviceLabCostPerYear;
    const hoursReclaimed = totalSoasPerYear * HOURS_PER_SOA;
    const weeksReclaimed = Math.round(hoursReclaimed / 40);
    const savingsPct = Math.round((annualSavings / inHouseCostPerYear) * 100);

    return {
      totalSoasPerYear,
      inHouseCostPerYear,
      adviceLabCostPerYear,
      annualSavings,
      hoursReclaimed,
      weeksReclaimed,
      savingsPct,
    };
  }, [soasPerWeek, advisers]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollAnimation animation="fade-up" className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary font-semibold uppercase tracking-widest text-xs rounded-full mb-4 border border-primary/30">
            Savings Calculator
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            See What You Could{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Save & Reclaim
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Adjust the inputs to see how much time and money outsourcing your paraplanning could return to your practice.
          </p>
        </ScrollAnimation>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          {/* ── LEFT: Controls ── */}
          <ScrollAnimation animation="fade-up" delay={100}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-8">
              <h3 className="text-white font-display font-bold text-xl">Your Practice</h3>

              {/* SOAs per week slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    SOAs per week
                  </label>
                  <span className="text-2xl font-bold text-white tabular-nums">{soasPerWeek}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={soasPerWeek}
                    onChange={(e) => { setSoasPerWeek(Number(e.target.value)); setCalculated(true); }}
                    className="w-full h-2 appearance-none rounded-full cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--primary, #2563eb) 0%, var(--primary, #2563eb) ${((soasPerWeek - 1) / 29) * 100}%, rgba(255,255,255,0.15) ${((soasPerWeek - 1) / 29) * 100}%, rgba(255,255,255,0.15) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                    <span>1</span><span>30</span>
                  </div>
                </div>
              </div>

              {/* Advisers slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Number of advisers
                  </label>
                  <span className="text-2xl font-bold text-white tabular-nums">{advisers}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={advisers}
                    onChange={(e) => { setAdvisers(Number(e.target.value)); setCalculated(true); }}
                    className="w-full h-2 appearance-none rounded-full cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, var(--primary, #2563eb) 0%, var(--primary, #2563eb) ${((advisers - 1) / 19) * 100}%, rgba(255,255,255,0.15) ${((advisers - 1) / 19) * 100}%, rgba(255,255,255,0.15) 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                    <span>1</span><span>20</span>
                  </div>
                </div>
              </div>

              {/* Assumptions note */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Assumptions</p>
                {[
                  ["Avg. adviser hourly rate", "$120 / hr"],
                  ["Time per SOA (in-house)", "4 hrs"],
                  ["AdviceLab cost per SOA", "$180"],
                  ["Working weeks per year", "48"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-xs text-gray-500">
                    <span>{label}</span>
                    <span className="text-gray-300 font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={onContactOpen}
                className="w-full gradient-primary text-primary-foreground font-semibold h-12 rounded-xl text-sm tracking-wide group"
              >
                Get a Custom Quote
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </ScrollAnimation>

          {/* ── RIGHT: Results ── */}
          <ScrollAnimation animation="fade-up" delay={200}>
            <div className="space-y-4">
              {/* Annual savings — hero card */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-primary-foreground/70 text-sm font-semibold uppercase tracking-widest">
                      Estimated Annual Savings
                    </p>
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-5xl font-display font-bold text-white mt-1">
                    {fmt(results.annualSavings)}
                  </p>
                  <p className="text-primary-foreground/60 text-sm mt-2">
                    That's a <span className="text-white font-bold">{results.savingsPct}%</span> reduction vs. in-house resourcing
                  </p>

                  {/* Comparison bar */}
                  <div className="mt-5 space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-primary-foreground/60">
                        <span>In-house cost</span>
                        <span className="text-white">{fmt(results.inHouseCostPerYear)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                        <div className="h-full rounded-full bg-white/60 w-full" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-primary-foreground/60">
                        <span>AdviceLab cost</span>
                        <span className="text-white">{fmt(results.adviceLabCostPerYear)}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white transition-all duration-700 ease-out"
                          style={{ width: `${(results.adviceLabCostPerYear / results.inHouseCostPerYear) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat cards row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-3xl font-display font-bold text-white">
                    {results.hoursReclaimed.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider font-semibold">
                    Hours reclaimed / yr
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-display font-bold text-white">
                    {results.weeksReclaimed}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider font-semibold">
                    Weeks freed up
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                  </div>
                  <p className="text-3xl font-display font-bold text-white">
                    {results.totalSoasPerYear.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider font-semibold">
                    SOAs per year
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-3xl font-display font-bold text-white">
                    {advisers}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider font-semibold">
                    Adviser{advisers !== 1 ? "s" : ""} supported
                  </p>
                </div>
              </div>

              {/* Nudge text */}
              <p className="text-center text-gray-500 text-xs leading-relaxed px-2">
                Estimates based on industry averages. Actual savings vary by practice.{" "}
                <button
                  onClick={onContactOpen}
                  className="text-primary hover:underline font-medium"
                >
                  Talk to us for a tailored quote.
                </button>
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Slider thumb styles */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.4);
          cursor: pointer;
          transition: box-shadow 0.2s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 5px rgba(37,99,235,0.3);
        }
        input[type=range]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: none;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.4);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
