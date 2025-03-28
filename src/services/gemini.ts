
import { toast } from "sonner";

const API_KEY = "AIzaSyDc7u7wTVdDG3zP18xnELKs0HX7-hImkmc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface GenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  framework?: "react" | "react-ts" | "next" | "vite";
}

interface GenerationRequest {
  contents: {
    role: string;
    parts: {
      text: string;
    }[];
  }[];
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
}

interface GenerationResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const projectTemplates = {
  basic: {
    prompt: "Create a basic React application with a header, main content area, and footer. Use responsive design with Tailwind CSS.",
    description: "A simple React app with basic structure"
  },
  dashboard: {
    prompt: "Create a React dashboard with a sidebar navigation, header, statistics cards, and a main chart. Include dark mode toggle and responsive design.",
    description: "Admin dashboard with statistics and charts"
  },
  ecommerce: {
    prompt: "Create a React e-commerce product listing page with filtering, sorting, product cards, and a shopping cart. Make it responsive with Tailwind CSS.",
    description: "E-commerce product page with filtering and cart"
  },
  blog: {
    prompt: "Create a React blog with article listings, featured post, categories sidebar, and article detail page. Use Tailwind CSS for styling.",
    description: "Blog template with articles and categories"
  }
};

export const generateWebApp = async (
  prompt: string, 
  config: GenerationConfig = {}
): Promise<string> => {
  try {
    const { 
      temperature = 0.7, 
      maxOutputTokens = 10000,
      framework = "react"
    } = config;
    
    let frameworkInstructions = "";
    
    switch (framework) {
      case "react-ts":
        frameworkInstructions = "Use React with TypeScript and TailwindCSS.";
        break;
      case "next":
        frameworkInstructions = "Use Next.js with TypeScript and TailwindCSS.";
        break;
      case "vite":
        frameworkInstructions = "Use Vite with React, TypeScript and TailwindCSS.";
        break;
      default:
        frameworkInstructions = "Use React and TailwindCSS.";
    }

    const requestData: GenerationRequest = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a complete, functional ${framework} web application based on this description: "${prompt}". 

${frameworkInstructions}

IMPORTANT REQUIREMENTS:
1. Create a FULLY FUNCTIONAL application with real logic and working features
2. Use proper directory structure with separate components, hooks, utils folders
3. Make the UI responsive, modern, and visually appealing with Tailwind CSS
4. Include detailed comments in the code to explain key functionality
5. Implement proper state management using React hooks
6. Use appropriate error handling and loading states
7. Create reusable components where applicable
8. Add proper TypeScript types for all components and functions if using TypeScript
9. Use best practices for performance optimization

Return your response in the following format:
---FILES---
// Each file should be in this format:
---FILE:path/to/filename.ext---
// Content of the file with complete, working code
---ENDFILE---
// Then the next file, and so on for ALL required files
---ENDFILES---

NOTE: Ensure that you include ALL necessary files for the application to run properly, including package.json with required dependencies.`
            }
          ]
        }
      ],
      generationConfig: {
        temperature,
        maxOutputTokens
      }
    };

    console.log("Sending request to Gemini API...");
    toast.info("Generating your web application...", { duration: 15000 });
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(errorData.error?.message || "Error calling Gemini API");
    }

    const data: GenerationResponse = await response.json();
    toast.success("Generation complete! Processing files...");
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating web app:", error);
    toast.error("Failed to generate web application");
    throw error;
  }
};

export const extractFilesFromResponse = (response: string): Record<string, string> => {
  const files: Record<string, string> = {};
  
  try {
    console.log("Extracting files from response...");
    
    // Extract content between ---FILES--- and ---ENDFILES---
    const filesContent = response.match(/---FILES---([\s\S]*?)---ENDFILES---/);
    
    if (!filesContent) {
      console.error("Invalid response format - no FILES section found");
      throw new Error("Invalid response format");
    }
    
    // Split into individual files and process each one
    const fileMatches = [...filesContent[1].matchAll(/---FILE:(.*?)---([\s\S]*?)---ENDFILE---/g)];
    
    console.log(`Found ${fileMatches.length} files in response`);
    
    for (const match of fileMatches) {
      const filepath = match[1].trim();
      let content = match[2].trim();
      
      // Remove markdown code formatting if present
      if (content.startsWith("```")) {
        const languageMarker = content.split("\n")[0];
        content = content.replace(languageMarker, "");
        if (content.endsWith("```")) {
          content = content.substring(0, content.lastIndexOf("```")).trim();
        }
      }
      
      console.log(`Processing file: ${filepath}`);
      
      // Handle specific file types that might need special processing
      if (filepath.endsWith("package.json")) {
        try {
          // If it's a package.json, make sure it's valid JSON
          const parsedContent = JSON.parse(content);
          
          // Ensure essential dependencies are included
          if (!parsedContent.dependencies) {
            parsedContent.dependencies = {};
          }
          
          // Add essential dependencies if they're missing
          const essentialDeps = {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "tailwindcss": "^3.3.0"
          };
          
          for (const [dep, version] of Object.entries(essentialDeps)) {
            if (!parsedContent.dependencies[dep]) {
              parsedContent.dependencies[dep] = version;
            }
          }
          
          content = JSON.stringify(parsedContent, null, 2);
        } catch (e) {
          console.error("Invalid package.json content, using default");
          content = JSON.stringify({
            "name": "generated-app",
            "private": true,
            "version": "0.1.0",
            "dependencies": {
              "react": "^18.2.0",
              "react-dom": "^18.2.0",
              "tailwindcss": "^3.3.0",
              "lucide-react": "^0.276.0"
            }
          }, null, 2);
        }
      }
      
      // Create proper filepath
      let normalizedPath = filepath;
      if (!normalizedPath.startsWith('/')) {
        normalizedPath = `/${normalizedPath}`;
      }
      
      files[normalizedPath] = content;
    }
    
    // Ensure required files exist
    ensureRequiredFiles(files);
    
    return files;
  } catch (error) {
    console.error("Error extracting files:", error);
    toast.error("Error processing files. Using fallback template.");
    
    // Return a basic fallback app
    return createFallbackApp();
  }
};

