
import React from "react";
import {
  SandpackProvider,
  SandpackPreview as SandpackPreviewComponent,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";

interface SandpackPreviewProps {
  files: Record<string, string>;
  dependencies?: Record<string, string>;
  className?: string;
  showFiles?: boolean;
}

const SandpackPreview: React.FC<SandpackPreviewProps> = ({
  files,
  dependencies = {},
  className = "",
  showFiles = false,
}) => {
  // Create a proper file structure for Sandpack
  const sandpackFiles: Record<string, { code: string }> = {};
  
  for (const [path, content] of Object.entries(files)) {
    sandpackFiles[path] = { code: content };
  }
  
  // Add the default App.js if not included
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
}
      `,
    };
  }
  
  return (
    <div className={className}>
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
            (file) => file.includes("App") || file.includes("index")
          ) || "/App.js",
        }}
      >
        <SandpackLayout>
          {showFiles && <SandpackFileExplorer />}
          <SandpackCodeEditor showLineNumbers showInlineErrors closableTabs />
          <SandpackPreviewComponent showNavigator showRefreshButton />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default SandpackPreview;
