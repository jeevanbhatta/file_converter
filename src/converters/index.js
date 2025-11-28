import * as documentConverter from './document.js';
import * as imageConverter from './image.js';
import * as textConverter from './text.js';

/**
 * Main converter dispatcher
 */
export async function convertFile(file, targetFormat, options = {}) {
  const sourceExt = getFileExtension(file.name);
  const targetExt = targetFormat.replace('.', '').toLowerCase();
  
  // Document conversions
  if (sourceExt === 'docx' && targetExt === 'md') {
    return documentConverter.docxToMarkdown(file);
  }
  if (sourceExt === 'md' && targetExt === 'docx') {
    return documentConverter.markdownToDocx(file);
  }
  if (sourceExt === 'txt' && targetExt === 'md') {
    return documentConverter.txtToMarkdown(file);
  }
  if (sourceExt === 'md' && targetExt === 'txt') {
    return documentConverter.markdownToTxt(file);
  }
  if (sourceExt === 'docx' && targetExt === 'txt') {
    return documentConverter.docxToTxt(file);
  }
  if (sourceExt === 'txt' && targetExt === 'docx') {
    return documentConverter.txtToDocx(file);
  }
  
  // Image conversions
  const imageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic', 'heif'];
  if (imageFormats.includes(sourceExt) && imageFormats.includes(targetExt)) {
    return imageConverter.convertImage(file, targetExt, options);
  }
  
  // Text encoding conversions
  if (sourceExt === 'txt' && targetExt === 'txt' && options.encoding) {
    return textConverter.convertEncoding(file, options.encoding);
  }
  
  throw new Error(`Conversion from .${sourceExt} to .${targetExt} is not supported`);
}

/**
 * Get supported conversions for a file
 */
export function getSupportedConversions(fileName) {
  const ext = getFileExtension(fileName);
  
  const conversionMap = {
    'docx': ['md', 'txt'],
    'md': ['docx', 'txt'],
    'txt': ['md', 'docx'],
    'jpg': ['png', 'webp', 'gif'],
    'jpeg': ['png', 'webp', 'gif'],
    'png': ['jpg', 'webp', 'gif'],
    'webp': ['jpg', 'png', 'gif'],
    'gif': ['jpg', 'png', 'webp'],
    'bmp': ['jpg', 'png', 'webp'],
    'heic': ['jpg', 'png', 'webp', 'gif'],
    'heif': ['jpg', 'png', 'webp', 'gif']
  };
  
  return conversionMap[ext] || [];
}

/**
 * Check if file type is supported
 */
export function isFileSupported(fileName) {
  const ext = getFileExtension(fileName);
  const supportedExtensions = [
    'docx', 'md', 'txt',
    'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic', 'heif'
  ];
  return supportedExtensions.includes(ext);
}

/**
 * Get file extension
 */
export function getFileExtension(fileName) {
  return fileName.split('.').pop().toLowerCase();
}

/**
 * Get file category
 */
export function getFileCategory(fileName) {
  const ext = getFileExtension(fileName);
  
  if (['docx', 'md', 'txt'].includes(ext)) {
    return 'document';
  }
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic', 'heif'].includes(ext)) {
    return 'image';
  }
  
  return 'unknown';
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Export individual converters
export { documentConverter, imageConverter, textConverter };

