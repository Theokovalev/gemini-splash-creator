
import { toast } from "sonner";

// Using the provided API key
const API_KEY = "AIzaSyDKZrklTOLbGfsCvY_77vToxsD__N_uXXk";

export async function generateImage(prompt: string): Promise<string> {
  try {
    // Use the correct Gemini API endpoint for image generation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        config: {
          responseModalities: ["Text", "Image"]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini API response:", data);
    
    // Extract the image data from the response
    try {
      if (data.candidates && 
          data.candidates[0] && 
          data.candidates[0].content && 
          data.candidates[0].content.parts) {
        
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData) {
            // Convert base64 to a data URL that can be displayed in an image tag
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      
      // If we couldn't find an image in the response, throw an error
      throw new Error("No image found in the response");
    } catch (extractError) {
      console.error("Error extracting image from response:", extractError);
      console.log("Full response:", JSON.stringify(data, null, 2));
      
      // Fallback to placeholder images if there's an error parsing the response
      const placeholderImages = [
        "https://picsum.photos/seed/img1/800/800",
        "https://picsum.photos/seed/img2/800/800",
        "https://picsum.photos/seed/img3/800/800",
        "https://picsum.photos/seed/img4/800/800"
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      toast.warning("Couldn't generate image, using placeholder instead");
      return randomImage;
    }
    
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error("Failed to generate image. Please try again.");
    
    // Return a placeholder image in case of error
    return "https://picsum.photos/seed/error/800/800";
  }
}

export async function downloadImage(imageUrl: string, filename = "generated-image.jpg") {
  try {
    // Handle data URLs (base64 images)
    if (imageUrl.startsWith('data:')) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      return;
    }
    
    // Handle regular URLs
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
