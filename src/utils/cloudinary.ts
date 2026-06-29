// src/utils/cloudinary.ts
// Cloudinary configuration for image uploads via backend API

const API_URL = "http://127.0.0.1:8000";

// Allowed file types
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Max file size: 500KB (500 * 1024 bytes)
const MAX_FILE_SIZE = 500 * 1024;

// Validate file before upload
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPG, JPEG, and PNG files are allowed." };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeKB = MAX_FILE_SIZE / 1024;
    return { valid: false, error: `File size must be less than ${maxSizeKB}KB.` };
  }

  return { valid: true };
};

// Get file extension from mime type
export const getFileExtension = (mimeType: string): string => {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
  };
  return map[mimeType] || "jpg";
};

// Upload image to Cloudinary via backend
export const uploadToCloudinary = async (
  file: string, // base64 data URL
  folder: string = "kgurukul"
): Promise<string> => {
  try {
    // Get auth token
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}/upload-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        file, // base64 string
        folder, // e.g., "kgurukul/teachers"
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.url; // Cloudinary URL returned from backend
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};

// Delete image from Cloudinary via backend
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_URL}/delete-image`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Image delete error:", error);
    throw error;
  }
};