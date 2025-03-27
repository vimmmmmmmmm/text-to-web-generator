
import { toast } from "sonner";

// Replace with your actual Gemini API key
const API_KEY = "AIzaSyDc7u7wTVdDG3zP18xnELKs0HX7-hImkmc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

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

export const generateWebApp = async (prompt: string): Promise<string> => {
  try {
    const requestData: GenerationRequest = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a React web application based on this description: "${prompt}". 
              Use React and TailwindCSS. 
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
        temperature: 0.8,
        maxOutputTokens: 8192
      }
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
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
    // Extract content between ---FILES--- and ---ENDFILES---
    const filesContent = response.match(/---FILES---([\s\S]*?)---ENDFILES---/);
    
    if (!filesContent) {
      throw new Error("Invalid response format");
    }
    
    // Split into individual files
    const fileMatches = filesContent[1].matchAll(/---FILE:(.*?)---([\s\S]*?)---ENDFILE---/g);
    
    for (const match of fileMatches) {
      const filename = match[1].trim();
      const content = match[2].trim();
      
      files[filename] = content;
    }
    
    return files;
  } catch (error) {
    console.error("Error extracting files:", error);
    return {
      "App.js": `
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
