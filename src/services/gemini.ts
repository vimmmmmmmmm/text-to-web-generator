import { toast } from "sonner";

const API_KEY = "AIzaSyDc7u7wTVdDG3zP18xnELKs0HX7-hImkmc";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface GenerateContentResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface GeminiConfig {
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  topP?: number;
}

export const generateWebApp = async (
  prompt: string,
  config: GeminiConfig = {}
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Create a React web application based on this prompt. Use Tailwind CSS for styling.
                Return ONLY the complete React code files needed within a JSON structure.
                The response should be in the format: 
                {
                  "files": {
                    "/App.tsx": "// code here",
                    "/components/Header.tsx": "// code here",
                    // other files
                  }
                }
                
                User prompt: ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: config.temperature || 0.7,
          maxOutputTokens: config.maxTokens || 8192,
          topK: config.topK || 40,
          topP: config.topP || 0.95,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to generate content");
    }

    const data = await response.json() as GenerateContentResponse;
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    const textContent = data.candidates[0].content.parts[0].text;
    
    // Try to extract JSON from the response
    try {
      // Find JSON in the response (it might be surrounded by markdown code blocks)
      const jsonMatch = textContent.match(/```json([\s\S]*?)```/) || 
                        textContent.match(/```([\s\S]*?)```/) ||
                        [null, textContent];
      
      const jsonString = jsonMatch[1] ? jsonMatch[1].trim() : textContent.trim();
      const result = JSON.parse(jsonString);
      
      if (!result.files) {
        throw new Error("No files found in the response");
      }
      
      return JSON.stringify(result);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      throw new Error("Failed to parse the generated code");
    }
  } catch (error) {
    console.error("Error generating web app:", error);
    toast.error("Failed to generate web application: " + (error as Error).message);
    throw error;
  }
};

export const extractFilesFromResponse = (response: string): Record<string, string> => {
  try {
    const data = JSON.parse(response);
    return data.files || {};
  } catch (error) {
    console.error("Failed to extract files:", error);
    return {};
  }
};
