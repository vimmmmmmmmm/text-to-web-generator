
import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import GeminiLogo from "@/components/ui/GeminiLogo";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <GeminiLogo size={32} />
            <span className="font-bold text-xl">Text to Web</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Generator
            </Link>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            Powered by Google's Gemini AI and React with Tailwind CSS
          </p>
          <p>
            &copy; {new Date().getFullYear()} Text to Web Generator
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
