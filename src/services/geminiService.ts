
import { toast } from "sonner";

// Using the provided API key
const API_KEY = "AIzaSyDKZrklTOLbGfsCvY_77vToxsD__N_uXXk";

export async function generateImage(prompt: string): Promise<string> {
  try {
    // Correct Gemini API call using gemini-2.0-flash model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini API response:", data);
    
    // Note: Gemini doesn't directly return image URLs in this endpoint
    // For a real implementation, you would need to use a dedicated image generation API
    // For this demo, we're still using placeholder images
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
