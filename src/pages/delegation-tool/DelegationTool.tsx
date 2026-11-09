import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock, Link2, ShieldCheck } from "lucide-react";
import Seo from "@/components/ui/Seo";
import { Layout } from "@/components/layout/Layout";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { IntroStep } from "@/components/delegation-tool/IntroStep";
import { TaskStep } from "@/components/delegation-tool/TaskStep";
import { TeamStep } from "@/components/delegation-tool/TeamStep";
import { PracticeStep } from "@/components/delegation-tool/PracticeStep";
import { ResultStep } from "@/components/delegation-tool/ResultStep";
import {
  AuditProgress,
  cardClass,
  track,
} from "@/components/delegation-tool/shared";
import { GROUPS, TASK_COUNT } from "@/components/delegation-tool/data";
import useDelegationStore from "@/store/useDelegationStore";

export default function DelegationTool() {
  const { step, started, setStep, setField } = useDelegationStore();
  const [params] = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const r = params.get("ref");
      if (r && /^AL\d{3,5}$/.test(r)) sessionStorage.setItem("al_ref", r);
      setField({ refCode: sessionStorage.getItem("al_ref") });
    } catch {
      console.warn("Failed to read ref code from URL or sessionStorage");
    }
  }, [params, setField]);

  const goTo = (next: number) => {
    setStep(next);
    requestAnimationFrame(() =>
      cardRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }),
    );
  };

  const handleStart = () => {
    if (!started) {
      setField({ started: true });
      track("audit_start");
    }
    goTo(1);
  };

  const handleNext = () => {
    const { answers } = useDelegationStore.getState();
    const group = GROUPS[step - 1];
    track(
      `audit_step${step}_done`,
      group
        ? {
            tasks_ticked: group.tasks.filter(
              ([task]) => answers[task] === "me" || answers[task] === "team",
            ).length,
          }
        : {},
    );
    goTo(step + 1);
  };

  const handleBack = () => goTo(Math.max(0, step - 1));

  return (
    <Layout>
      <Seo
        title="Delegation Audit"
        description="A five-minute audit for Australian financial advisers: find the paraplanning and client support hours you could hand off, and compare hiring locally with a dedicated outsourced resource."
        keywords="delegation audit, paraplanning outsourcing, client service officer, financial adviser time audit, outsourced paraplanner"
        pathname="/resources/delegation-tool"
        schemaData={{
          "@type": "WebApplication",
          name: "Advice Lab Delegation Audit",
          url: "https://advicelab.com.au/resources/delegation-tool",
          applicationCategory: "BusinessApplication",
        }}
      />

      <div className="min-h-screen bg-background">
        <section className="pt-24 pb-32 gradient-primary">
          <div className="container mx-auto px-4 lg:px-8 flex justify-center">
            <ScrollAnimation animation="fade-up" className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6" />
              <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
                How many hours a week could you hand off?
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8 text-center">
                Work through {TASK_COUNT} everyday tasks in three short steps.
                See your paraplanning and client support hours separately, and
                the resource each one needs.
              </p>
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-primary-foreground/90">
                {[
                  { Icon: Clock, text: "About 5 minutes" },
                  { Icon: ShieldCheck, text: "No sign-up to see your result" },
                  { Icon: Link2, text: "Local hire vs Advice Lab, side by side" },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {text}
                  </li>
                ))}
              </ul>
            </ScrollAnimation>
          </div>
        </section>

        <div className="mx-auto -mt-16 max-w-5xl px-4 pb-16 md:-mt-20 md:pb-24">
          <div
            ref={cardRef}
            aria-live="polite"
            className={`${cardClass} scroll-mt-28 p-5 shadow-lg sm:p-8 md:p-10`}
          >
            <AuditProgress step={step} />
            {step === 0 && <IntroStep onStart={handleStart} />}
            {step >= 1 && step <= 3 && (
              <TaskStep
                key={step}
                index={step - 1}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}
            {step === 4 && (
              <TeamStep onBack={handleBack} onNext={handleNext} />
            )}
            {step === 5 && (
              <PracticeStep onBack={handleBack} onNext={handleNext} />
            )}
            {step === 6 && <ResultStep onBack={handleBack} />}
          </div>
        </div>
      </div>
    </Layout>
  );
}
