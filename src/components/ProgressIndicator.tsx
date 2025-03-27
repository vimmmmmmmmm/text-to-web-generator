
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  isGenerating: boolean;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  isGenerating, 
  className 
}) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (isGenerating) {
      setProgress(0);
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          // Slow down progress as it approaches 90%
          if (prev < 30) return prev + 2;
          if (prev < 60) return prev + 1.5;
          if (prev < 80) return prev + 0.8;
          if (prev < 90) return prev + 0.3;
          return prev;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      // Complete the progress when generation is done
      setProgress(100);
      
      // Reset after animation completes
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isGenerating]);
  
  if (!isGenerating && progress === 0) return null;
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      <Progress value={progress} className="h-1.5 w-full" />
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {progress < 100 
            ? "Generating code..." 
            : "Generation complete!"}
        </p>
        <p className="text-xs font-medium">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};

export default ProgressIndicator;
