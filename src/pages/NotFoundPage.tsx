
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedGradientBorder from "@/components/ui/AnimatedGradientBorder";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <AnimatedGradientBorder>
              <div className="p-8 rounded-xl bg-background">
                <h1 className="text-9xl font-bold text-gray-200">404</h1>
                <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  The page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                  <Button>Return Home</Button>
                </Link>
              </div>
            </AnimatedGradientBorder>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;
