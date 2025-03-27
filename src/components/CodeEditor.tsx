
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Code2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface CodeEditorProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  title?: string;
  showHeader?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = "jsx",
  className,
  showLineNumbers = true,
  title,
  showHeader = true,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.highlightAll();
    }
  }, [code]);

  useEffect(() => {
    // Map common language aliases to Prism's language names
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      html: "html",
      css: "css",
      json: "json",
      bash: "bash",
      shell: "bash",
      md: "markdown",
    };

    const prismLanguage = languageMap[language] || "javascript";
    
    try {
      const highlighted = Prism.highlight(
        code,
        Prism.languages[prismLanguage] || Prism.languages.javascript,
        prismLanguage
      );
      setHighlightedCode(highlighted);
    } catch (error) {
      console.error("Error highlighting code:", error);
      setHighlightedCode(code);
    }
  }, [code, language]);

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

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded successfully");
  };

  return (
    <div className={cn(
      "relative rounded-lg overflow-hidden shadow-xl border border-border/40 bg-background",
      "transition-all duration-300 hover:shadow-lg",
      className
    )}>
      {showHeader && (
        <div className="absolute top-0 left-0 right-0 h-12 bg-gray-800/95 backdrop-blur-sm flex items-center justify-between px-4 z-10 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {title && (
              <div className="text-sm font-mono text-gray-300 ml-2">{title}</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 text-xs text-gray-400 bg-gray-700/50 rounded font-mono">
              {language.toUpperCase()}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={downloadCode}
              title="Download code"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={copyToClipboard}
              title={copied ? "Copied!" : "Copy code"}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
      <div className={cn("pt-12 max-h-[600px] overflow-auto bg-gray-900", 
                         !showHeader && "pt-0")}
           style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a5568 #2d3748' }}>
        <pre className={cn(
          "p-4 text-gray-300 text-sm font-mono",
          showLineNumbers && "line-numbers"
        )}>
          {showLineNumbers ? (
            <code 
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          ) : (
            <code 
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          )}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
