
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Send, CheckCircle, RotateCcw, Share, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { downloadImage, generateImage } from '@/services/geminiService';
import ImageGenerationForm from '@/components/ImageGenerationForm';
import ImageDisplay from '@/components/ImageDisplay';

const Editor = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editHistory, setEditHistory] = useState<{id: string, timestamp: string, description: string, thumbnail: string}[]>([]);
  const [showProcessingOverlay, setShowProcessingOverlay] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access the editor');
      navigate('/');
      return;
    }
    
    const storedImage = localStorage.getItem('editImage');
    if (storedImage) {
      setImageUrl(storedImage);
      setEditHistory([
        {
          id: '1',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: 'Original image',
          thumbnail: storedImage
        }
      ]);
      setCurrentVersion(0);
    } else {
      toast.error('No image found. Please upload an image first.');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to edit the image');
      return;
    }
    
    setIsProcessing(true);
    setShowProcessingOverlay(true);
    setError(null);
    
    try {
      console.log("Generating image with prompt:", prompt);
      const generatedImageUrl = await generateImage(prompt, imageUrl || undefined);
      
      if (generatedImageUrl) {
        const newVersion = {
          id: (editHistory.length + 1).toString(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: prompt,
          thumbnail: generatedImageUrl
        };
        
        setEditHistory([...editHistory, newVersion]);
        setCurrentVersion(editHistory.length);
        setImageUrl(generatedImageUrl);
        
        toast.success('Image generated successfully');
      } else {
        setError('Failed to generate image - no image was returned from the API');
        toast.error('Failed to generate image - no image was returned from the API');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setShowProcessingOverlay(false);
    }
  };

  const handleVersionSelect = (index: number) => {
    setCurrentVersion(index);
    if (editHistory[index]) {
      setImageUrl(editHistory[index].thumbnail);
      setError(null);
    }
  };

  const handleViewOriginal = () => {
    if (editHistory.length > 0) {
      setCurrentVersion(0);
      setImageUrl(editHistory[0].thumbnail);
      setError(null);
    }
  };

  const handleDownloadImage = () => {
    if (imageUrl) {
      downloadImage(imageUrl, `generated-image-${Date.now()}.png`);
    } else {
      toast.error('No image to download');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        <div className="w-16 border-r bg-white flex-shrink-0">
          <div className="p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleGoBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 p-6 flex">
          <div className="flex-1 flex flex-col">
            <div className="mb-4 flex items-center">
              <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-medium flex items-center">
                <span className="mr-1">AI Generated</span>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <ImageDisplay 
                imageUrl={imageUrl}
                isGenerating={isProcessing}
                onDownload={handleDownloadImage}
                error={error}
              />
              
              {showProcessingOverlay && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Processing your edit...</h3>
                    <p className="text-sm text-gray-500 mb-4">This may take a few moments</p>
                    <div className="w-64 mx-auto">
                      <Progress value={45} className="h-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 px-4 py-6 bg-white rounded-lg border">
              <h3 className="font-medium mb-4">Generate interior design with your furniture</h3>
              <ImageGenerationForm 
                onGenerateImage={handlePromptSubmit}
                isGenerating={isProcessing}
                placeholder="Describe the interior setting for your furniture - e.g., 'Modern minimalist living room with white walls, wooden floor, and natural light'"
                buttonText="Generate Interior Design"
                label="Describe your ideal interior setting"
                requireAuth={false}
              />
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleViewOriginal}>
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleDownloadImage}
                  disabled={!imageUrl || isProcessing}
                >
                  <Download className="h-5 w-5" />
                  Download
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2" disabled={!imageUrl || isProcessing}>
                  <Share className="h-5 w-5" />
                  Share
                </Button>
                
                <Button className="flex items-center gap-2" disabled={!imageUrl || isProcessing}>
                  <CheckCircle className="h-5 w-5" />
                  Finalize and save
                </Button>
              </div>
            </div>
          </div>
          
          <div className="w-72 ml-6">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <h3 className="font-medium">Edit History</h3>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                {editHistory.map((version, index) => (
                  <div 
                    key={version.id}
                    className={`p-4 flex items-start space-x-3 hover:bg-gray-50 cursor-pointer ${currentVersion === index ? 'border-l-2 border-blue-500' : ''}`}
                    onClick={() => handleVersionSelect(index)}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      <img src={version.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {index === 0 ? 'Original' : `Version ${index}`}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1">{version.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{version.timestamp}</p>
                    </div>
                    
                    {currentVersion === index && (
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 text-sm"
                  onClick={handleViewOriginal}
                >
                  <ArrowLeft className="h-4 w-4" />
                  View Original
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
