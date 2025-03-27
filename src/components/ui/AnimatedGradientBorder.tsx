
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderWidth?: number;
  animationDuration?: number;
  colors?: string[];
}

const AnimatedGradientBorder: React.FC<AnimatedGradientBorderProps> = ({
  children,
  className,
  containerClassName,
  borderWidth = 1,
  animationDuration = 8,
  colors = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899"],
}) => {
  return (
    <div className={cn("relative rounded-xl", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 rounded-xl",
          "bg-gradient-to-r",
          "animate-gradient-xy",
          `p-${borderWidth}`,
          className
        )}
        style={{
          backgroundSize: "400% 400%",
          backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
          animationDuration: `${animationDuration}s`,
        }}
      />
      <style>
        {`
          @keyframes gradient-xy {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient-xy {
            animation: gradient-xy var(--animation-duration, 8s) infinite;
          }
        `}
      </style>
      <div className="relative rounded-lg bg-background/80 backdrop-blur-sm h-full">
        {children}
      </div>
    </div>
  );
};

export default AnimatedGradientBorder;
