
import { Link } from "react-router-dom";
import GeminiLogo from "@/components/ui/GeminiLogo";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <GeminiLogo size={32} animated={false} />
              <span className="font-bold text-xl tracking-tight">Gemini Web Builder</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Create beautiful web applications with AI. Just describe what you want, and our platform will build it for you.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Testimonials</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Guides</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">API Reference</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Examples</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Gemini Web Builder. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
