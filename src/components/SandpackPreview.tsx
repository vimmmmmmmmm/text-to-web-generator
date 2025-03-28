
import React, { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview as SandpackPreviewComponent,
  SandpackConsole,
  FileTabs,
  useSandpack,
  useActiveCode,
  SandpackStack,
} from "@codesandbox/sandpack-react";
import { Code, Eye, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SandpackPreviewProps = {
  code: Record<string, string>;
  theme?: "light" | "dark" | "auto";
  template?: "react" | "react-ts" | "vanilla" | "nextjs" | "vite" | "vite-react" | "vanilla-ts";
  options?: {
    showNavigator?: boolean;
    showLineNumbers?: boolean;
    showInlineErrors?: boolean;
    wrapContent?: boolean;
    readOnly?: boolean;
    showTabs?: boolean;
    closableTabs?: boolean;
    visibleFiles?: string[];
    activeFile?: string;
  };
  dependencies?: Record<string, string>;
  showFiles?: boolean;
  layout?: "split" | "preview-only" | "editor-only";
  autorun?: boolean;
  className?: string;
};

const SandpackPreview: React.FC<SandpackPreviewProps> = ({
  code,
  theme = "light",
  template = "vite",
  options = {
    showNavigator: true,
    showLineNumbers: true,
    showInlineErrors: true,
    wrapContent: true,
    readOnly: false,
    showTabs: true,
    closableTabs: false,
  },
  dependencies = {},
  showFiles = true,
  layout = "split",
  autorun = true,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "console">("code");
  
  // Create a customSetup object for dependencies
  const customSetup = {
    dependencies: dependencies,
    entry: "index.js"
  };

  return (
    <div className={cn("w-full h-full rounded-lg overflow-hidden border border-border", className)}>
      <SandpackProvider
        theme={theme}
        template={template}
        files={code}
        customSetup={customSetup}
        options={{
          visibleFiles: options.visibleFiles,
          activeFile: options.activeFile,
          recompileMode: autorun ? "immediate" : "delayed",
          recompileDelay: 500,
        }}
      >
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "preview" | "code" | "console")}
          className="w-full"
        >
          <div className="flex justify-between items-center p-2 border-b border-border bg-muted/40">
            {showFiles && (
              <FileTabs
                closableTabs={options.closableTabs}
                className="!bg-transparent"
              />
            )}
            <TabsList className="ml-auto">
              {layout !== "preview-only" && (
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code size={14} /> Code
                </TabsTrigger>
              )}
              {layout !== "editor-only" && (
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye size={14} /> Preview
                </TabsTrigger>
              )}
              <TabsTrigger value="console" className="flex items-center gap-2">
                <Terminal size={14} /> Console
              </TabsTrigger>
            </TabsList>
          </div>
          
          {layout !== "preview-only" && (
            <TabsContent value="code" className="mt-0">
              <SandpackStack>
                <SandpackCodeEditor
                  showLineNumbers={options.showLineNumbers}
                  showInlineErrors={options.showInlineErrors}
                  wrapContent={options.wrapContent}
                  readOnly={options.readOnly}
                  className="h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]"
                />
              </SandpackStack>
            </TabsContent>
          )}
          
          {layout !== "editor-only" && (
            <TabsContent value="preview" className="mt-0">
              <SandpackStack>
                <SandpackPreviewComponent
                  showNavigator={options.showNavigator}
                  className="h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]"
                />
              </SandpackStack>
            </TabsContent>
          )}
          
          <TabsContent value="console" className="mt-0">
            <SandpackStack>
              <SandpackConsole className="h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]" />
            </SandpackStack>
          </TabsContent>
        </Tabs>
        <Dependencies />
      </SandpackProvider>
    </div>
  );
};

const Dependencies = () => {
  const { sandpack } = useSandpack();
  const [dependencies, setDependencies] = useState<Record<string, string>>({});

  useEffect(() => {
    // Parse package.json to get dependencies
    try {
      if (sandpack.files['package.json']) {
        const packageJson = JSON.parse(sandpack.files['package.json'].code);
        if (packageJson.dependencies) {
          setDependencies(packageJson.dependencies);
        }
      }
    } catch (error) {
      console.error('Error parsing package.json:', error);
    }
  }, [sandpack.files]);

  if (Object.keys(dependencies).length === 0) return null;

  return (
    <div className="p-3 border-t border-border text-xs">
      <p className="font-medium mb-1">Dependencies:</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(dependencies).map(([name, version]) => (
          <span key={name} className="bg-muted px-2 py-1 rounded text-xs">
            {name}: {String(version)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SandpackPreview;
