import config from "@/config";

/**
 * Formats an image URL to ensure it has the correct base URL if it's a relative path.
 * @param {string} url - The image URL or path from the backend.
 * @returns {string} - The fully qualified image URL.
 */
export const formatImageUrl = (url) => {
  if (!url) return null;

  let formattedUrl = url;

  // If it's not an absolute URL or data URI, prepend API URL
  if (
    !url.startsWith("http") &&
    !url.startsWith("data:") &&
    !url.startsWith("blob:")
  ) {
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    formattedUrl = `${config.apiUrl}${cleanPath}`;
  }

  // Robust HTTPS upgrade for non-localhost URLs
  if (
    formattedUrl.startsWith("http://") &&
    !formattedUrl.includes("localhost") &&
    !formattedUrl.includes("127.0.0.1")
  ) {
    formattedUrl = formattedUrl.replace(/^http:\/\//i, "https://");
  }

  return formattedUrl;
};
