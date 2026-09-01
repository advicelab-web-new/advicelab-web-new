import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "cookie-consent";

export type CookieConsentValue = "accepted" | "rejected" | null;

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for smooth animation
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 50);
      }, 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleRejectAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            {/* Icon and Content */}
            <div className="flex items-start gap-4 flex-1">
              <div className="hidden sm:flex w-12 h-12 rounded-full gradient-primary items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  We use cookies
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to enhance your
                  browsing experience, analyze site traffic, and personalize
                  content. By clicking "Accept All", you consent to our use of
                  cookies. You can also choose to reject non-essential cookies.
                  Read our{" "}
                  <Link
                    to="/cookies-policy"
                    className="text-primary hover:underline font-medium"
                  >
                    Cookies Policy
                  </Link>{" "}
                  to learn more.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                onClick={handleRejectAll}
                className="w-full sm:w-auto px-6 py-2 border-gray-300 hover:border-primary hover:bg-gray-100"
              >
                Reject All
              </Button>

              <Button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-6 py-2 gradient-primary text-white hover:opacity-90"
              >
                Accept All Cookies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function to check consent status
export function getCookieConsent(): CookieConsentValue {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (consent === "accepted") return "accepted";
  if (consent === "rejected") return "rejected";
  return null;
}

// Utility function to set consent (for external use if needed)
export function setCookieConsent(value: CookieConsentValue): void {
  if (value === null) {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  } else {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  }
}
