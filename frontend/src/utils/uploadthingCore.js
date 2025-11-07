/**
 * UploadThing Configuration
 * This file configures the UploadThing client for direct uploads
 */

import { genUploader } from "uploadthing/client";

// Get token from environment
const uploadThingToken = import.meta.env.VITE_UPLOADTHING_TOKEN;

// Create uploader with configuration
export const { uploadFiles } = genUploader({
  package: "@uploadthing/react",
});

// Helper function to upload images
export async function uploadImage(file) {
  try {
    const uploaded = await uploadFiles("imageUploader", {
      files: [file],
      headers: {
        Authorization: `Bearer ${uploadThingToken}`,
      },
    });
    
    if (uploaded && uploaded[0]) {
      return uploaded[0].url;
    }
    
    throw new Error("Upload failed");
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
