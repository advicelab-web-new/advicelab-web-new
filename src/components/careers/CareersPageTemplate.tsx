import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, ArrowRight, ArrowLeft, Filter } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import jobVacancies from "../../data/jobVacancies.json";

interface CareersPageProps {
  pageTitle: string;
  pageDescription: string;
  location: string;
  backLink: string;
  locationShowcase: string;
}

interface Job {
  id: string;
  title: string;
  location: string;
  locationType: string;
  type: string;
  category: string;
  isActive: boolean;
  description?: string;
  aboutTheRole: string;
  datePosted?: string;
  keyResponsibilities: Array<string | { title: string; items: string[] }>;
  skillsWeAreLookingFor?: string[];
  mustHaves: string[];
  skillsWeValue?: string[];
  benefits: string[];
}

export const CareersPageTemplate = ({
  pageTitle,
  pageDescription,
  location,
  backLink,
  locationShowcase,
}: CareersPageProps) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter jobs by location and active status
  const locationJobs = useMemo(
    () =>
      (jobVacancies as Job[]).filter(
        (job) =>
          job.location.toLowerCase() === location.toLowerCase() && job.isActive,
      ),
    [location],
  );

  // Get unique categories and types
  // const categories = useMemo(() => {
  //   return Array.from(new Set(locationJobs.map((job) => job.category))).sort();
  // }, [locationJobs]);

  // const jobTypes = useMemo(() => {
  //   return Array.from(new Set(locationJobs.map((job) => job.type))).sort();
  // }, [locationJobs]);
  const jobTypes = ["Full Time", "Part Time"];
  const categories = [
    "Admin Services",
    "Client Support Services",
    "Digital Marketing",
    "Financial Paraplanner",
    "Financial Planning Assistant",
    "HR",
    "Internship Program",
    "Paraplanning",
    "Review Associate",
    "Mortgage",
    "Accounting",
  ];

  // Filter jobs based on all criteria and sort by datePosted (newest first)
  const filteredJobs = useMemo(() => {
    const filtered = locationJobs.filter((job) => {
      const categoryMatch =
        categoryFilter === "all" || job.category === categoryFilter;
      const typeMatch = typeFilter === "all" || job.type === typeFilter;

      return categoryMatch && typeMatch;
    });

    return filtered.sort((a, b) => {
      const aDate = a.datePosted ? new Date(a.datePosted).getTime() : 0;
      const bDate = b.datePosted ? new Date(b.datePosted).getTime() : 0;
      return bDate - aDate;
    });
  }, [locationJobs, categoryFilter, typeFilter]);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollAnimation animation="fade-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-4 sm:mb-6">
              {pageTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto px-4">
              {pageDescription}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Filter and Jobs Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-sm rounded-full mb-4">
                Opportunities
              </span>
              <h2 className="font-display font-bold mt-2 text-muted-foreground text-xl sm:text-2xl md:text-3xl">
                Open Positions in {locationShowcase}
              </h2>
            </div>
          </ScrollAnimation>

          {/* Filters Section */}
          <div className="max-w-6xl mx-auto mb-8 sm:mb-10 md:mb-12">
            <ScrollAnimation animation="fade-up" delay={100}>
              <div className="bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h3 className="font-bold text-base sm:text-lg">Filter by</h3>
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Job Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Job Category
                    </label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Job Type Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Job Type
                    </label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Button */}
                  <div className="flex items-end">
                    {(categoryFilter !== "all" || typeFilter !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCategoryFilter("all");
                          setTypeFilter("all");
                        }}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Jobs List */}
          <div className="max-w-6xl mx-auto">
            {filteredJobs.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {filteredJobs.map((job, index) => (
                  <ScrollAnimation
                    key={job.id}
                    animation="fade-up"
                    delay={(index + 1) * 100}
                  >
                    <div className="p-4 sm:p-5 md:p-6 bg-background rounded-xl sm:rounded-2xl border border-border hover:border-primary/30 hover-lift flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-display font-bold mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {job.locationType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {job.category}
                          </span>
                          <span className="inline-block px-2 sm:px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        asChild
                        size="sm"
                        className="hover:scale-105 transition-transform whitespace-nowrap w-full sm:w-auto"
                      >
                        <Link to={`/careers/job/${job.id}`}>
                          View & Apply <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </ScrollAnimation>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-base sm:text-lg mb-4">
                  No jobs found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategoryFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="hover:scale-105 transition-transform"
            >
              <Link to={backLink}>
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Careers
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
