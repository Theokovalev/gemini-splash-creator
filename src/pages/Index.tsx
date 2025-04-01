
import React, { useState } from 'react';
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleGenerateImage = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
      toast.success('Image generated successfully!');
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
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
    } else {
      setActiveTab('upload');
    }
  };

  const handleAuthSuccess = () => {
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Edit Images with <span className="text-primary">AI</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload an image or generate one with AI, then use your words to
            describe what you want to change - no design skills required.
          </p>
          
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
              Upload Image
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
              Generate Photo
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => toast.info('Editing tools coming soon!')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5C19.3284 2.5 20 3.17157 20 4C20 4.82843 19.3284 5.5 18.5 5.5L12 12L8 13L9 9L15.5 2.5C16.3284 2.5 17 3.17157 17 4C17 4.82843 16.3284 5.5 15.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Editing Tools
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="generate">Generate</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="pt-6">
                <DropZone onFileSelect={handleFileSelect} />
              </TabsContent>
              
              <TabsContent value="generate" className="pt-6">
                <ImageGenerationForm 
                  onGenerateImage={handleGenerateImage}
                  isGenerating={isGenerating}
                />
              </TabsContent>
            </Tabs>
            
            <p className="text-sm text-center text-gray-500 mt-2">
              {activeTab === 'upload' ? 
                'Supported formats: JPEG, PNG, and more!' : 
                'Describe the image you want to create in detail'}
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
        
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            title="Upload or Generate"
            description="Start with your own image or let AI create one for you"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 14V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V14" />
                <path d="M12 3L12 15" />
                <path d="M8 7L12 3L16 7" />
              </svg>
            }
          />
          
          <FeatureCard 
            title="Edit"
            description="Describe changes using natural language"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H18C18.5523 20 19 19.5523 19 19V12" />
                <path d="M18.5 2.5C19.3284 2.5 20 3.17157 20 4C20 4.82843 19.3284 5.5 18.5 5.5L12 12L8 13L9 9L15.5 2.5C16.3284 2.5 17 3.17157 17 4C17 4.82843 16.3284 5.5 15.5 5.5" />
              </svg>
            }
          />
          
          <FeatureCard 
            title="Download"
            description="Save your professionally edited image"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" />
                <path d="M7 10L12 15L17 10" />
                <path d="M12 15V3" />
              </svg>
            }
          />
        </div>
      </main>
      
      <footer className="py-6 border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">PicPrompter</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PicPrompter
          </p>
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
