
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from './ui/alert';
import { HelpCircle } from 'lucide-react';

interface ImageGenerationFormProps {
  onGenerateImage: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  placeholder?: string;
  buttonText?: string;
  label?: string;
  requireAuth?: boolean;
  onAuthRequired?: () => void;
}

const ImageGenerationForm = ({ 
  onGenerateImage, 
  isGenerating, 
  placeholder = "Describe the image you want to generate...",
  buttonText = "Generate Image",
  label = "Interior Description",
  requireAuth = true,
  onAuthRequired
}: ImageGenerationFormProps) => {
  const [prompt, setPrompt] = useState('');
  const [showHint, setShowHint] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      toast.error('Please enter a prompt');
      return;
    }

    // Show hint for very simple prompts
    if (trimmedPrompt.split(' ').length < 3 && !showHint) {
      setShowHint(true);
      toast.warning('Your prompt is very short. Adding more details will give better results.');
      return;
    }

    // Check authentication if required
    if (requireAuth && !isAuthenticated && onAuthRequired) {
      onAuthRequired();
      return;
    }

    try {
      console.log("Submitting prompt:", trimmedPrompt);
      setShowHint(false); // Hide hint when submitting
      await onGenerateImage(trimmedPrompt);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to generate image. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block mb-2 text-sm font-medium">
          {label}
        </label>
        <Textarea
          id="prompt"
          placeholder={placeholder}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-24"
        />
        
        {showHint && (
          <Alert className="mt-2 bg-blue-50 border-blue-100">
            <HelpCircle className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs text-blue-700">
              <strong>Tip:</strong> Be specific about colors, materials, style, and lighting. 
              <br />
              Example: "A modern Scandinavian living room with light oak floors, white walls, gray sofa, and large windows letting in natural light"
            </AlertDescription>
          </Alert>
        )}
      </div>
      <Button 
        type="submit" 
        className="w-full flex items-center justify-center gap-2"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
            Generating...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {buttonText}
          </>
        )}
      </Button>
    </form>
  );
};

export default ImageGenerationForm;
