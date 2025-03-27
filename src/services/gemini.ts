
import { toast } from "sonner";

// Replace with your actual Gemini API key
const API_KEY = "AIzaSyDc7u7wTVdDG3zP18xnELKs0HX7-hImkmc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface GenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  framework?: "react" | "react-ts";
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

export const generateWebApp = async (
  prompt: string, 
  config: GenerationConfig = {}
): Promise<string> => {
  try {
    const { 
      temperature = 0.8, 
      maxOutputTokens = 8192,
      framework = "react"
    } = config;
    
    const frameworkInstructions = framework === "react-ts" 
      ? "Use React with TypeScript and TailwindCSS." 
      : "Use React and TailwindCSS.";

    const requestData: GenerationRequest = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a ${framework} web application based on this description: "${prompt}". 
              ${frameworkInstructions}
              Make the design modern, responsive, and visually appealing.
              Include detailed comments in the code to explain key functionality.
              Return your response in the following format:
              ---FILES---
              // Each file should be in this format:
              ---FILE:filename.ext---
              // Content of the file
              ---ENDFILE---
              // Then the next file, and so on
              ---ENDFILES---
              `
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
      const filename = match[1].trim();
      let content = match[2].trim();
      
      // Remove markdown code formatting if present
      if (content.startsWith("```")) {
        const languageMarker = content.split("\n")[0];
        content = content.replace(languageMarker, "");
        if (content.endsWith("```")) {
          content = content.substring(0, content.lastIndexOf("```")).trim();
        }
      }
      
      console.log(`Processing file: ${filename}`);
      
      // Handle specific file types that might need special processing
      if (filename === "package.json") {
        try {
          // If it's a package.json, make sure it's valid JSON
          const parsedContent = JSON.parse(content);
          content = JSON.stringify(parsedContent, null, 2);
        } catch (e) {
          console.error("Invalid package.json content, using default");
          content = JSON.stringify({
            "name": "generated-app",
            "private": true,
            "version": "0.0.0",
            "type": "module"
          }, null, 2);
        }
      }
      
      files[`/${filename}`] = content;
    }
    
    // If no files were extracted or it doesn't have an App component, provide defaults
    if (Object.keys(files).length === 0 || 
        (!files["/App.js"] && !files["/App.jsx"] && !files["/App.tsx"])) {
      console.warn("No valid files found, using fallback App component");
      files["/App.js"] = `
import React from "react";

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">App Generation Error</h1>
        <p className="mt-2 text-gray-600 text-center">
          There was an error processing the AI response. Please try again with a more detailed prompt.
        </p>
      </div>
    </div>
  );
}`;
    }
    
    return files;
  } catch (error) {
    console.error("Error extracting files:", error);
    return {
      "/App.js": `
import React from "react";

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Error Processing Response</h1>
        <p className="mt-2 text-gray-600 text-center">
          There was an error processing the AI response. Please try again.
        </p>
      </div>
    </div>
  );
}
`
    };
  }
};
