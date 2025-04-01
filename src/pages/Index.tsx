import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DropZone from '@/components/DropZone';
import FeatureCard from '@/components/FeatureCard';
import ImageGenerationForm from '@/components/ImageGenerationForm';
import ImageDisplay from '@/components/ImageDisplay';
import AuthDialog from '@/components/AuthDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateImage, downloadImage } from '@/services/geminiService';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    localStorage.setItem('editImage', url);
    
    if (isAuthenticated) {
      toast.success('Image uploaded successfully! Redirecting to editor...');
      setTimeout(() => {
        navigate('/editor');
      }, 1000);
    }
  };

  const handleGenerateImage = async (prompt: string) => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    setIsGenerating(true);
    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
      
      localStorage.setItem('editImage', url);
      
      toast.success('Image generated successfully!');
      
      setTimeout(() => {
        navigate('/editor');
      }, 1000);
      
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      downloadImage(imageUrl);
    }
  };

  const handleUploadClick = () => {
    setActiveTab('upload');
  };

  const handleAuthSuccess = () => {
    if (imageUrl) {
      toast.success('Authentication successful! Redirecting to editor...');
      setTimeout(() => {
        navigate('/editor');
      }, 1000);
    }
  };

  const handleEditClick = () => {
    if (!imageUrl) {
      toast.error('Please upload or generate an image first');
      return;
    }
    
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    
    navigate('/editor');
  };

  const handleAuthRequired = () => {
    setIsAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Photorealistic images of your furniture <span className="text-primary">in seconds</span>
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Empower your furniture brand with a tool that eliminates costly photoshoots and expensive designers. 
            Create, edit, and perfect your interior images in minutes with an intuitive, AI-driven interface.
          </p>
          
          {/* Insert the before/after image */}
          <div className="max-w-4xl mx-auto my-8 rounded-lg overflow-hidden shadow-xl">
            <img 
              src="/lovable-uploads/85125504-2d24-4dee-ba30-87b11b243c7f.png" 
              alt="Before and after comparison showing furniture visualization" 
              className="w-full h-auto"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button 
              className="flex items-center gap-2"
              onClick={handleUploadClick}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 14V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 7L12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setActiveTab('generate')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Generate Interior
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleEditClick}
              disabled={!imageUrl}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5C19.3284 2.5 20 3.17157 20 4C20 4.82843 19.3284 5.5 18.5 5.5L12 12L8 13L9 9L15.5 2.5C16.3284 2.5 17 3.17157 17 4C17 4.82843 16.3284 5.5 15.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit Your Image
            </Button>
          </div>
        </div>
        
        {/* Interactive Prompt Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="generate">Generate Interior</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="pt-6">
                <DropZone 
                  onFileSelect={handleFileSelect} 
                  onAuthRequired={handleAuthRequired}
                />
              </TabsContent>
              
              <TabsContent value="generate" className="pt-6">
                <ImageGenerationForm 
                  onGenerateImage={handleGenerateImage}
                  isGenerating={isGenerating}
                  placeholder="Describe your perfect interior – e.g., 'Modern living room with minimalist furniture and natural light, ready for quick edits'."
                  buttonText="Create My Image"
                />
              </TabsContent>
            </Tabs>
            
            <p className="text-sm text-center text-gray-500 mt-2">
              {activeTab === 'upload' ? 
                'Upload reference images of your furniture or interiors to enhance results.' : 
                'A detailed description helps our AI create exactly what you need.'}
            </p>
          </div>
          
          <div>
            <ImageDisplay 
              imageUrl={imageUrl}
              isGenerating={isGenerating}
              onDownload={handleDownload}
            />
          </div>
        </div>
        
        {/* Features Section */}
        <h2 className="text-2xl font-bold text-center mb-8">Why Furniture Brands Choose Us</h2>
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <FeatureCard 
            title="Instant Results"
            description="Get professional-quality interior images without expensive photoshoots or design teams."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 14V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V14" />
                <path d="M12 3L12 15" />
                <path d="M8 7L12 3L16 7" />
              </svg>
            }
          />
          
          <FeatureCard 
            title="Easy Editing"
            description="Fine-tune images with simple editing tools - adjust lighting, color, and layout to match your brand."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" />
                <path d="M18.5 2.5C19.3284 2.5 20 3.17157 20 4C20 4.82843 19.3284 5.5 18.5 5.5L12 12L8 13L9 9L15.5 2.5C16.3284 2.5 17 3.17157 17 4C17 4.82843 16.3284 5.5 15.5 5.5" />
              </svg>
            }
          />
          
          <FeatureCard 
            title="Cost-Effective"
            description="Reduce overhead and turnaround time by creating visuals ready for e-commerce and marketing."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
          />
          
          <FeatureCard 
            title="User-Friendly"
            description="Enjoy a streamlined interface designed to fit into your creative process effortlessly."
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            }
          />
        </div>
        
        {/* How It Works Section */}
        <div className="bg-white rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
              <h3 className="font-medium mb-2">Upload Image of Your Furniture</h3>
              <p className="text-gray-600 text-sm">It could be an image from a factory or one made with your phone.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
              <h3 className="font-medium mb-2">Describe Your Perfect Interior</h3>
              <p className="text-gray-600 text-sm">Our AI processes your description to deliver a suite of tailored interior images in moments.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
              <h3 className="font-medium mb-2">Edit & Download</h3>
              <p className="text-gray-600 text-sm">Describe your edits to change colour, lighting or angles. Hit dowload to get your image. Feel free to use it on your website or marketplaces.</p>
            </div>
          </div>
        </div>
        
        {/* Product Categories Section */}
        <div className="mb-16">
          <img 
            src="/lovable-uploads/7be9e94c-de92-46b2-b8c7-020d63caa3c3.png" 
            alt="Furniture product categories including dressers, bookcases, sofas, and more" 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </main>
      
      {/* Footer Section */}
      <footer className="py-8 border-t mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                <a href="#" className="hover:text-primary">Features</a>
                <a href="#" className="hover:text-primary">Pricing</a>
                <a href="#" className="hover:text-primary">About</a>
                <a href="#" className="hover:text-primary">FAQ</a>
                <a href="#" className="hover:text-primary">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Contact</h3>
              <p className="text-sm text-gray-600">Need assistance? Our team is here to help you every step of the way.</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <p className="text-sm text-gray-600">© 2025 Vinteo AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
