
import React from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CodeEditorProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = "jsx",
  className,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const formatCode = (code: string) => {
    if (!showLineNumbers) return code;
    
    return code.split("\n").map((line, i) => (
      <div key={i} className="table-row">
        <span className="table-cell text-xs text-right pr-4 text-gray-500 select-none w-10">
          {i + 1}
        </span>
        <span className="table-cell">
          {line || " "}
        </span>
      </div>
    ));
  };

  return (
    <div className={cn("relative rounded-lg overflow-hidden shadow-md", className)}>
      <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 flex items-center justify-between px-4 z-10">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="px-2 py-1 text-xs text-gray-400 rounded">
          {language.toUpperCase()}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-gray-300 hover:text-white hover:bg-gray-700"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <div className="pt-10 max-h-[500px] overflow-auto bg-gray-900">
        <pre className={cn(
          "p-4 text-gray-300 text-sm font-mono",
          showLineNumbers ? "table w-full" : ""
        )}>
          <code className={`language-${language}`}>
            {showLineNumbers ? formatCode(code) : code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
