import { toast } from "sonner";

// Using the provided API key
const API_KEY = "AIzaSyDKZrklTOLbGfsCvY_77vToxsD__N_uXXk";

interface GenerateImageResponse {
  imageUrl: string;
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    // Real API call to Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        contents: [{ text: prompt }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      })
    });

    const data = await response.json();
    console.log("Gemini API response:", data);
    
    // Note: Gemini Pro Vision doesn't actually generate images
    // We'll still use placeholder images for demo purposes
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
