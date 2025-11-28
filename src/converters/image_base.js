import imageCompression from 'browser-image-compression';

/**
 * Convert image between formats - BASE VERSION (no HEIC)
 */
export async function convertImage(file, targetFormat, options = {}) {
  try {
    const {
      maxWidth = null,
      maxHeight = null,
      quality = 0.92
    } = options;
    
    // Create an image element to load the file
    const img = await createImageFromFile(file);
    
    // Calculate dimensions
    let { width, height } = img;
    
    if (maxWidth && width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    if (maxHeight && height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    // Create canvas and draw resized image
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Convert to target format
    const mimeType = getMimeType(targetFormat);
    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        mimeType,
        quality
      );
    });
    
    return blob;
  } catch (error) {
    throw new Error(`Failed to convert image: ${error.message}`);
  }
}

export async function compressImage(file, options = {}) {
  try {
    const {
      maxSizeMB = 1,
      maxWidthOrHeight = 1920,
      quality = 0.85
    } = options;
    
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
      initialQuality: quality
    });
    
    return compressedFile;
  } catch (error) {
    throw new Error(`Failed to compress image: ${error.message}`);
  }
}

export async function resizeImage(file, width, height, maintainAspectRatio = true) {
  try {
    const img = await createImageFromFile(file);
    const canvas = document.createElement('canvas');
    
    if (maintainAspectRatio) {
      const aspectRatio = img.width / img.height;
      
      if (width && !height) {
        height = width / aspectRatio;
      } else if (height && !width) {
        width = height * aspectRatio;
      } else if (width && height) {
        const targetRatio = width / height;
        if (aspectRatio > targetRatio) {
          height = width / aspectRatio;
        } else {
          width = height * aspectRatio;
        }
      }
    }
    
    canvas.width = Math.round(width || img.width);
    canvas.height = Math.round(height || img.height);
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const extension = file.name.split('.').pop().toLowerCase();
    const mimeType = getMimeType(extension);
    
    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        mimeType,
        0.92
      );
    });
    
    return blob;
  } catch (error) {
    throw new Error(`Failed to resize image: ${error.message}`);
  }
}

export async function getImageDimensions(file) {
  const img = await createImageFromFile(file);
  return {
    width: img.width,
    height: img.height
  };
}

function createImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

function getMimeType(format) {
  const formatLower = format.toLowerCase().replace('.', '');
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'bmp': 'image/bmp'
  };
  return mimeTypes[formatLower] || 'image/png';
}

export function getSupportedImageFormats() {
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
}

