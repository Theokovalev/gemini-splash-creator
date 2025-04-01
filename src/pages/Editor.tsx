
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Send, CheckCircle, RotateCcw, Share, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

const Editor = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to access the editor');
      navigate('/');
    }
    
    // Check if there's an image in localStorage (from previous upload)
    const storedImage = localStorage.getItem('editImage');
    if (storedImage) {
      setImageUrl(storedImage);
    }
  }, [isAuthenticated, navigate]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPrompt.trim()) {
      toast.error('Please enter a prompt to edit the image');
      return;
    }
    
    setIsProcessing(true);
    // Simulate API call to process the image
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Image edited successfully');
      // In a real app, you would replace this with the actual API call
      // and update the imageUrl with the response
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex">
        {/* Left sidebar with back button */}
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
        
        {/* Main content area */}
        <div className="flex-1 p-6 flex">
          {/* Image display area */}
          <div className="flex-1 flex flex-col">
            <div className="mb-4 flex items-center">
              <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-medium flex items-center">
                <span className="mr-1">AI Edited</span>
              </div>
            </div>
            
            <Card className="flex-1 flex items-center justify-center overflow-hidden bg-white">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Uploaded" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center p-8">
                  <p>No image uploaded. Go back to upload an image.</p>
                </div>
              )}
            </Card>
            
            <div className="mt-4">
              <form onSubmit={handlePromptSubmit} className="flex items-center gap-2 relative">
                <div className="flex items-center border rounded-full bg-white w-full overflow-hidden pr-12">
                  <div className="pl-4">
                    <div className="h-6 w-6 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                      </svg>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="What changes would you like to make to this image?"
                    className="flex-1 p-3 focus:outline-none"
                  />
                  <div className="absolute right-3">
                    <Button 
                      type="submit" 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full bg-blue-100 p-0"
                      disabled={isProcessing || !editPrompt.trim()}
                    >
                      <Send className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Share className="h-5 w-5" />
                  Share
                </Button>
                
                <Button className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Finalize and save
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right sidebar with edit history */}
          <div className="w-72 ml-6">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center mb-4">
                <History className="h-5 w-5 mr-2 text-gray-500" />
                <h3 className="font-medium">Edit History</h3>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 flex items-start space-x-3 hover:bg-gray-50 cursor-pointer border-l-2 border-blue-500">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                    <img src="/lovable-uploads/9439e7ce-a4ac-4af9-82c0-dbed8329f4ed.png" alt="Thumbnail" className="w-full h-full object-cover rounded-md" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Original</p>
                    <p className="text-xs text-gray-500">Original image</p>
                    <p className="text-xs text-gray-400 mt-1">10:43</p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 text-sm">
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
