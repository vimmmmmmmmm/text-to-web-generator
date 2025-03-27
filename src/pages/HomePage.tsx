
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Zap, Sparkles, Layout } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GeminiLogo from "@/components/ui/GeminiLogo";
import AnimatedGradientBorder from "@/components/ui/AnimatedGradientBorder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CodeEditor from "@/components/CodeEditor";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 -z-10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 dark:bg-blue-600 dark:opacity-10" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 dark:bg-purple-600 dark:opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <div className="flex justify-center mb-6">
                <GeminiLogo size={80} />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Transform Text into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Web Applications</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10">
                Use Google's Gemini AI to build beautiful, responsive web applications from natural language descriptions. No coding required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/generator">
                  <Button size="lg" className="group">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-background" id="features">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform leverages the latest Gemini 2.0 Flash model to provide a seamless experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedGradientBorder containerClassName="h-full">
                <Card className="h-full border-0 bg-background/90">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-gem-blue mb-4" />
                    <CardTitle>AI-Powered Development</CardTitle>
                    <CardDescription>
                      Gemini 2.0 Flash understands your requirements and generates production-ready code instantly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our advanced AI engine translates natural language into clean, well-structured React components styled with Tailwind CSS.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
              
              <AnimatedGradientBorder containerClassName="h-full">
                <Card className="h-full border-0 bg-background/90">
                  <CardHeader>
                    <Layout className="h-8 w-8 text-gem-yellow mb-4" />
                    <CardTitle>Live Preview Environment</CardTitle>
                    <CardDescription>
                      Instantly preview your generated application in a sandboxed environment.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      See your application come to life in real-time with our integrated Sandpack preview that renders your code as you generate it.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
              
              <AnimatedGradientBorder containerClassName="h-full">
                <Card className="h-full border-0 bg-background/90">
                  <CardHeader>
                    <Code className="h-8 w-8 text-gem-green mb-4" />
                    <CardTitle>Editable Code</CardTitle>
                    <CardDescription>
                      Customize the generated code to meet your exact requirements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Access and modify the source code directly in our editor, or download it to continue development in your preferred environment.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>
          </div>
        </section>
        
        {/* Demo/Example Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/30" id="examples">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From text prompt to fully functional web application in seconds
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium text-sm mb-2">
                    Step 1
                  </div>
                  <h3 className="text-2xl font-bold">Describe Your Application</h3>
                  <p className="text-muted-foreground">
                    Enter a detailed description of the web application you want to create. The more specific you are, the better the results.
                  </p>
                </div>
                
                <CodeEditor
                  code="Create a product landing page for a smart watch with a hero section, feature list, pricing table, and contact form. Use a dark theme with blue accents."
                  language="text"
                  className="max-w-lg"
                />
                
                <div className="space-y-2 pt-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium text-sm mb-2">
                    Step 2
                  </div>
                  <h3 className="text-2xl font-bold">Generate & Preview</h3>
                  <p className="text-muted-foreground">
                    Our AI analyzes your description and generates all the necessary code components. Preview the result in real-time.
                  </p>
                </div>
              </div>
              
              <AnimatedGradientBorder containerClassName="w-full h-full">
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <div className="rounded-lg overflow-hidden border border-border">
                    <div className="bg-slate-800 p-2 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-xs text-slate-400">Preview</div>
                      <div></div>
                    </div>
                    <div className="aspect-video bg-slate-900 flex items-center justify-center">
                      <div className="text-white text-center p-8">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-2xl font-bold mb-2">Your App Preview</h3>
                        <p className="text-slate-300">
                          A live preview of your generated application would appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedGradientBorder>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 -z-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Build Your Web Application?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Start creating beautiful, responsive web applications with AI today. No coding skills required.
              </p>
              
              <Link to="/generator">
                <Button size="lg" className="group">
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
