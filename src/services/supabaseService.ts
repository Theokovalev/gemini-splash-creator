
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Create a storage bucket for generated interior designs
export const BUCKET_NAME = 'interior-designs';

export async function setupStorageBucket() {
  try {
    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make the bucket public
      });
      
      if (error) throw error;
      console.log(`Storage bucket '${BUCKET_NAME}' created successfully`);
    }
  } catch (error) {
    console.error('Error setting up storage bucket:', error);
    // Don't show toast to user as this is background setup
  }
}

// Upload a base64 image to Supabase storage
export async function uploadGeneratedImage(base64Image: string, prompt: string): Promise<string | null> {
  try {
    // Ensure the bucket exists
    await setupStorageBucket();
    
    // Convert base64 to a Blob
    const base64Response = await fetch(base64Image);
    const blob = await base64Response.blob();
    
    // Create a unique file name
    const fileExt = base64Image.includes('image/png') ? 'png' : 'jpg';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the image
    const { error: uploadError, data } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: true,
      });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to store the generated image');
    return null;
  }
}

// Get the public URL for a previously uploaded image
export function getImagePublicUrl(filePath: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);
  
  return publicUrl;
}
