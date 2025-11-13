// src/lib/cloudinary.js
export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  // Add optimization parameters for better performance
  formData.append("quality", "auto:good"); // Balanced quality and size
  formData.append("fetch_format", "auto"); // Auto-choose best format (WebP/AVIF)
  formData.append("width", "1200"); // Limit max width
  formData.append("crop", "limit"); // Maintain aspect ratio
  formData.append("dpr", "auto"); // Device pixel ratio optimization

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

/**
 * Transforms Cloudinary image URLs for optimal performance
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @param {number} options.width - Desired width
 * @param {number} options.height - Desired height
 * @param {string} options.quality - Image quality (auto, 80, good, best)
 * @param {string} options.format - Image format (auto, webp, jpg, png)
 * @param {string} options.crop - Cropping strategy
 * @returns {string} Optimized Cloudinary URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || !url.includes("cloudinary")) return url;

  const defaultOptions = {
    width: 600,
    height: 400,
    quality: "auto:good",
    format: "auto",
    fetchFormat: "auto",
    crop: "fill",
    dpr: "auto",
  };

  const config = { ...defaultOptions, ...options };

  // Insert transformation parameters into Cloudinary URL
  const parts = url.split("/upload/");
  if (parts.length === 2) {
    const transformations = [
      `w_${config.width}`,
      `h_${config.height}`,
      `c_${config.crop}`,
      `q_${config.quality}`,
      `f_${config.format}`,
      `dpr_${config.dpr}`,
    ].join(",");

    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }

  return url;
};

/**
 * Predefined optimization profiles for different use cases
 */
export const optimizationProfiles = {
  // For project grid thumbnails
  thumbnail: {
    width: 400,
    height: 192,
    quality: "80",
    format: "auto",
    crop: "fill",
  },
  // For modal/preview images
  preview: {
    width: 600,
    height: 240,
    quality: "auto:good",
    format: "auto",
    crop: "fill",
  },
  // For high-quality displays
  highQuality: {
    width: 800,
    height: 400,
    quality: "auto:best",
    format: "auto",
    crop: "fill",
  },
  // For mobile optimization
  mobile: {
    width: 300,
    height: 150,
    quality: "auto:eco",
    format: "auto",
    crop: "fill",
  },
};

/**
 * Helper function to get optimized URL with predefined profile
 * @param {string} url - Original Cloudinary URL
 * @param {string} profile - Profile name from optimizationProfiles
 * @returns {string} Optimized Cloudinary URL
 */
export const getOptimizedImageWithProfile = (url, profile = "thumbnail") => {
  const profileOptions =
    optimizationProfiles[profile] || optimizationProfiles.thumbnail;
  return getOptimizedImageUrl(url, profileOptions);
};

/**
 * Generates responsive image srcset for different screen sizes
 * @param {string} url - Original Cloudinary URL
 * @param {Object} breakpoints - Breakpoint configurations
 * @returns {string} srcset attribute value
 */
export const generateSrcSet = (url, breakpoints = {}) => {
  const defaultBreakpoints = {
    "320w": { width: 320, height: 160 },
    "640w": { width: 640, height: 320 },
    "768w": { width: 768, height: 384 },
    "1024w": { width: 1024, height: 512 },
    "1280w": { width: 1280, height: 640 },
  };

  const config = { ...defaultBreakpoints, ...breakpoints };

  return Object.entries(config)
    .map(([descriptor, options]) => {
      const optimizedUrl = getOptimizedImageUrl(url, options);
      return `${optimizedUrl} ${descriptor}`;
    })
    .join(", ");
};

/**
 * Extracts public ID from Cloudinary URL for further transformations
 * @param {string} url - Cloudinary URL
 * @returns {string} Public ID
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary")) return null;

  try {
    const urlParts = url.split("/upload/");
    if (urlParts.length === 2) {
      // Remove version number if present and get the path
      const pathWithTransformations = urlParts[1];
      const pathWithoutVersion = pathWithTransformations.replace(/^v\d+\//, "");

      // Remove file extension
      const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, "");
      return publicId;
    }
  } catch (error) {
    console.warn("Could not extract public ID from URL:", url);
  }

  return null;
};

/**
 * Creates a blurry placeholder image URL for lazy loading
 * @param {string} url - Original Cloudinary URL
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @returns {string} Blurry placeholder URL
 */
export const getBlurPlaceholder = (url, width = 50, height = 25) => {
  if (!url || !url.includes("cloudinary")) return null;

  return getOptimizedImageUrl(url, {
    width,
    height,
    quality: "auto:low",
    format: "webp",
    crop: "fill",
    effect: "blur:1000", // Heavy blur for placeholder
  });
};

/**
 * Validates if a URL is a Cloudinary URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  return url && url.includes("cloudinary");
};

/**
 * Fallback function if Cloudinary transformation fails
 * @param {string} url - Original URL
 * @returns {string} Safe URL to use
 */
export const getSafeImageUrl = (url) => {
  if (!url) return null;

  // If it's a Cloudinary URL, return with basic optimizations
  if (isCloudinaryUrl(url)) {
    return getOptimizedImageUrl(url, {
      width: 400,
      height: 200,
      quality: "auto:good",
    });
  }

  // If it's a local or other CDN URL, return as-is
  return url;
};
