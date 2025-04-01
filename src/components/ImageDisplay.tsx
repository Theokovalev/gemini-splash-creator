
import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ImageDisplayProps {
  imageUrl: string | null;
  isGenerating: boolean;
  onDownload: () => void;
  onRetry?: () => void;
  error?: string | null;
}

const ImageDisplay = ({ imageUrl, isGenerating, onDownload, onRetry, error }: ImageDisplayProps) => {
  if (isGenerating) {
    return (
      <Card className="relative overflow-hidden aspect-square flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Generating your image...</p>
          <p className="text-gray-400 text-sm max-w-md text-center">
            This may take up to 30 seconds. The AI is creating a custom interior design image for you.
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    const isTextResponse = error.includes("text instead of an image");
    const isEmptyResponse = error.includes("No image found");
    
    return (
      <Card className="relative overflow-hidden aspect-square flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4 text-center p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="font-medium text-red-500">Generation Failed</p>
          <p className="text-gray-500 text-sm">{error}</p>
          
          {(isTextResponse || isEmptyResponse) && (
            <Alert className="bg-amber-50 border-amber-200 mt-2">
              <HelpCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Suggestion</AlertTitle>
              <AlertDescription className="text-xs">
                Try using more specific descriptive terms about the interior space - like "minimalist living room with wooden floors" or "modern kitchen with white cabinets and marble countertops".
              </AlertDescription>
            </Alert>
          )}
          
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="mt-2 text-sm"
              size="sm"a
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (!imageUrl) {
    return (
      <Card className="relative overflow-hidden aspect-square flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 14v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m14-4l-3-3m0 0l-3 3m3-3v12M3 9l3-3m0 0l3 3m-3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Upload an image or generate one using AI
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group">
      <img 
        src={imageUrl} 
        alt="Generated or uploaded image" 
        className="w-full h-auto object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '/placeholder.svg';
          console.error('Image failed to load:', imageUrl);
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex justify-end gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onDownload}
            className="text-xs"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ImageDisplay;
