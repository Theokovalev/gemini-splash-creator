
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { toast } from "sonner";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

const DropZone = ({ onFileSelect }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check if the file is an image
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    onFileSelect(file);
    toast.success('Image uploaded successfully');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8
        flex flex-col items-center justify-center
        transition-colors
        ${isDragging ? 'border-primary bg-blue-50' : 'border-gray-300'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        accept="image/*"
      />
      
      <p className="text-center mb-4 font-medium">Drag & drop or click to upload</p>
      
      <Button 
        onClick={triggerFileInput}
        className="flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 14V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 7L12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Upload Image
      </Button>
      
      <p className="text-xs text-gray-500 mt-4">Supported formats: JPEG, PNG, and more!</p>
    </div>
  );
};

export default DropZone;
