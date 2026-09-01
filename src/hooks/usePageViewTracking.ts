/**
 * usePageViewTracking Hook
 *
 * This custom hook automatically tracks page views whenever the route changes in a React Router application.
 * It listens to location changes and sends them to GA4.
 *
 * Usage:
 * Import and call this hook once in your App component to enable automatic page view tracking.
 *
 * Example:
 * ```
 * const App = () => {
 *   usePageViewTracking();
 *   return <Routes>...</Routes>
 * }
 * ```
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Hook to track page views automatically on route changes
 *
 * How it works:
 * 1. Listens to location changes from React Router
 * 2. When location changes, extracts the pathname
 * 3. Sends the page view to GA4 with the pathname and document title
 * 4. Works for single-page applications (SPAs) where page reloads don't happen
 *
 * This replaces the automatic page view tracking that typically happens
 * with traditional website navigation (full page reloads)
 */
export const usePageViewTracking = (): void => {
  const location = useLocation();

  useEffect(() => {
    // Track the page view whenever location changes
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);
};
