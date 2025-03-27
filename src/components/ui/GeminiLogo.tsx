
import React from "react";

interface GeminiLogoProps {
  size?: number;
  className?: string;
}

const GeminiLogo: React.FC<GeminiLogoProps> = ({ size = 24, className = "" }) => {
  return (
    <div className={`flex items-center justify-center relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]" style={{ padding: size * 0.1 }}>
        <div className="bg-[#4285F4] rounded-tl-full"></div>
        <div className="bg-[#EA4335] rounded-tr-full"></div>
        <div className="bg-[#FBBC05] rounded-bl-full"></div>
        <div className="bg-[#34A853] rounded-br-full"></div>
      </div>
    </div>
  );
};

export default GeminiLogo;
