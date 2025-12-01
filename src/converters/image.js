import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';

/**
 * Convert HEIC to standard format first if needed
 * Using heic2any with error handling for WASM loading
 */
async function convertHeicIfNeeded(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (ext === 'heic' || ext === 'heif') {
    try {
      // heic2any loads WASM from CDN by default
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.95
      });
      
      // heic2any might return array of blobs for multi-frame HEIC
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      
      // Create a new File object with the converted blob
      return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
        type: 'image/jpeg'
      });
    } catch (error) {
      console.error('HEIC conversion error:', error);
      
      // Provide helpful error message based on the error type
      if (error.message && error.message.includes('fetch')) {
        throw new Error(
          'HEIC conversion failed: Unable to load required files. ' +
          'Please check your internet connection and try again, or convert your HEIC image using your device\'s built-in tools. ' +
          'On Mac: Open with Preview > Export as JPG. On iPhone: Settings > Camera > Formats > Most Compatible.'
        );
      } else if (error.message && error.message.includes('not supported')) {
        throw new Error(
          'HEIC format is not supported in this browser. ' +
          'Please convert your HEIC image to JPG/PNG using your device\'s built-in tools first. ' +
          'On Mac: Open with Preview > Export as JPG. On iPhone: Settings > Camera > Formats > Most Compatible.'
        );
      } else {
        throw new Error(`Failed to convert HEIC: ${error.message || 'Unknown error'}`);
      }
    }
  }
  
  return file;
}

/**
 * Convert image between formats
 */
export async function convertImage(file, targetFormat, options = {}) {
  try {
    const {
      maxWidth = null,
      maxHeight = null,
      quality = 0.92
    } = options;
    
    // Convert HEIC to JPEG first if needed
    file = await convertHeicIfNeeded(file);
    
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

/**
 * Compress image with options
 */
export async function compressImage(file, options = {}) {
  try {
    const {
      maxSizeMB = 1,
      maxWidthOrHeight = 1920,
      quality = 0.85
    } = options;
    
    // Convert HEIC first if needed
    file = await convertHeicIfNeeded(file);
    
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

/**
 * Resize image
 */
export async function resizeImage(file, width, height, maintainAspectRatio = true) {
  try {
    // Convert HEIC first if needed
    file = await convertHeicIfNeeded(file);
    
    const img = await createImageFromFile(file);
    const canvas = document.createElement('canvas');
    
    if (maintainAspectRatio) {
      const aspectRatio = img.width / img.height;
      
      if (width && !height) {
        height = width / aspectRatio;
      } else if (height && !width) {
        width = height * aspectRatio;
      } else if (width && height) {
        // Fit within bounds
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

/**
 * Get image dimensions
 */
export async function getImageDimensions(file) {
  // Convert HEIC first if needed
  file = await convertHeicIfNeeded(file);
  
  const img = await createImageFromFile(file);
  return {
    width: img.width,
    height: img.height
  };
}

/**
 * Helper: Create image element from file
 */
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

/**
 * Helper: Get MIME type from format
 */
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

/**
 * Get supported image formats
 * Note: HEIC/HEIF support requires internet connection for WASM files
 */
export function getSupportedImageFormats() {
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic', 'heif'];
}

/**
 * Export the HEIC converter for direct use
 */
export { convertHeicIfNeeded };

