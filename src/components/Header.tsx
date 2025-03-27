
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GeminiLogo from "@/components/ui/GeminiLogo";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Examples", href: "#examples" },
    { label: "Documentation", href: "#docs" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 backdrop-blur-lg",
        scrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <GeminiLogo size={32} />
          <span className="font-bold text-xl tracking-tight">Gemini Web Builder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Button>Get Started</Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-accent transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg absolute top-full left-0 right-0 border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground/80 hover:text-foreground py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
