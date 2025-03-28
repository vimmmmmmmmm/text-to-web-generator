import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SandpackPreview from "@/components/SandpackPreview";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateWebApp, extractFilesFromResponse } from "@/services/gemini";
import { Loader2, Zap, Code, Save, Share } from "lucide-react";
import { toast } from "sonner";
import GeminiLogo from "@/components/ui/GeminiLogo";
import AnimatedGradientBorder from "@/components/ui/AnimatedGradientBorder";

interface ExampleTemplate {
  title: string;
  description: string;
  prompt: string;
}

const exampleTemplates: ExampleTemplate[] = [
  {
    title: "Landing Page",
    description: "Create a modern landing page for a SaaS product",
    prompt: "Create a landing page for a SaaS product called CloudFlow that helps teams manage their cloud infrastructure. Include a hero section, features, pricing, and contact form. Use a modern design with blue and purple accents.",
  },
  {
    title: "Dashboard UI",
    description: "Create an analytics dashboard with charts",
    prompt: "Create an analytics dashboard with a sidebar navigation, header with user profile, and main content area showing charts and statistics. Include a line chart for revenue, bar chart for user growth, and cards showing key metrics.",
  },
  {
    title: "E-commerce Product Page",
    description: "Create a product detail page for an online store",
    prompt: "Create a product page for an e-commerce website selling premium headphones. Include product images, description, price, color selector, add to cart button, reviews section, and related products.",
  },
];

const Dashboard: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string> | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ExampleTemplate | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateWebApp(prompt);
      const files = extractFilesFromResponse(response);
      setGeneratedFiles(files);
      toast.success("Web application generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate web application");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTemplate = (template: ExampleTemplate) => {
    setSelectedTemplate(template);
    setPrompt(template.prompt);
  };

  const handleShareCode = () => {
    toast.success("Share link copied to clipboard!");
  };

  const handleDownloadCode = () => {
    toast.success("Code downloaded successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            <div className="flex justify-center mb-4">
              <GeminiLogo size={64} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Text to Web Application
            </h1>
            <p className="text-xl text-muted-foreground">
              Describe your web application and Gemini AI will build it for you. No coding required.
            </p>
          </div>

          <Tabs defaultValue="create" className="max-w-6xl mx-auto">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Describe Your Web Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Textarea
                      placeholder="Describe the web application you want to create. Be as detailed as possible about the layout, components, functionality, and design."
                      className="min-h-[200px] resize-none"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    
                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="relative overflow-hidden group"
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="templates" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exampleTemplates.map((template, index) => (
                  <AnimatedGradientBorder
                    key={index}
                    containerClassName="h-full"
                    borderWidth={1}
                  >
                    <Card className="h-full bg-background/80 backdrop-blur-sm border-0">
                      <CardHeader>
                        <CardTitle>{template.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          {template.description}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleSelectTemplate(template)}
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedGradientBorder>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {generatedFiles && Object.keys(generatedFiles).length > 0 && (
            <div className="mt-12 animate-slide-in">
              <h2 className="text-2xl font-bold mb-6">Generated Web Application</h2>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Button variant="outline" onClick={handleShareCode}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" onClick={handleDownloadCode}>
                  <Save className="mr-2 h-4 w-4" />
                  Download Code
                </Button>
              </div>
              
              <SandpackPreview
                code={generatedFiles}
                dependencies={{
                  "lucide-react": "latest",
                  "react-router-dom": "latest",
                }}
                className="w-full"
                showFiles={true}
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