// Function to ensure all required files exist
function ensureRequiredFiles(files: Record<string, string>) {
  // Check for package.json
  if (!Object.keys(files).some(path => path.endsWith('package.json'))) {
    files['/package.json'] = JSON.stringify({
      "name": "generated-app",
      "private": true,
      "version": "0.1.0",
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "tailwindcss": "^3.3.0",
        "lucide-react": "^0.276.0"
      }
    }, null, 2);
  }
  
  // Check for tailwind.config.js
  if (!Object.keys(files).some(path => path.endsWith('tailwind.config.js'))) {
    files['/tailwind.config.js'] = `
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
  }
  
  // Check for a CSS file with Tailwind imports
  if (!Object.keys(files).some(path => path.endsWith('.css') && files[path].includes('@tailwind'))) {
    files['/src/styles.css'] = `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@layer components {
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
  .btn {
    @apply px-4 py-2 rounded-md transition-all duration-200;
  }
  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }
}
`;
  }
  
  // Check for App component
  if (!Object.keys(files).some(path => path.includes('/App.') || path.includes('/app.'))) {
    files['/src/App.jsx'] = `
import React from 'react';
import './styles.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-gray-800">Generated App</h1>
        </div>
      </header>
      <main>
        <div className="container py-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
            <p className="text-gray-600">
              This is a generated application. Start customizing it to build your project.
            </p>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white">
        <div className="container py-4">
          <p>&copy; {new Date().getFullYear()} Generated App</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
`;
  }
  
  // Check for index file
  if (!Object.keys(files).some(path => path.includes('/index.') && !path.endsWith('.css'))) {
    files['/src/index.jsx'] = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  }
  
  // Check for HTML file
  if (!Object.keys(files).some(path => path.endsWith('.html'))) {
    files['/index.html'] = `
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
`;
  }
}

// Function to create a fallback app when generation fails
function createFallbackApp(): Record<string, string> {
  return {
    "/src/App.jsx": `
