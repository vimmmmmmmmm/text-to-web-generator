
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
  className = "",
  containerClassName = "",
  borderWidth = 1,
  animationDuration = 3,
  colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"]
}) => {
  return (
    <div className={cn("relative", containerClassName)}>
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(90deg, ${colors.join(", ")})`,
          backgroundSize: "300% 300%",
          animation: `gradient ${animationDuration}s ease infinite`,
          padding: borderWidth,
          borderRadius: "inherit",
        }}
      />
      <div
        className={cn(
          "relative rounded-xl bg-background",
          className
        )}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes gradient {
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
      `}</style>
    </div>
  );
};

export default AnimatedGradientBorder;
