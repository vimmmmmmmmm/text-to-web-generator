
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CodeEditorProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  readonly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = "jsx",
  className,
  showLineNumbers = true,
  readonly = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [editorContent, setEditorContent] = useState(code);

  useEffect(() => {
    setEditorContent(code);
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readonly) {
      setEditorContent(e.target.value);
    }
  };

  return (
    <div className={cn("relative rounded-lg overflow-hidden bg-gray-900", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-gray-400">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-white"
          onClick={handleCopy}
          title="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>

      <div className="relative">
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-800 border-r border-gray-700 flex flex-col items-end pt-2 pb-2 text-xs text-gray-500">
            {editorContent.split("\n").map((_, i) => (
              <div key={i} className="px-2 h-6 leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <textarea
          value={editorContent}
          onChange={handleChange}
          readOnly={readonly}
          className={cn(
            "w-full bg-gray-900 text-gray-300 p-2 outline-none font-mono text-sm resize-none min-h-[200px]",
            showLineNumbers ? "pl-10" : "pl-4"
          )}
          style={{ lineHeight: "1.5", tabSize: 2 }}
          spellCheck="false"
          rows={editorContent.split("\n").length}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
