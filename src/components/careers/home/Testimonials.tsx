/* eslint-disable @typescript-eslint/no-explicit-any */
import { Quote, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ScrollAnimation } from "@/components/ui/ScrollAnimation";

import client1 from "@/assets/ClientImg/client1.webp";
import client2 from "@/assets/ClientImg/client2.webp";

const testimonials = [
  {
    quote:
      "We have grown our business from zero clients to several hundred clients in 3 ½ years thanks to the support we have from Advice Lab.",
    author: "Harry Flaskas",
    company: "Atlas Wealth Advisory",
    image: client2,
  },
  {
    quote:
      "Ever since we've partnered with Advice Lab, we've never looked back.",
    author: "Louella Jorge",
    company: "Principal Adviser - Discovery Wealth Advisers",
    image: client1,
  },
];

export function Testimonials() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section || hasAutoPlayed) return;

    // Intersection Observer to detect when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoPlayed) {
            // Auto-play muted when scrolled into view
            video.muted = true;
            video
              .play()
              .then(() => {
                setIsPlaying(true);
                setHasAutoPlayed(true);
              })
              .catch((err) => console.log("Autoplay prevented:", err));
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [hasAutoPlayed]);

  const handlePlayFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Unmute the video
      video.muted = false;

      // Request fullscreen
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if ((video as any).webkitRequestFullscreen) {
        // Safari
        await (video as any).webkitRequestFullscreen();
      } else if ((video as any).mozRequestFullScreen) {
        // Firefox
        await (video as any).mozRequestFullScreen();
      } else if ((video as any).msRequestFullscreen) {
        // IE/Edge
        await (video as any).msRequestFullscreen();
      }

      // Play from beginning with sound
      video.currentTime = 0;
      await video.play();
      setIsFullscreen(true);
      setIsPlaying(true);
    } catch (err) {
      console.log("Fullscreen error:", err);
      // Fallback: just unmute and play if fullscreen fails
      video.muted = false;
      video.currentTime = 0;
      video.play();
      setIsPlaying(true);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);

      // If exiting fullscreen, mute and pause
      if (!isCurrentlyFullscreen && videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation animation="fade-up">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary font-semibold uppercase tracking-wider text-xs sm:text-sm rounded-full mb-3 sm:mb-4">
              Customer Reviews
            </span>
            <h2 className="font-display font-bold text-muted-foreground mt-2 mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl px-4">
              What Our Clients Say
            </h2>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center">
          {/* Left Side - Client Testimonials */}
          <ScrollAnimation animation="fade-right">
            <div className="space-y-4 sm:space-y-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-5 sm:p-6 md:p-8 bg-muted/50 rounded-2xl sm:rounded-3xl border border-border backdrop-blur-sm hover-lift relative overflow-hidden"
                >
                  {/* Decorative Quote Icon */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-primary/10">
                    <Quote
                      size={40}
                      className="sm:w-[50px] sm:h-[50px]"
                      fill="currentColor"
                    />
                  </div>

                  {/* Quote */}
                  <p className="text-foreground text-sm sm:text-base md:text-lg mb-5 sm:mb-6 md:mb-8 leading-relaxed relative z-10 pr-10 sm:pr-12">
                    "{testimonial.quote}"
                  </p>

                  {/* Author Info with Image */}
                  <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                    {/* Profile Image */}
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      loading="lazy"
                      decoding="async"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg flex-shrink-0 ring-2 ring-primary/20"
                    />

                    {/* Author Details */}
                    <div>
                      <p className="font-semibold text-foreground text-sm sm:text-base">
                        {testimonial.author}
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollAnimation>

          {/* Right Side - Video */}
          <ScrollAnimation animation="fade-left">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover-lift mt-6 lg:mt-0 group">
              <div className="aspect-video w-full relative">
                <video
                  ref={videoRef}
                  id="testimonial-video"
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  // poster={clientVideoPoster}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source
                    src="/discovery-wealth-advisers.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Play Button Overlay - Shows when not in fullscreen */}
                {!isFullscreen && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer transition-all duration-300 group-hover:bg-black/30"
                    onClick={handlePlayFullscreen}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/90 hover:shadow-primary/50">
                      <Play
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white ml-1"
                        fill="white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