import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Generated Application
            </div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
              Welcome to your new app!
            </h1>
            <p className="mt-2 text-slate-500">
              Sorry, there was an issue generating your custom app. 
              This is a fallback application you can start working with.
            </p>
            
            <div className="mt-6 flex justify-center">
              <button 
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                onClick={() => setCount(count + 1)}
              >
                Count: {count}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
    "/src/styles.css": `
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}`,
    "/src/index.jsx": `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    "/package.json": JSON.stringify({
      name: "generated-fallback-app",
      version: "1.0.0",
      description: "Generated fallback application",
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "tailwindcss": "^3.3.0",
        "lucide-react": "^0.276.0"
      }
    }, null, 2),
    "/tailwind.config.js": `
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
    "/index.html": `
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
</html>`
  };
}

// Function to analyze required dependencies from files
export const analyzeRequiredDependencies = (files: Record<string, string>): Record<string, string> => {
  const dependencies: Record<string, string> = {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  };
  
  // Check for imports in all JS/TS files
  for (const [path, content] of Object.entries(files)) {
    if (path.match(/\.(js|jsx|ts|tsx)$/)) {
      // Look for import statements
      const importMatches = content.matchAll(/import\s+?(?:(?:\{[^}]*\})|(?:[^,{]*?))\s+from\s+?["']([^"']+)["']/g);
      
      for (const match of importMatches) {
        const importPath = match[1];
        
        // Skip relative imports and React
        if (importPath.startsWith('.') || importPath === 'react' || importPath === 'react-dom') {
          continue;
        }
        
        // Add as dependency (using latest version as fallback)
        if (!dependencies[importPath]) {
          dependencies[importPath] = "latest";
        }
      }
    }
  }
  
  // Check for Tailwind usage
  const hasTailwind = Object.values(files).some(content => 
    content.includes('@tailwind') || 
    content.includes('className=') && content.match(/className=["'][^"']*(?:bg-|text-|flex|grid|p-|m-|rounded)[^"']*["']/)
  );
  
  if (hasTailwind) {
    dependencies["tailwindcss"] = "^3.3.0";
    dependencies["postcss"] = "^8.4.24";
    dependencies["autoprefixer"] = "^10.4.14";
  }
  
  return dependencies;
};

// Function to estimate dependencies from code
export const estimateDependencies = (files: Record<string, string>): Record<string, string> => {
  // Start with base dependencies
  const dependencies: Record<string, string> = {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  };
  
  // Check content of all files for potential library usage patterns
  for (const content of Object.values(files)) {
    // Check for router usage
    if (content.includes('react-router') || 
        content.includes('Route') && content.includes('Switch') ||
        content.includes('useNavigate') || 
        content.includes('useParams')) {
      dependencies["react-router-dom"] = "^6.16.0";
    }
    
    // Check for form handling libraries
    if (content.includes('useForm') || content.includes('Controller') && content.includes('control=')) {
      dependencies["react-hook-form"] = "^7.46.1";
    }
    
    // Check for state management
    if (content.includes('createStore') || content.includes('useDispatch') || content.includes('useSelector')) {
      dependencies["redux"] = "^4.2.1";
      dependencies["react-redux"] = "^8.1.2";
    }
    if (content.includes('createContext') && content.includes('useReducer')) {
      dependencies["@tanstack/react-query"] = "^4.35.3";
    }
    
    // Check for UI libraries
    if (content.includes('tailwind')) {
      dependencies["tailwindcss"] = "^3.3.3";
      dependencies["postcss"] = "^8.4.29";
      dependencies["autoprefixer"] = "^10.4.15";
    }
    if (content.includes('lucide-react') || content.includes('<Icon') && content.includes('lucide')) {
      dependencies["lucide-react"] = "^0.276.0";
    }
    
    // Check for animation libraries
    if (content.includes('motion') && content.includes('animate')) {
      dependencies["framer-motion"] = "^10.16.4";
    }
    
    // Check for date handling
    if (content.includes('format(') && content.includes('date')) {
      dependencies["date-fns"] = "^2.30.0";
    }
  }
  
  return dependencies;
};
