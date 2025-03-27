
import React from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  code: string;
  language?: string;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = "jsx",
  className,
}) => {
  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <div className="absolute top-0 left-0 right-0 h-9 bg-gray-800 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <pre className="bg-gray-900 text-gray-300 p-4 pt-12 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeEditor;
