import config from "@/config";

/**
 * Formats an image URL to ensure it has the correct base URL if it's a relative path.
 * @param {string} url - The image URL or path from the backend.
 * @returns {string} - The fully qualified image URL.
 */
export const formatImageUrl = (url) => {
  if (!url) return null;
  // If it's already an absolute URL or a data URI, return it as is
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  
  // Clean up relative path and prepend API URL
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${config.apiUrl}${cleanPath}`;
};
