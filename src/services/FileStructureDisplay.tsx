
import React from "react";
import { Folder, File, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  files: Record<string, string>;
  className?: string;
  onFileSelect?: (filePath: string) => void;
  selectedFile?: string;
}

const FileStructureDisplay: React.FC<FileTreeProps> = ({
  files,
  className,
  onFileSelect,
  selectedFile
}) => {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set(["/src"]));

  // Convert flat file structure to a tree
  const fileTree = React.useMemo(() => {
    const tree: Record<string, any> = {};

    Object.keys(files).forEach((path) => {
      const parts = path.split('/').filter(Boolean);
      let current = tree;

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {};
        }

        if (index === parts.length - 1) {
          // Mark as file
          current[part].__isFile = true;
          current[part].__path = path;
        }

        current = current[part];
      });
    });

    return tree;
  }, [files]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleFileClick = (path: string) => {
    if (onFileSelect) {
      onFileSelect(path);
    }
  };

  const renderTree = (
    node: Record<string, any>,
    path = "",
    depth = 0,
    isLast = true
  ) => {
    const entries = Object.entries(node).filter(
      ([key]) => !key.startsWith("__")
    );

    return (
      <div className="pl-3">
        {entries.map(([name, child], index) => {
          const isFile = child.__isFile;
          const fullPath = path ? `${path}/${name}` : `/${name}`;
          const isExpanded = expandedFolders.has(fullPath);
          const isSelected = selectedFile === child.__path;

          return (
            <div key={fullPath} className="relative">
              <div
                className={cn(
                  "flex items-center py-1 hover:bg-muted/40 rounded cursor-pointer",
                  isSelected && "bg-primary/10"
                )}
                onClick={() =>
                  isFile ? handleFileClick(child.__path) : toggleFolder(fullPath)
                }
              >
                <div className="w-4 h-4 mr-1 flex items-center justify-center">
                  {!isFile && (isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  ))}
                </div>
                {isFile ? (
                  <File className="w-4 h-4 mr-1 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 mr-1 text-yellow-500" />
                )}
                <span className="text-sm">{name}</span>
              </div>
              {!isFile && isExpanded && (
                <div className="ml-2 border-l border-border pl-2">
                  {renderTree(
                    child,
                    fullPath,
                    depth + 1,
                    index === entries.length - 1
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("rounded-lg border border-border bg-card p-3", className)}>
      <h3 className="font-medium text-sm mb-2">Project Structure</h3>
      {renderTree(fileTree)}
    </div>
  );
};

export default FileStructureDisplay;
