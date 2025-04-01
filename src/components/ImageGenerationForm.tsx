
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from "sonner";

interface ImageGenerationFormProps {
  onGenerateImage: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  placeholder?: string;
  buttonText?: string;
  label?: string;
}

const ImageGenerationForm = ({ 
  onGenerateImage, 
  isGenerating, 
  placeholder = "Describe the image you want to generate...",
  buttonText = "Generate Image",
  label = "Interior Description"
}: ImageGenerationFormProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      console.log("Submitting prompt:", prompt);
      await onGenerateImage(prompt);
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
