
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Github } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import GeminiLogo from "@/components/ui/GeminiLogo";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <GeminiLogo size={32} />
            <span className="font-bold text-xl">Text to Web</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/generator"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/generator" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Generator
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <ModeToggle />
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
