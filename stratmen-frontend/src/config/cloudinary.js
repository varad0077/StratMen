const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 0.82;

/**
 * Compress an image file to WebP format using an offscreen canvas.
 * @param {File} file - The image file to compress.
 * @returns {Promise<Blob>} - The compressed WebP blob.
 */
const compressToWebP = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image to WebP.'));
          }
        },
        'image/webp',
        WEBP_QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression.'));
    };

    img.src = url;
  });
};

/**
 * Validate file type and size, compress to WebP, and upload to Cloudinary.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export const validateAndUploadImage = async (file) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration is missing. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, GIF, and WebP formats are accepted.');
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB.`);
  }

  const compressedBlob = await compressToWebP(file);

  const formData = new FormData();
  formData.append('file', compressedBlob, `${Date.now()}.webp`);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || 'Failed to upload image to Cloudinary.');
  }

  const data = await response.json();
  return data.secure_url;
};
