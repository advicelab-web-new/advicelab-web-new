import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";

const SubmitResume = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 gradient-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollAnimation animation="fade-up">
            <Button
              variant="ghost"
              onClick={() => navigate("/careers")}
              className="mb-6 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
            </Button>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Submit Your Resume
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl">
              Don't see the right role? Send us your resume and we'll keep you
              in mind for future opportunities.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Form Section */}
      <section id="submit-resume-content" className="py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <ScrollAnimation animation="fade-up">
              <div className="bg-background rounded-2xl border border-border p-8">
                <ApplicationForm
                  jobTitle="General Application"
                  jobId="general"
                  onClose={() => navigate("/careers")}
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SubmitResume;
