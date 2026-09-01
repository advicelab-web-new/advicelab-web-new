import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePricingCalculator } from "@/hooks/usePricingCalculator";
import logo from "@/assets/advicelab-logo.webp";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about",
    children: [
      { name: "About Us", href: "/about-us" },
      { name: "Giving Back", href: "/giving-back" },
    ],
  },

  {
    name: "Services",
    href: "/services",
    children: [
      { name: "All Services", href: "/services" },
      { name: "Paraplanning", href: "/services/paraplanning" },
      { name: "Client Support Officers", href: "/services/clientsupport" },
      { name: "SMSF & Accounting", href: "/services/smsf-accounting" },
      { name: "Mortgage Support", href: "/services/mortgage-support" },
      // { name: "Digital Marketing", href: "/services/marketing" },
    ],
  },
  {
    name: "Resources",
    href: "/resources/blogs",
    children: [
      // {
      //   name: "Adviser's Guide for Outsourcing",
      //   href: "/resources#advisers-guide-for-outsourcing",
      // },
      // { name: "Pricing Calculator", href: "/resources#pricing-calculator" },
      // {
      //   name: "Accountant's Offshoring Playbook",
      //   href: "/resources#accountants-offshoring-playbook",
      // },
      // {
      //   name: "Virtual CSO Task Library",
      //   href: "/resources#virtual-cso-task-library",
      // },
      // {
      //   name: "SMSF Trustee Education Kit",
      //   href: "/resources#smsf-trustee-education-kit",
      // },
      { name: "Blog", href: "/resources/blogs" },
      {
        name: "Paraplanning Fee Calculator",
        href: "/resources/pricing-calculator",
      },
    ],
  },
  { name: "Careers", href: "/careers" },
  { name: "Contact Us", href: "/contact-us" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(
    null,
  );
  const { open: openPricingCalculator } = usePricingCalculator();
  const location = useLocation();

  const isActive = (href: string, parentName?: string) => {
    const path = location.pathname;

    // Home special case
    if (href === "/") return path === "/";

    // If this is the top-level "Services" menu
    if (href === "/services" && parentName === undefined) {
      // Highlight top-level "Services" if we're on /services or any child except "All Services"
      return path === "/services" || path.startsWith("/services/");
    }

    // If this is a child item
    if (parentName) {
      // Highlight child only if it's not "All Services" and matches path
      if (href === "/services") return path === "/services"; // All Services link only on /services
      return path === href;
    }

    // Default: highlight exact path
    return path === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <nav className="container mx-auto flex items-center justify-between py-[1.2em] px-4 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Advice Lab" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navigation.map((item) =>
            item.children ? (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                {openDropdown === item.name && (
                  <div className="absolute top-full left-0 pt-2 w-64">
                    <div className="bg-background rounded-2xl shadow-xl border border-border p-2 animate-fade-in">
                      {item.children.map((child) =>
                        child.name === "Paraplanning Fee Calculator" ? (
                          <button
                            key={child.name}
                            onClick={openPricingCalculator}
                            className={`block w-full text-left px-4 py-3 text-sm leading-[0.9rem] hover:bg-secondary rounded-xl transition-colors ${
                              isActive(child.href, item.name)
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                          >
                            {child.name}
                          </button>
                        ) : (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`block px-4 py-3 text-sm leading-[0.9rem] hover:bg-secondary rounded-xl transition-colors ${
                              isActive(child.href, item.name)
                                ? "text-primary font-semibold"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ),
          )}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Button size="sm" asChild className="w-40">
            <Link to="/contact-us">Get in Touch</Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="w-40">
            <Link to="/services">Explore Services</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Start */}
      <div
        className={`lg:hidden fixed top-[76px] left-0 right-0 bg-background border-t border-border transition-transform duration-300 ease-in-out ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto py-4 px-4 space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <button
                  className={`flex items-center justify-between w-full py-3 text-base font-medium ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() =>
                    setMobileDropdownOpen(
                      mobileDropdownOpen === item.name ? null : item.name,
                    )
                  }
                >
                  {item.name}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileDropdownOpen === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  to={item.href}
                  className={`block py-3 text-base font-medium ${
                    isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}
              {item.children && mobileDropdownOpen === item.name && (
                <div className="pl-4 space-y-1">
                  {item.children.map((child) =>
                    child.name === "Paraplanning Fee Calculator" ? (
                      <button
                        key={child.name}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          openPricingCalculator();
                        }}
                        className={`block w-full text-left py-2 text-sm leading-[0.9rem] transition-colors ${
                          isActive(child.href, item.name)
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        {child.name}
                      </button>
                    ) : (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={`block py-2 text-sm leading-[0.9rem] transition-colors ${
                          isActive(child.href, item.name)
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Button asChild>
              <Link to="/contact-us" onClick={() => setMobileMenuOpen(false)}>
                Get in Touch
              </Link>
            </Button>{" "}
            <Button variant="outline" asChild>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)}>
                Explore Services
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Menu End */}
    </header>
  );
}
