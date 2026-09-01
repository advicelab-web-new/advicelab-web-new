/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale"
    | "blur";
  delay?: number;
  className?: string;
  threshold?: number;
}

export function ScrollAnimation({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  threshold = 0.1,
}: ScrollAnimationProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  const getAnimationClasses = () => {
    const baseTransition = "transition-all duration-700 ease-out";
    const delayStyle = delay > 0 ? `delay-${delay}` : "";

    if (!isVisible) {
      switch (animation) {
        case "fade-up":
          return `${baseTransition} opacity-0 translate-y-12`;
        case "fade-down":
          return `${baseTransition} opacity-0 -translate-y-12`;
        case "fade-left":
          return `${baseTransition} opacity-0 translate-x-12`;
        case "fade-right":
          return `${baseTransition} opacity-0 -translate-x-12`;
        case "scale":
          return `${baseTransition} opacity-0 scale-90`;
        case "blur":
          return `${baseTransition} opacity-0 blur-sm`;
        default:
          return `${baseTransition} opacity-0 translate-y-12`;
      }
    }

    return `${baseTransition} ${delayStyle} opacity-100 translate-y-0 translate-x-0 scale-100 blur-0`;
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Stagger animation wrapper
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 100,
}: StaggerContainerProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`stagger-children ${isVisible ? "animate" : ""} ${className}`}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            style: {
              ...((child.props as any).style || {}),
              transitionDelay: `${index * staggerDelay}ms`,
            },
          });
        }
        return child;
      })}
    </div>
  );
}
