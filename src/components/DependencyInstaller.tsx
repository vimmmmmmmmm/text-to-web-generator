
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DependencyInstallerProps {
  dependencies: Record<string, string>;
  isInstalling: boolean;
  onComplete?: () => void;
  className?: string;
}

const DependencyInstaller: React.FC<DependencyInstallerProps> = ({
  dependencies,
  isInstalling,
  onComplete,
  className
}) => {
  const [installedDeps, setInstalledDeps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const depsList = Object.keys(dependencies);
  
  useEffect(() => {
    if (isInstalling && depsList.length > 0) {
      let currentIndex = 0;
      
      const installInterval = setInterval(() => {
        if (currentIndex < depsList.length) {
          setInstalledDeps(prev => [...prev, depsList[currentIndex]]);
          setProgress(Math.floor(((currentIndex + 1) / depsList.length) * 100));
          currentIndex++;
        } else {
          clearInterval(installInterval);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, 800);
      
      return () => clearInterval(installInterval);
    }
  }, [isInstalling, depsList, onComplete]);
  
  if (!isInstalling && installedDeps.length === 0) return null;
  
  return (
    <Card className={cn("border border-border/50 p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Package className="mr-2 h-5 w-5 text-primary" />
          <h3 className="font-medium">Installing Dependencies</h3>
        </div>
        {isComplete ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
      </div>
      
      <Progress value={progress} className="h-2 mb-4" />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {depsList.map((dep, index) => {
          const isInstalled = installedDeps.includes(dep);
          
          return (
            <div 
              key={dep}
              className={cn(
                "flex items-center gap-2 text-xs p-2 rounded-md border",
                isInstalled 
                  ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900" 
                  : "border-muted bg-muted/10"
              )}
            >
              {isInstalled ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              )}
              <span className={isInstalled ? "font-medium" : "text-muted-foreground"}>
                {dep}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DependencyInstaller;
