
import React, { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackPreview as SandpackPreviewComponent,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackFileExplorer,
  useSandpack,
  SandpackConsole,
  SandpackFiles,
  SandpackStack,
  SandpackThemeProvider,
  SandpackTheme,
  useSandpackNavigation,
} from "@codesandbox/sandpack-react";
import { nightOwl, githubLight } from "@codesandbox/sandpack-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, Maximize2, Minimize2, Play, File, Code, Terminal, Layout, Settings, Monitor } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface SandpackPreviewProps {
  files: Record<string, string>;
  dependencies?: Record<string, string>;
  className?: string;
  showFiles?: boolean;
  layout?: "preview-only" | "split" | "editor-only";
  initialTab?: "preview" | "code" | "console" | "files";
  autorun?: boolean;
}

// Custom Hook for SandpackPreview state
const useSandpackPreviewState = () => {
  const { sandpack } = useSandpack();
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("code");
  const [consoleStatus, setConsoleStatus] = useState<"success" | "error" | "info" | null>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return {
    sandpack,
    isReady,
    isFullscreen,
    toggleFullscreen,
    activeTab,
    setActiveTab,
    consoleStatus,
    setConsoleStatus,
  };
};

// Preview Header Component
const PreviewHeader = ({ refreshCode }: { refreshCode: () => void }) => {
  const { refresh } = useSandpackNavigation();
  
  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800/20 backdrop-blur-sm border-b border-gray-700/30">
      <div className="flex items-center space-x-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 rounded-full text-gray-400 hover:text-white"
        onClick={() => {
          refresh();
          refreshCode();
          toast.success("Preview refreshed");
        }}
      >
        <RefreshCcw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

// Code Panel Component
const CodePanel = () => {
  const { sandpack } = useSandpack();
  const [selectedFile, setSelectedFile] = useState<string>("");
  const { theme } = useTheme();
  
  useEffect(() => {
    if (sandpack && sandpack.activeFile) {
      setSelectedFile(sandpack.activeFile);
    }
  }, [sandpack]);
  
  return (
    <div className="h-full">
      <Tabs defaultValue="code" className="w-full h-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="code" className="flex items-center gap-1.5">
            <Code className="h-3.5 w-3.5" />
            <span>Code</span>
          </TabsTrigger>
          <TabsTrigger value="console" className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5" />
            <span>Console</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="h-[calc(100%-40px)]">
          <SandpackThemeProvider theme={theme === "dark" ? nightOwl : githubLight}>
            <SandpackCodeEditor 
              showLineNumbers 
              showInlineErrors 
              wrapContent
              closableTabs 
              className="h-full border rounded-md overflow-hidden"
            />
          </SandpackThemeProvider>
        </TabsContent>
        <TabsContent value="console" className="h-[calc(100%-40px)]">
          <SandpackConsole className="h-full border rounded-md overflow-hidden" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SandpackPreview: React.FC<SandpackPreviewProps> = ({
  files,
  dependencies = {},
  className = "",
  showFiles = true,
  layout = "split",
  initialTab = "code",
  autorun = true,
}) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Create a proper file structure for Sandpack
  const sandpackFiles: SandpackFiles = {};
  
  for (const [path, content] of Object.entries(files)) {
    sandpackFiles[path] = { code: content };
  }
  
  // Add default files if they don't exist
  if (!sandpackFiles["/App.js"] && !sandpackFiles["/App.jsx"] && !sandpackFiles["/App.tsx"]) {
    sandpackFiles["/App.js"] = {
      code: `
import React from "react";

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Welcome to your app!</h1>
        <p className="mt-2 text-gray-600 text-center">
          This is a default app created by the Text to Web Generator.
        </p>
      </div>
    </div>
  );
}`,
    };
  }
  
  // Add index.js if it doesn't exist
  if (!sandpackFiles["/index.js"] && !sandpackFiles["/index.jsx"] && !sandpackFiles["/index.tsx"] && 
      !sandpackFiles["/src/index.js"] && !sandpackFiles["/src/index.jsx"] && !sandpackFiles["/src/index.tsx"]) {
    sandpackFiles["/index.js"] = {
      code: `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
`,
    };
  }
  
  // Add styles.css if it doesn't exist - with Tailwind Importation
  if (!sandpackFiles["/styles.css"] && !sandpackFiles["/src/styles.css"]) {
    sandpackFiles["/styles.css"] = {
      code: `
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}

/* Add some modern styles */
.btn {
  @apply px-4 py-2 rounded font-medium transition-all duration-200;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.card {
  @apply bg-white rounded-lg shadow-lg p-6;
}

.container {
  @apply max-w-6xl mx-auto px-4;
}
`,
    };
  }
  
  // Add package.json if it doesn't exist
  if (!sandpackFiles["/package.json"]) {
    sandpackFiles["/package.json"] = {
      code: JSON.stringify({
        name: "generated-app",
        version: "1.0.0",
        description: "Generated web application",
        dependencies: {
          "react": "18.2.0",
          "react-dom": "18.2.0",
          ...dependencies
        }
      }, null, 2)
    };
  }
  
  // Add index.html if it doesn't exist
  if (!sandpackFiles["/index.html"] && !sandpackFiles["/public/index.html"]) {
    sandpackFiles["/index.html"] = {
      code: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generated App</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`
    };
  }
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, []);

  // Mobile Layout
  if (isMobile) {
    return (
      <div className={`${className} mt-4 h-[600px] animate-fade-in`}>
        <SandpackProvider
          template="react"
          theme={theme === "dark" ? nightOwl : githubLight}
          files={sandpackFiles}
          customSetup={{
            dependencies: {
              "react": "latest",
              "react-dom": "latest",
              ...dependencies,
            },
            entry: Object.keys(sandpackFiles).find(
              (file) => file.includes("index") && file.endsWith(".js")
            ) || "/index.js",
          }}
          autorun={autorun}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          )}
        
          <Tabs defaultValue={initialTab} className="w-full h-full">
            <TabsList className="w-full grid grid-cols-3">
              {showFiles && <TabsTrigger value="files" className="flex items-center gap-1.5">
                <File className="h-3.5 w-3.5" />
                <span>Files</span>
              </TabsTrigger>}
              <TabsTrigger value="code" className="flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5" />
                <span>Code</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>
            
            {showFiles && (
              <TabsContent value="files" className="mt-2 h-[calc(100%-48px)]">
                <SandpackFileExplorer className="h-full border rounded-md overflow-hidden" />
              </TabsContent>
            )}
            
            <TabsContent value="code" className="mt-2 h-[calc(100%-48px)]">
              <CodePanel />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-2 h-[calc(100%-48px)]">
              <div className="h-full flex flex-col border rounded-md overflow-hidden">
                <PreviewHeader refreshCode={() => {}} />
                <div className="flex-grow">
                  <SandpackPreviewComponent
                    showNavigator
                    showRefreshButton
                    className="h-full"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SandpackProvider>
      </div>
    );
  }
  
  // Desktop Layout
  return (
    <div className={`${className} mt-6 h-[700px] animate-fade-in transition-all duration-300`}>
      <SandpackProvider
        template="react"
        theme={theme === "dark" ? nightOwl : githubLight}
        files={sandpackFiles}
        customSetup={{
          dependencies: {
            "react": "latest",
            "react-dom": "latest",
            ...dependencies,
          },
          entry: Object.keys(sandpackFiles).find(
            (file) => file.includes("index") && file.endsWith(".js")
          ) || "/index.js",
        }}
        autorun={autorun}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        )}
        
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full rounded-lg border bg-background/50 backdrop-blur-sm shadow-xl"
        >
          {showFiles && (
            <>
              <ResizablePanel defaultSize={15} minSize={10} className="h-full">
                <div className="h-full p-2">
                  <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <File className="h-3.5 w-3.5" /> Files
                    </h3>
                  </div>
                  <SandpackFileExplorer className="h-[calc(100%-32px)] rounded-md overflow-hidden" />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          
          <ResizablePanel defaultSize={50} minSize={30} className="h-full">
            <div className="h-full p-2">
              <CodePanel />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} className="h-full">
            <div className="h-full p-2">
              <div className="h-full flex flex-col border rounded-md overflow-hidden">
                <PreviewHeader refreshCode={() => {}} />
                <div className="flex-grow">
                  <SandpackPreviewComponent
                    showNavigator
                    showRefreshButton
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SandpackProvider>
    </div>
  );
};

export default SandpackPreview;
