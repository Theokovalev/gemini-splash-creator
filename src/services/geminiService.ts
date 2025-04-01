
import { toast } from "sonner";

// Since we're using a public API key for demo purposes
const API_KEY = "YOUR_GEMINI_API_KEY";

interface GenerateImageResponse {
  imageUrl: string;
}

export async function generateImage(prompt: string): Promise<string> {
  // In a real application, you would call the Gemini API
  // For demo purposes, we'll simulate a response
  
  try {
    // This is a placeholder for the actual API call
    // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     contents: [{ text: prompt }],
    //     generationConfig: {
    //       temperature: 0.4,
    //       topK: 32,
    //       topP: 1,
    //       maxOutputTokens: 4096,
    //     }
    //   })
    // });
    
    // For demo, simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a placeholder image URL
    // In a real app, you would parse the API response
    const placeholderImages = [
      "https://picsum.photos/seed/img1/800/800",
      "https://picsum.photos/seed/img2/800/800",
      "https://picsum.photos/seed/img3/800/800",
      "https://picsum.photos/seed/img4/800/800"
    ];
    
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    return randomImage;
    
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error("Failed to generate image. Please try again.");
    throw error;
  }
}

export async function downloadImage(imageUrl: string, filename = "generated-image.jpg") {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading image:", error);
    toast.error("Failed to download image. Please try again.");
  }
}
