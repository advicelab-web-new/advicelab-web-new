import Seo from "@/components/ui/Seo";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Download,
  Calculator,
  FileText,
  ArrowRight,
} from "lucide-react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";
import { useBloggerPosts } from "@/hooks/useBloggerPosts";

const resources = [
  {
    icon: BookOpen,
    title: "Offshoring Guide",
    description:
      "Everything you need to know about starting with offshore support.",
    type: "Guide",
    link: "#",
  },
  {
    icon: Calculator,
    title: "Pricing Calculator",
    description: "Calculate your potential savings with our pricing tool.",
    type: "Tool",
    link: "#",
  },
  {
    icon: FileText,
    title: "Paraplanning Playbook",
    description: "Best practices for working with offshore paraplanning teams.",
    type: "Playbook",
    link: "#",
  },
  {
    icon: Download,
    title: "One Week Free Trial",
    description: "Try our paraplanning services free for one week.",
    type: "Offer",
    link: "/contact-us",
  },
];

const resourceAnchors = [
  "advisers-guide-for-outsourcing",
  "pricing-calculator",
  "accountants-offshoring-playbook",
  "virtual-cso-task-library",
  "smsf-trustee-education-kit",
];

const Blog = () => {
  const { posts, loading, error } = useBloggerPosts(24);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    setVisibleCount(Math.min(6, posts.length || 6));
  }, [posts.length]);

  const visiblePosts = posts.slice(0, visibleCount);
  const canShowMore = visibleCount < posts.length;

  return (
    <Layout>
      <Seo
        title="Blog"
        description="Guides, tools and insights to help advisers get the most from offshore support."
        pathname="/resources/blogs"
      />
      <div className="sr-only" aria-hidden>
        {resourceAnchors.map((id) => (
          <span key={id} id={id} />
        ))}
      </div>
      {/* Hero */}
      <section className="py-24 gradient-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <ScrollAnimation animation="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
              Blog
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto text-center">
              Guides, tools, and insights to help you get the most from offshore
              support.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Lead Magnets */}
      {/* <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-16">
              <span
                className="text-primary font-semibold uppercase tracking-wider tracking-tight"
              >
                Free Resources
              </span>
              <h2
                className="font-display font-bold mt-2 text-muted-foreground text-2xl md:text-3xl"
              >
                Download & Learn
              </h2>
            </div>
          </ScrollAnimation>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <ScrollAnimation
                key={index}
                animation="fade-up"
                delay={index * 100}
              >
                <Link
                  to={resource.link}
                  className="group block p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover-lift h-full"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                    <resource.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-medium text-primary uppercase">
                    {resource.type}
                  </span>
                  <h3 className="text-lg font-display font-bold mt-1 mb-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {resource.description}
                  </p>
                </Link>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section> */}

      {/* Blog */}
      <section id="blog" className="py-10 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollAnimation animation="fade-up">
            <div className="text-center mb-16">
              {/* <span
                className="text-primary font-semibold uppercase tracking-wider tracking-tight"
              >
                Blog
              </span> */}
              <h2 className="font-display font-bold mt-0 text-muted-foreground text-2xl md:text-3xl">
                Latest Insights
              </h2>
            </div>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            {loading &&
              Array.from({ length: 6 }).map((_, index) => (
                <ScrollAnimation
                  key={`skeleton-${index}`}
                  animation="fade-up"
                  delay={index * 120}
                >
                  <article className="bg-background rounded-2xl overflow-hidden border border-border h-full p-0">
                    <Skeleton className="aspect-[16/9] w-full" />
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </article>
                </ScrollAnimation>
              ))}

            {!loading && error && (
              <div className="md:col-span-3 bg-background rounded-2xl border border-border p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  We could not load the latest posts right now.
                </p>
                <Button asChild variant="outline">
                  <a
                    href="https://wishwanett.blogspot.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit the blog <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            )}

            {!loading && !error && posts.length === 0 && (
              <div className="md:col-span-3 bg-background rounded-2xl border border-border p-8 text-center text-muted-foreground">
                No posts found yet. Check back soon for fresh insights.
              </div>
            )}

            {!loading &&
              !error &&
              visiblePosts.map((post, index) => (
                <ScrollAnimation
                  key={post.id}
                  animation="fade-up"
                  delay={index * 120}
                >
                  <article className="bg-background rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition h-full flex flex-col group">
                    {post.thumbnail ? (
                      <div className="aspect-[16/9] overflow-hidden bg-secondary">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-secondary">
                        <div className="w-full h-full gradient-primary opacity-10" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-primary uppercase">
                          {post.category}
                        </span>
                        {post.published && (
                          <span className="text-xs text-muted-foreground">
                            {post.published}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-display font-bold">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm flex-1">
                        {post.excerpt}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto hover:gap-2 transition-all justify-start"
                        asChild
                      >
                        {post.slug ? (
                          <Link
                            to={`/blog/${post.slug}`}
                            aria-label={`Read ${post.title}`}
                          >
                            Read post <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Read ${post.title}`}
                          >
                            Read post <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                      </Button>
                    </div>
                  </article>
                </ScrollAnimation>
              ))}
          </div>
          {!loading && !error && canShowMore && (
            <div className="mt-10 flex justify-center">
              <Button
                size="lg"
                onClick={() =>
                  setVisibleCount((prev) => Math.min(prev + 6, posts.length))
                }
                className="px-8"
              >
                See more
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Case Studies */}
      {/* <section id="case-studies" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <ScrollAnimation animation="scale">
            <span
              className="text-primary font-semibold uppercase tracking-wider tracking-tight"
            >
              Case Studies
            </span>
            <h2
              className="font-display font-bold mt-2 mb-6 text-muted-foreground text-2xl md:text-3xl"
            >
              Success Stories
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              See how Australian advisors have transformed their practices with
              Advice Lab.
            </p>
            <Button
              size="lg"
              asChild
              className="hover:scale-105 transition-transform"
            >
              <Link to="/contact">
                Get Case Studies <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </ScrollAnimation>
        </div>
      </section> */}
    </Layout>
  );
};

export default Blog;
