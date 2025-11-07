import { generateUploadButton, generateUploadDropzone, generateReactHelpers } from "@uploadthing/react";

/**
 * UploadThing utility for handling file uploads
 * Configuration for React components
 */

// Get the token from environment variables
const uploadThingToken = import.meta.env.VITE_UPLOADTHING_TOKEN;

// Configure the API endpoint with authentication
const config = {
  url: "https://api.uploadthing.com",
};

// Generate reusable upload components
export const UploadButton = generateUploadButton(config);
export const UploadDropzone = generateUploadDropzone(config);

// Generate helpers for programmatic uploads
export const { useUploadThing, uploadFiles } = generateReactHelpers(config);
