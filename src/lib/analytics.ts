/**
 * Google Analytics 4 - Manual Implementation Utility
 *
 * This file provides utility functions to interact with GA4 without using third-party packages.
 * Uses the global `gtag` function injected by the GA4 script in index.html
 *
 * Measurement ID: G-3P9VQDR324
 */

/**
 * Type definition for gtag function
 * Window.gtag is injected by the Google Analytics script
 */
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Initialize GA4 tracking
 * This is automatically called by the script in index.html
 * But you can use this function for any initialization needs
 */
export const initializeAnalytics = (): void => {
  if (typeof window !== "undefined" && !window.gtag) {
    console.warn(
      "GA4 script not loaded. Make sure the script tag is in your HTML.",
    );
  }
};

/**
 * Track a page view event
 * Called automatically when route changes, but can be used for manual tracking
 *
 * @param path - The page path (e.g., '/about', '/services/paraplanning')
 * @param title - Optional page title (defaults to document.title)
 */
export const trackPageView = (path: string, title?: string): void => {
  if (typeof window === "undefined" || !window.gtag) {
    console.warn("GA4 is not available");
    return;
  }

  try {
    window.gtag("event", "page_view1", {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("📊 GA4 Page View Tracked:", {
        path,
        title: title || document.title,
      });
    }
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
};

/**
 * Track custom events
 * Use this for tracking specific user interactions (button clicks, form submissions, etc.)
 *
 * @param eventName - Name of the event (e.g., 'contact_form_submitted', 'cta_clicked')
 * @param eventData - Object containing event parameters
 *
 * Example:
 * trackEvent('contact_form_submitted', { form_type: 'contact_us', submitted_at: new Date().toISOString() })
 */
export const trackEvent = (
  eventName: string,
  eventData?: Record<string, any>,
): void => {
  if (typeof window === "undefined" || !window.gtag) {
    console.warn("GA4 is not available");
    return;
  }

  try {
    window.gtag("event", eventName, {
      ...eventData,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("📊 GA4 Event Tracked:", { eventName, data: eventData });
    }
  } catch (error) {
    console.error("Error tracking event:", error);
  }
};

/**
 * Track click event
 * Use this when a user clicks on a button or link
 *
 * @param elementName - Name/identifier of the clicked element (e.g., 'cta_button', 'contact_link')
 */
export const trackClick = (elementName: string): void => {
  trackEvent("click", {
    element_name: elementName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track form submission
 * Use this when a form is submitted
 *
 * @param formName - Name of the form (e.g., 'contact_form', 'newsletter_signup')
 * @param additionalData - Any additional data to track with the form submission
 */
export const trackFormSubmission = (
  formName: string,
  additionalData?: Record<string, any>,
): void => {
  trackEvent("form_submit", {
    form_name: formName,
    timestamp: new Date().toISOString(),
    ...additionalData,
  });
};

/**
 * Track button click with custom data
 *
 * @param buttonName - Name of the button
 * @param additionalData - Any additional data to track
 */
export const trackButtonClick = (
  buttonName: string,
  additionalData?: Record<string, any>,
): void => {
  trackEvent("button_click", {
    button_name: buttonName,
    timestamp: new Date().toISOString(),
    ...additionalData,
  });
};

/**
 * Set user ID for tracking
 * Use this when a user logs in or is identified
 *
 * @param userId - Unique identifier for the user (can be email, ID, etc.)
 */
export const setUserId = (userId: string): void => {
  if (typeof window === "undefined" || !window.gtag) {
    console.warn("GA4 is not available");
    return;
  }

  try {
    window.gtag("config", "G-3P9VQDR324", {
      user_id: userId,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("📊 GA4 User ID Set:", userId);
    }
  } catch (error) {
    console.error("Error setting user ID:", error);
  }
};

/**
 * Track scroll depth
 * Use this to track how far users scroll on a page
 *
 * @param scrollPercentage - Percentage of page scrolled (0-100)
 */
export const trackScrollDepth = (scrollPercentage: number): void => {
  trackEvent("scroll_depth", {
    scroll_percentage: Math.round(scrollPercentage),
  });
};

/**
 * Track time on page
 * Use this to track how long users spend on a page
 *
 * @param seconds - Number of seconds spent on the page
 */
export const trackTimeOnPage = (seconds: number): void => {
  trackEvent("time_on_page", {
    seconds: Math.round(seconds),
  });
};

/**
 * Track conversion/goal completion
 * Use this when a user completes a desired action (e.g., form submission, purchase, signup)
 *
 * @param goalName - Name of the goal (e.g., 'contact_form_completed', 'subscribe')
 * @param goalValue - Optional value associated with the goal
 */
export const trackConversion = (goalName: string, goalValue?: number): void => {
  trackEvent("conversion", {
    goal_name: goalName,
    goal_value: goalValue,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Clear all analytics data and reset
 * Use cautiously - typically not recommended for production
 */
export const clearAnalyticsData = (): void => {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  try {
    if (window.dataLayer) {
      window.dataLayer = [];
    }
    if (process.env.NODE_ENV === "development") {
      console.log("📊 GA4 Data Cleared");
    }
  } catch (error) {
    console.error("Error clearing analytics data:", error);
  }
};
