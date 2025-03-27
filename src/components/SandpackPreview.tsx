
import React, { useEffect } from "react";
import {
  SandpackProvider,
  SandpackPreview as SandpackPreviewComponent,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackFileExplorer,
  useSandpack,
  SandpackConsole,
  SandpackFiles,
} from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";

interface SandpackPreviewProps {
  files: Record<string, string>;
  dependencies?: Record<string, string>;
  className?: string;
  showFiles?: boolean;
}

const CodePanel = () => {
  const { sandpack } = useSandpack();
  return (
    <div className="h-full">
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="h-[calc(100%-40px)]">
          <SandpackCodeEditor 
            showLineNumbers 
            showInlineErrors 
            closableTabs 
            className="h-full border rounded-md overflow-hidden"
          />
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
  showFiles = false,
}) => {
  const isMobile = useIsMobile();
  
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
  
  // Determine layout based on device
  if (isMobile) {
    return (
      <div className={`${className} mt-6 h-[600px]`}>
        <SandpackProvider
          template="react"
          theme={nightOwl}
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
        >
          <Tabs defaultValue="preview" className="w-full h-full">
            <TabsList className="w-full grid grid-cols-3">
              {showFiles && <TabsTrigger value="files">Files</TabsTrigger>}
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
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
              <SandpackPreviewComponent
                showNavigator
                showRefreshButton
                className="h-full border rounded-md overflow-hidden"
              />
            </TabsContent>
          </Tabs>
        </SandpackProvider>
      </div>
    );
  }
  
  return (
    <div className={`${className} mt-8 h-[700px] animate-fade-in`}>
      <SandpackProvider
        template="react"
        theme={nightOwl}
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
      >
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
          {showFiles && (
            <>
              <ResizablePanel defaultSize={15} minSize={10} className="h-full">
                <div className="h-full p-2">
                  <SandpackFileExplorer className="h-full rounded-md overflow-hidden" />
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
              <SandpackPreviewComponent
                showNavigator
                showRefreshButton
                className="h-full rounded-md overflow-hidden"
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SandpackProvider>
    </div>
  );
};

export default SandpackPreview;
