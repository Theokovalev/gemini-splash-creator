
import { toast } from "sonner";

// Using the provided API key
const API_KEY = "AIzaSyDKZrklTOLbGfsCvY_77vToxsD__N_uXXk";

export async function generateImage(prompt: string, referenceImage?: string): Promise<string> {
  try {
    console.log("Generating image with prompt:", prompt);
    console.log("Reference image provided:", !!referenceImage);
    
    // Create the request body based on whether we have a reference image
    const requestBody: any = {
      contents: [{
        parts: []
      }],
      // Setting proper generation parameters
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 0,
        maxOutputTokens: 8192,
      }
    };
    
    // Add prompt text to parts
    requestBody.contents[0].parts.push({ 
      text: `Create a photorealistic interior design image of: ${prompt}. Make it look like a professional interior photography for furniture marketing. The image should be high quality and detailed.` 
    });
    
    // If reference image is provided, add it to the request
    if (referenceImage) {
      // Check if it's a data URL
      if (referenceImage.startsWith('data:')) {
        // Extract mime type and base64 data from the data URL
        const [metaPart, dataPart] = referenceImage.split(',');
        const mimeType = metaPart.split(':')[1].split(';')[0];
        
        // Add the image to the request
        requestBody.contents[0].parts.push({
          inlineData: {
            mimeType: mimeType,
            data: dataPart
          }
        });
      } else {
        // For regular URLs, fetch and convert to base64
        const response = await fetch(referenceImage);
        const blob = await response.blob();
        const base64Data = await blobToBase64(blob);
        const mimeType = blob.type;
        
        // Add the image to the request
        requestBody.contents[0].parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }
    }
    
    console.log("Request structure:", JSON.stringify(requestBody, null, 2));
    
    // Use the correct endpoint for image generation with gemini-2.0-flash-exp-image-generation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
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
      
      throw new Error("No image found in the response");
    } catch (extractError) {
      console.error("Error extracting image from response:", extractError);
      console.log("Full response structure:", JSON.stringify(data, null, 2));
      throw new Error("Failed to extract image from API response");
    }
    
  } catch (error) {
    console.error("Error generating image:", error);
    toast.error(`Failed to generate image: ${error.message || "Unknown error"}`);
    throw error; // Re-throw the error to be handled by the calling function
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

export async function editImage(imageUrl: string, editPrompt: string): Promise<string> {
  try {
    console.log("Editing image with prompt:", editPrompt);
    
    // Convert image URL to base64 if it's not already a data URL
    let base64Image: string;
    let mimeType: string;
    
    if (imageUrl.startsWith('data:')) {
      // Already a data URL, extract the base64 portion and mime type
      const [metaPart, dataPart] = imageUrl.split(',');
      base64Image = dataPart;
      mimeType = metaPart.split(':')[1].split(';')[0];
    } else {
      // Fetch the image and convert to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      base64Image = await blobToBase64(blob);
      mimeType = blob.type || 'image/jpeg';
    }

    const requestBody = {
      contents: [{ 
        parts: [
          { text: `Modify this interior design image: ${editPrompt}` },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 0,
        maxOutputTokens: 8192,
      }
    };
    
    console.log("Edit request structure:", JSON.stringify(
      {...requestBody, contents: [{...requestBody.contents[0], parts: [{text: requestBody.contents[0].parts[0].text}, {inlineData: {mimeType: requestBody.contents[0].parts[1].inlineData.mimeType, data: "BASE64_DATA_TRUNCATED"}}]}]}, 
      null, 2
    ));

    // Call the Gemini API for image editing with the correct model
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${apiResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await apiResponse.json();
    console.log("Gemini API edit response:", data);
    
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
      throw new Error("No edited image found in the response");
    } catch (extractError) {
      console.error("Error extracting edited image from response:", extractError);
      console.log("Full response:", JSON.stringify(data, null, 2));
      toast.warning("Couldn't edit image, returning original image");
      return imageUrl;
    }
    
  } catch (error) {
    console.error("Error editing image:", error);
    toast.error("Failed to edit image. Please try again.");
    
    // Return the original image in case of error
    return imageUrl;
  }
}

// Helper function to convert Blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Extract just the base64 part without the data URL prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
