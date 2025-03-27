
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SandpackPreview from "@/components/SandpackPreview";
import CodeEditor from "@/components/CodeEditor";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressIndicator from "@/components/ProgressIndicator";
import TypingAnimation from "@/components/TypingAnimation";
import { generateWebApp, extractFilesFromResponse } from "@/services/gemini";
import { Loader2, Zap, Save, Share, Code, Eye, LayoutGrid, FileCode, Settings, Info, CheckCircle, DownloadCloud, Copy, Terminal, PanelRight, PanelLeft, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import GeminiLogo from "@/components/ui/GeminiLogo";
import AnimatedGradientBorder from "@/components/ui/AnimatedGradientBorder";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface ExampleTemplate {
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
}

const exampleTemplates: ExampleTemplate[] = [
  {
    title: "Landing Page",
    description: "Create a modern landing page for a SaaS product",
    prompt: "Create a landing page for a SaaS product called CloudFlow that helps teams manage their cloud infrastructure. Include a hero section, features, pricing, and contact form. Use a modern design with blue and purple accents.",
    icon: <LayoutGrid className="h-5 w-5 text-purple-500" />,
  },
  {
    title: "Dashboard UI",
    description: "Create an analytics dashboard with charts",
    prompt: "Create an analytics dashboard with a sidebar navigation, header with user profile, and main content area showing charts and statistics. Include a line chart for revenue, bar chart for user growth, and cards showing key metrics.",
    icon: <PanelLeft className="h-5 w-5 text-blue-500" />,
  },
  {
    title: "E-commerce Product Page",
    description: "Create a product detail page for an online store",
    prompt: "Create a product page for an e-commerce website selling premium headphones. Include product images, description, price, color selector, add to cart button, reviews section, and related products.",
    icon: <PanelRight className="h-5 w-5 text-green-500" />,
  },
  {
    title: "Blog Template",
    description: "Create a modern blog with articles and sidebar",
    prompt: "Create a blog homepage with a header, featured article, article grid, sidebar with categories and popular posts, and a footer. Use a clean, minimal design with good typography.",
    icon: <FileCode className="h-5 w-5 text-orange-500" />,
  },
];

const GeneratorPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string> | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ExampleTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [autoRunCode, setAutoRunCode] = useState(true);
  const [selectedFramework, setSelectedFramework] = useState("react");
  const [viewMode, setViewMode] = useState<"split" | "preview-only" | "editor-only">("split");
  const [animationComplete, setAnimationComplete] = useState(false);
  const [codeSnippets, setCodeSnippets] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  // File system simulation for typing animation
  const [generationSteps, setGenerationSteps] = useState<string[]>([
    "Analyzing prompt...",
    "Setting up project structure...",
    "Creating components...",
    "Building UI elements...",
    "Implementing functionality...",
    "Finalizing styling...",
    "Optimizing code..."
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isGenerating && currentStep < generationSteps.length) {
      const timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1200);
      
      return () => clearTimeout(timeout);
    }
  }, [isGenerating, currentStep, generationSteps.length]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setShowResult(false);
    setCurrentStep(0);
    setIsTyping(true);
    setAnimationComplete(false);
    
    // Generate random code snippets for typing animation
    setCodeSnippets([
      `import React from "react";\n\nconst App = () => {\n  return (\n    <div className="container mx-auto">\n      <h1>Generated App</h1>\n    </div>\n  );\n};\n\nexport default App;`,
      `const Button = ({ children, onClick }) => {\n  return (\n    <button\n      className="px-4 py-2 bg-blue-500 text-white rounded"\n      onClick={onClick}\n    >\n      {children}\n    </button>\n  );\n};`,
      `import { useState } from "react";\n\nexport function useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  \n  const increment = () => setCount(prev => prev + 1);\n  const decrement = () => setCount(prev => prev - 1);\n  const reset = () => setCount(initialValue);\n  \n  return { count, increment, decrement, reset };\n}`
    ]);
    
    try {
      toast.info("Generating your web application...", { duration: 10000 });
      const response = await generateWebApp(prompt);
      console.log("Raw API response:", response);
      
      const files = extractFilesFromResponse(response);
      console.log("Extracted files:", files);
      
      // Add a small delay to make the UI look more natural
      setTimeout(() => {
        setGeneratedFiles(files);
        setShowResult(true);
        setIsTyping(false);
        setAnimationComplete(true);
        toast.success("Web application generated successfully!");
      }, 1500);
    } catch (error) {
      console.error("Generation error:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      setIsTyping(false);
      toast.error("Failed to generate web application");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTemplate = (template: ExampleTemplate) => {
    setSelectedTemplate(template);
    setPrompt(template.prompt);
    toast.info(`Template "${template.title}" selected`);
  };

  const handleShareCode = () => {
    // Implementation for sharing code would go here
    navigator.clipboard.writeText(window.location.href);
    toast.success("Share link copied to clipboard!");
  };

  const handleDownloadCode = () => {
    // Implementation for downloading code would go here
    toast.success("Code downloaded successfully!");
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-50"
    )}>
      <Header />
      
      <main className="flex-grow pt-16 pb-16 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <AnimatePresence>
            {!showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-8"
              >
                <div className="flex justify-center mb-4">
                  <GeminiLogo size={64} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Text to Web Application
                </h1>
                <p className="text-xl text-muted-foreground">
                  Describe your web application and Gemini AI will build it for you. No coding required.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!showResult ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <Tabs defaultValue="create" className="max-w-6xl mx-auto">
                  <TabsList className="grid grid-cols-2 mb-8 w-full max-w-md mx-auto">
                    <TabsTrigger value="create" className="text-sm md:text-base">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="text-sm md:text-base">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      Templates
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="create" className="animate-fade-in">
                    <AnimatedGradientBorder className="shadow-lg" borderWidth={2}>
                      <Card className="border-0 bg-background/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                            Describe Your Web Application
                          </CardTitle>
                          <CardDescription>
                            Be detailed about layout, functionality, and design for best results
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <Textarea
                              placeholder="Describe the web application you want to create. Be as detailed as possible about the layout, components, functionality, and design."
                              className="min-h-[200px] resize-none text-base"
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                            />
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="advanced-options"
                                checked={advancedOptions}
                                onCheckedChange={setAdvancedOptions}
                              />
                              <Label htmlFor="advanced-options">Show advanced options</Label>
                            </div>
                            
                            {advancedOptions && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-background/50 rounded-lg border">
                                <div className="space-y-2">
                                  <Label htmlFor="framework">Framework</Label>
                                  <Select 
                                    value={selectedFramework}
                                    onValueChange={setSelectedFramework}
                                  >
                                    <SelectTrigger id="framework">
                                      <SelectValue placeholder="Select framework" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="react">React</SelectItem>
                                      <SelectItem value="react-ts">React + TypeScript</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="auto-run">Auto Run Code</Label>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="auto-run"
                                      checked={autoRunCode}
                                      onCheckedChange={setAutoRunCode}
                                    />
                                    <Label htmlFor="auto-run">
                                      {autoRunCode ? "Enabled" : "Disabled"}
                                    </Label>
                                  </div>
                                </div>
                                
                                <div className="space-y-2 md:col-span-2">
                                  <Label>View Mode</Label>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant={viewMode === "split" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setViewMode("split")}
                                      className="flex-1"
                                    >
                                      <LayoutGrid className="mr-2 h-4 w-4" />
                                      Split
                                    </Button>
                                    <Button
                                      variant={viewMode === "preview-only" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setViewMode("preview-only")}
                                      className="flex-1"
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      Preview Only
                                    </Button>
                                    <Button
                                      variant={viewMode === "editor-only" ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setViewMode("editor-only")}
                                      className="flex-1"
                                    >
                                      <Code className="mr-2 h-4 w-4" />
                                      Code Only
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row justify-end gap-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={handleGenerate}
                                      disabled={isGenerating || !prompt.trim()}
                                      className="relative overflow-hidden group"
                                      size="lg"
                                    >
                                      {isGenerating ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Generating...
                                        </>
                                      ) : (
                                        <>
                                          <Zap className="mr-2 h-4 w-4" />
                                          Generate Web App
                                        </>
                                      )}
                                      <span className="absolute inset-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Create a web app based on your description using AI
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedGradientBorder>
                  </TabsContent>
                  
                  <TabsContent value="templates" className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {exampleTemplates.map((template, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <AnimatedGradientBorder
                            containerClassName="h-full"
                            borderWidth={2}
                          >
                            <Card className="h-full bg-background/80 backdrop-blur-sm border-0 cursor-pointer transition-all duration-300 hover:shadow-lg"
                                  onClick={() => handleSelectTemplate(template)}>
                              <CardHeader>
                                <div className="mb-3">{template.icon}</div>
                                <CardTitle>{template.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <p className="text-muted-foreground text-sm">
                                  {template.description}
                                </p>
                              </CardContent>
                              <CardFooter>
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectTemplate(template);
                                  }}
                                >
                                  Use Template
                                </Button>
                              </CardFooter>
                            </Card>
                          </AnimatedGradientBorder>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      Generated Web Application
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Your application is ready to use and modify
                    </p>
                  </div>
                  
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <Button variant="outline" onClick={handleShareCode} size="sm">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" onClick={handleDownloadCode} size="sm">
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button onClick={() => setShowResult(false)} size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New App
                    </Button>
                  </div>
                </div>
                
                {generatedFiles && Object.keys(generatedFiles).length > 0 && (
                  <SandpackPreview
                    files={generatedFiles}
                    dependencies={{
                      "lucide-react": "latest",
                      "react-router-dom": "latest",
                      "tailwindcss": "^3.3.0",
                      "@tailwindcss/forms": "^0.5.7",
                      "framer-motion": "^10.12.16"
                    }}
                    className="w-full"
                    showFiles={true}
                    layout={viewMode}
                    autorun={autoRunCode}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {isGenerating && (
            <div className="mt-8 mb-4">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Terminal className="mr-2 h-5 w-5 text-primary" />
                    Generating Your Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressIndicator isGenerating={isGenerating} className="mb-6" />
                  
                  <div className="space-y-2 mb-4">
                    {generationSteps.slice(0, currentStep + 1).map((step, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "flex items-center text-sm",
                          index < currentStep ? "text-muted-foreground" : "text-foreground font-medium"
                        )}
                      >
                        {index < currentStep ? (
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        ) : (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                        )}
                        {step}
                      </div>
                    ))}
                  </div>
                  
                  {isTyping && codeSnippets.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
                      <div className="flex items-center mb-2">
                        <Code className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-400 font-mono">Generating code...</span>
                      </div>
                      <TypingAnimation 
                        text={codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
                        speed={10}
                        className="text-xs text-gray-300 whitespace-pre-wrap"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 border border-red-300 bg-red-50 text-red-800 rounded-md"
            >
              <h3 className="font-bold mb-2 flex items-center">
                <Info className="mr-2 h-5 w-5" />
                Error
              </h3>
              <p>{error}</p>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GeneratorPage;
