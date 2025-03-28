
import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Terminal, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import TypingAnimation from "@/components/TypingAnimation";

interface LiveCodeGenerationProps {
  isGenerating: boolean;
  generationSteps: string[];
  currentStep: number;
  codeSnippets: string[];
  className?: string;
}

const LiveCodeGeneration: React.FC<LiveCodeGenerationProps> = ({
  isGenerating,
  generationSteps,
  currentStep,
  codeSnippets,
  className
}) => {
  const [displayedSnippet, setDisplayedSnippet] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isGenerating && codeSnippets.length > 0) {
      const interval = setInterval(() => {
        setDisplayedSnippet(codeSnippets[Math.floor(Math.random() * codeSnippets.length)]);
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating, codeSnippets]);
  
  useEffect(() => {
    // Auto-scroll terminal
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentStep]);

  return (
    <Card className={cn("border border-border/50", className)}>
      <div className="bg-muted/30 p-2 border-b flex items-center">
        <Terminal className="mr-2 h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Live Code Generation</span>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          {generationSteps.slice(0, currentStep + 1).map((step, index) => (
            <div 
              key={index} 
              className={cn(
                "flex items-center text-sm",
                index < currentStep ? "text-muted-foreground" : "text-foreground font-medium"
              )}
            >
              {index < currentStep ? (
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
              )}
              {step}
            </div>
          ))}
        </div>
        
        {isGenerating && (
          <div ref={terminalRef} className="mt-4 bg-gray-900 rounded-lg p-3 h-[200px] overflow-auto">
            <div className="flex items-center mb-2 text-gray-400 text-sm border-b border-gray-800 pb-1">
              <Terminal className="mr-2 h-3 w-3" />
              <span>Terminal</span>
            </div>
            
            <div className="font-mono text-xs text-gray-300 space-y-1">
              <div className="text-green-400">$ npm install dependencies</div>
              <div className="text-gray-400">Installing packages...</div>
              <div className="text-gray-400">+ react@18.2.0</div>
              <div className="text-gray-400">+ react-dom@18.2.0</div>
              <div className="text-gray-400">+ tailwindcss@3.3.0</div>
              <div className="text-green-400">$ creating project files</div>
              <div className="text-gray-400">- Created /src/index.js</div>
              <div className="text-gray-400">- Created /src/App.jsx</div>
              <div className="text-gray-400">- Created /src/components/</div>
              <div className="text-green-400">$ configuring tailwind</div>
              <div className="text-green-400">$ generating components</div>
            </div>
            
            {displayedSnippet && (
              <div className="mt-3 p-2 bg-gray-800 rounded border border-gray-700">
                <div className="flex items-center text-xs text-gray-400 mb-1">
                  <span className="text-blue-400">Generating:</span> {" "}
                  <span className="ml-1 bg-blue-900/30 px-1 rounded">App.jsx</span>
                </div>
                <TypingAnimation 
                  text={displayedSnippet}
                  className="text-xs text-green-300 font-mono whitespace-pre-wrap"
                  speed={5}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveCodeGeneration;
