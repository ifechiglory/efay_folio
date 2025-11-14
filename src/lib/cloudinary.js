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
  thumbnail: {
    width: 400,
    height: 192,
    quality: "80",
    format: "auto",
    crop: "fill",
  },
  preview: {
    width: 600,
    height: 240,
    quality: "auto:good",
    format: "auto",
    crop: "fill",
  },
  highQuality: {
    width: 800,
    height: 400,
    quality: "auto:best",
    format: "auto",
    crop: "fill",
  },

  mobile: {
    width: 300,
    height: 150,
    quality: "auto:eco",
    format: "auto",
    crop: "fill",
  },
};
export const getOptimizedImageWithProfile = (url, profile = "thumbnail") => {
  const profileOptions =
    optimizationProfiles[profile] || optimizationProfiles.thumbnail;
  return getOptimizedImageUrl(url, profileOptions);
};

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
      height: 200,
      quality: "auto:good",
    });
  }
  return url;
};
