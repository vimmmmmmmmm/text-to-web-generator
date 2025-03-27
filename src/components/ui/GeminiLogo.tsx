
import React from "react";
import { cn } from "@/lib/utils";

interface GeminiLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

const GeminiLogo: React.FC<GeminiLogoProps> = ({ 
  className,
  size = 48,
  animated = true 
}) => {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <div 
        className={cn(
          "absolute rounded-full", 
          animated ? "animate-pulse-slow" : "",
          "bg-gem-blue"
        )} 
        style={{ 
          width: size * 0.45, 
          height: size * 0.45, 
          top: 0, 
          left: 0 
        }}
      />
      <div 
        className={cn(
          "absolute rounded-full", 
          animated ? "animate-pulse-slow animation-delay-150" : "",
          "bg-gem-red"
        )} 
        style={{ 
          width: size * 0.45, 
          height: size * 0.45, 
          top: 0, 
          right: 0 
        }}
      />
      <div 
        className={cn(
          "absolute rounded-full", 
          animated ? "animate-pulse-slow animation-delay-300" : "",
          "bg-gem-yellow"
        )} 
        style={{ 
          width: size * 0.45, 
          height: size * 0.45, 
          bottom: 0, 
          left: 0 
        }}
      />
      <div 
        className={cn(
          "absolute rounded-full", 
          animated ? "animate-pulse-slow animation-delay-450" : "",
          "bg-gem-green"
        )} 
        style={{ 
          width: size * 0.45, 
          height: size * 0.45, 
          bottom: 0, 
          right: 0 
        }}
      />
    </div>
  );
};

export default GeminiLogo;
