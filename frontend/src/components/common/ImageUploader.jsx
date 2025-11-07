import React, { useState, useRef } from 'react';

/**
 * ImageUploader component for handling image uploads with UploadThing
 * Displays upload progress and preview of uploaded image
 */
const ImageUploader = ({ value, onChange, disabled }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const uploadThingToken = import.meta.env.VITE_UPLOADTHING_TOKEN;

  const handleFile = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      alert('File size must be less than 4MB');
      return;
    }

    try {
      setUploading(true);
      setProgress(10);

      // Decode the UploadThing token to extract the API key
      let apiKey = uploadThingToken;
      try {
        // Check if it's a base64 encoded token
        if (uploadThingToken && uploadThingToken.startsWith('eyJ')) {
          const decoded = atob(uploadThingToken);
          const parsed = JSON.parse(decoded);
          apiKey = parsed.apiKey || uploadThingToken;
        }
      } catch (error) {
        console.warn('Failed to decode token, using as-is:', error);
      }

      setProgress(20);

      // Step 1: Request presigned URL
      const prepareResponse = await fetch('https://api.uploadthing.com/v6/uploadFiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-uploadthing-api-key': apiKey,
        },
        body: JSON.stringify({
          files: [{
            name: file.name,
            size: file.size,
            type: file.type,
          }],
          acl: 'public-read',
        }),
      });

      setProgress(40);

      if (!prepareResponse.ok) {
        const errorData = await prepareResponse.text();
        console.error('Prepare upload failed:', errorData);
        throw new Error(`Failed to prepare upload: ${prepareResponse.statusText}`);
      }

      const prepareData = await prepareResponse.json();
      console.log('Prepare response:', prepareData);
      
      if (!prepareData.data || !prepareData.data[0]) {
        throw new Error('Invalid response from upload service');
      }

      const uploadData = prepareData.data[0];
      
      setProgress(50);

      // Step 2: Upload file using FormData to the presigned URL
      const formData = new FormData();
      
      // Add all fields from the presigned POST data
      if (uploadData.fields) {
        Object.entries(uploadData.fields).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      // Add the file last
      formData.append('file', file);

      const uploadResponse = await fetch(uploadData.url, {
        method: 'POST',
        body: formData,
      });

      setProgress(80);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload response error:', errorText);
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      setProgress(90);

      // Step 3: Notify UploadThing that upload is complete (if needed)
      const fileUrl = uploadData.fileUrl || `https://utfs.io/f/${uploadData.key}`;
      
      onChange(fileUrl);
      setProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1000);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="space-y-3">
          {/* Image Preview */}
          <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={value}
              alt="Service preview"
              className="w-full h-48 object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                title="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center">
            Click the X button to remove and upload a new image
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Upload Progress Bar */}
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-[#7A85C1] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Custom Dropzone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-[#7A85C1] bg-[#7A85C1]/10'
                : 'border-gray-300 bg-gray-50 hover:border-[#7A85C1] hover:bg-gray-100'
            } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              disabled={disabled || uploading}
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#7A85C1] mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <p className="text-gray-700 font-medium mb-2">
              {uploading ? 'Uploading...' : 'Choose files or drag and drop'}
            </p>
            <p className="text-gray-500 text-sm">
              {uploading ? `${Math.round(progress)}% complete` : 'Images (up to 4MB)'}
            </p>

            {!uploading && (
              <button
                type="button"
                className="mt-4 bg-[#7A85C1] text-white px-6 py-2 rounded-lg hover:bg-[#6a75a8] transition-colors font-medium"
                disabled={disabled}
              >
                Choose files
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
