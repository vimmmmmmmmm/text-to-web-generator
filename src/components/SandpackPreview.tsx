
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
  
  // Add styles.css if it doesn't exist
  if (!sandpackFiles["/styles.css"] && !sandpackFiles["/src/styles.css"]) {
    sandpackFiles["/styles.css"] = {
      code: `
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');

body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
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
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`
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
            (file) => file.includes("index") && file.endsWith(".js")
          ) || "/index.js",
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
