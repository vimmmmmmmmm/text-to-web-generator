
import React, { useRef, useEffect, useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dracula } from '@codesandbox/sandpack-themes';
import AnimatedGradientBorder from '@/components/ui/AnimatedGradientBorder';

interface SandpackPreviewProps {
  files: Record<string, string>;
  dependencies?: Record<string, string>;
  entryFile?: string;
  className?: string;
  showFiles?: boolean;
}

const SandpackPreview: React.FC<SandpackPreviewProps> = ({
  files,
  dependencies = {},
  entryFile = '/App.tsx',
  className,
  showFiles = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [files]);

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {isLoading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      ) : (
        <AnimatedGradientBorder borderWidth={2} containerClassName="w-full">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              {showFiles && <TabsTrigger value="code">Code</TabsTrigger>}
            </TabsList>
            <TabsContent value="preview" className="rounded-xl overflow-hidden">
              <Sandpack
                template="react-ts"
                theme={dracula}
                options={{
                  showNavigator: false,
                  showTabs: false,
                  showLineNumbers: true,
                  editorHeight: 400,
                  externalResources: [
                    "https://cdn.tailwindcss.com",
                  ],
                }}
                files={files}
                customSetup={{
                  dependencies: {
                    "react": "latest",
                    "react-dom": "latest",
                    ...dependencies
                  },
                }}
              />
            </TabsContent>
            {showFiles && (
              <TabsContent value="code">
                <Sandpack
                  template="react-ts"
                  theme={dracula}
                  options={{
                    showNavigator: true,
                    showTabs: true,
                    showLineNumbers: true,
                    editorHeight: 500,
                    externalResources: [
                      "https://cdn.tailwindcss.com",
                    ],
                  }}
                  files={files}
                  customSetup={{
                    dependencies: {
                      "react": "latest",
                      "react-dom": "latest",
                      ...dependencies
                    },
                  }}
                />
              </TabsContent>
            )}
          </Tabs>
        </AnimatedGradientBorder>
      )}
    </div>
  );
};

export default SandpackPreview;
