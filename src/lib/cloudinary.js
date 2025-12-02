export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  formData.append("quality", "auto:good");
  formData.append("fetch_format", "auto");
  formData.append("width", "1200");
  formData.append("crop", "limit");
  formData.append("dpr", "auto");

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

export const uploadMultipleToCloudinary = async (files) => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));

  try {
    const results = await Promise.all(uploadPromises);
    return results.filter((url) => url !== null);
  } catch (error) {
    console.error("Multiple upload error:", error);
    throw error;
  }
};

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

export const optimizationProfiles = {
  highQuality: {
    width: 1200,
    height: 800,
    quality: "auto:best",
    format: "auto",
    crop: "limit",
    dpr: "auto",
  },

  preview: {
    width: 600,
    height: 400,
    quality: "auto:good",
    format: "auto",
    crop: "fill",
    dpr: "auto",
  },

  thumbnail: {
    width: 400,
    height: 300,
    quality: "auto:good",
    format: "auto",
    crop: "fill",
    dpr: "auto",
  },

  galleryThumb: {
    width: 100,
    height: 75,
    quality: "auto:eco",
    format: "auto",
    crop: "fill",
  },

  mobile: {
    width: 300,
    height: 200,
    quality: "auto:good",
    format: "auto",
    crop: "fill",
  },

  original: {
    width: 2000,
    height: 1500,
    quality: "auto:best",
    format: "auto",
    crop: "limit",
    dpr: "auto",
  },
};

export const getProjectImagesWithProfiles = (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0)
    return [];

  return imageUrls.map((url) => ({
    original: getOriginalImage(url),
    thumbnail: getOptimizedImageWithProfile(url, "galleryThumb"),
    preview: getOptimizedImageWithProfile(url, "preview"),
    highQuality: getOptimizedImageWithProfile(url, "highQuality"),
  }));
};

export const getOptimizedImageWithProfile = (url, profile = "thumbnail") => {
  const profileOptions =
    optimizationProfiles[profile] || optimizationProfiles.thumbnail;
  return getOptimizedImageUrl(url, profileOptions);
};

export const getOriginalImage = (url) => {
  if (!url || !url.includes("cloudinary")) return url;

  const parts = url.split("/upload/");
  if (parts.length === 2) {
    return `${parts[0]}/upload/c_limit,w_2000,q_auto:best,f_auto,dpr_auto/${parts[1]}`;
  }

  return url;
};

export const getProjectPreviewImage = (project) => {
  if (project.image_url) {
    return getOptimizedImageWithProfile(project.image_url, "preview");
  }
  if (project.images && project.images.length > 0) {
    return getOptimizedImageWithProfile(project.images[0], "preview");
  }
  return null;
};

export const generateSrcSet = (url, breakpoints = {}) => {
  const defaultBreakpoints = {
    "320w": { width: 320, height: 240, crop: "fill" },
    "640w": { width: 640, height: 480, crop: "fill" },
    "768w": { width: 768, height: 576, crop: "fill" },
    "1024w": { width: 1024, height: 768, crop: "limit" },
    "1280w": { width: 1280, height: 960, crop: "limit" },
    "1920w": { width: 1920, height: 1080, crop: "limit" },
  };

  const config = { ...defaultBreakpoints, ...breakpoints };

  return Object.entries(config)
    .map(([descriptor, options]) => {
      const optimizedUrl = getOptimizedImageUrl(url, options);
      return `${optimizedUrl} ${descriptor}`;
    })
    .join(", ");
};

export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary")) return null;

  try {
    const urlParts = url.split("/upload/");
    if (urlParts.length === 2) {
      const pathWithTransformations = urlParts[1];
      const pathWithoutVersion = pathWithTransformations.replace(/^v\d+\//, "");

      const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, "");
      return publicId;
    }
  } catch (error) {
    console.warn("Could not extract public ID from URL:", url);
  }

  return null;
};

export const getBlurPlaceholder = (url, width = 50, height = 25) => {
  if (!url || !url.includes("cloudinary")) return null;

  return getOptimizedImageUrl(url, {
    width,
    height,
    quality: "auto:low",
    format: "webp",
    crop: "fill",
    effect: "blur:1000",
  });
};

export const isCloudinaryUrl = (url) => {
  return url && url.includes("cloudinary");
};

export const getSafeImageUrl = (url) => {
  if (!url) return null;

  if (isCloudinaryUrl(url)) {
    return getOptimizedImageUrl(url, {
      width: 400,
      height: 300,
      quality: "auto:good",
    });
  }
  return url;
};
