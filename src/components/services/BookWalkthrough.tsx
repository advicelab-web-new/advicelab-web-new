import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Clock, FileClock } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { useState } from "react";
import { ContactPopup } from "../ui/ContactPopup";

const BookWalkthrough = () => {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-primary to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimation animation="fade-up">
            <span className="inline-block px-4 py-2 bg-white/10 text-white font-semibold uppercase tracking-wider text-sm rounded-full mb-6 backdrop-blur-sm">
              Take the First Step
            </span>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={100}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
              Book a Personalised Walkthrough
            </h2>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={200}>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover how Advice Lab can transform your practice operations.
              Schedule a free, no-obligation walkthrough with our team to
              explore tailored solutions that match your specific needs and
              goals.
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={300}>
            {/* Benefits list */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {[
                { icon: Clock, text: "30-minute session" },
                { icon: Calendar, text: "Flexible Scheduling" },
                { icon: FileClock, text: "Book at Your Convenience" },
                // { icon: Users, text: "Meet our experts" },
                // { icon: Video, text: "Virtual or in-person" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <item.icon className="w-4 h-4 text-white/80" />
                  <span className="text-white/90 text-sm font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={400}>
            <Button
              size="lg"
              variant="white"
              className="hover:scale-105 transition-transform group text-lg px-8 py-6"
              onClick={() => setIsContactPopupOpen(true)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Take Your Walkthrough
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={500}>
            <p className="text-white/60 text-sm mt-6">
              No commitment required • Free consultation • Actionable advice
            </p>
          </ScrollAnimation>
        </div>
      </div>
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
};

export default BookWalkthrough;
