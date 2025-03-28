
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
import { FiCode, FiEye, FiTerminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeMirror } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";

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
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "console">("code");
  
  // Function to get file extension
  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return javascript();
      case 'json':
        return json();
      case 'css':
        return css();
      case 'html':
        return html();
      default:
        return javascript();
    }
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border">
      <SandpackProvider
        theme={theme}
        template={template}
        files={code}
        options={{
          visibleFiles: options.visibleFiles,
          activeFile: options.activeFile,
        }}
      >
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "preview" | "code" | "console")}
          className="w-full"
        >
          <div className="flex justify-between items-center p-2 border-b border-border bg-muted/40">
            <FileTabs
              closableTabs={options.closableTabs}
              className="!bg-transparent"
            />
            <TabsList className="ml-auto">
              <TabsTrigger value="code" className="flex items-center gap-2">
                <FiCode size={14} /> Code
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <FiEye size={14} /> Preview
              </TabsTrigger>
              <TabsTrigger value="console" className="flex items-center gap-2">
                <FiTerminal size={14} /> Console
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="code" className="mt-0">
            <SandpackStack>
              <SandpackCodeEditor
                showLineNumbers={options.showLineNumbers}
                showInlineErrors={options.showInlineErrors}
                wrapContent={options.wrapContent}
                readOnly={options.readOnly}
                className="h-[500px] sm:h-[600px] md:h-[700px]"
              />
            </SandpackStack>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-0">
            <SandpackStack>
              <SandpackPreviewComponent
                showNavigator={options.showNavigator}
                className="h-[500px] sm:h-[600px] md:h-[700px]"
              />
            </SandpackStack>
          </TabsContent>
          
          <TabsContent value="console" className="mt-0">
            <SandpackStack>
              <SandpackConsole className="h-[500px] sm:h-[600px] md:h-[700px]" />
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
