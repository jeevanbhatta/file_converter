/**
 * Convert text encoding
 */
export async function convertEncoding(file, targetEncoding) {
  try {
    const sourceEncoding = await detectEncoding(file);
    const arrayBuffer = await file.arrayBuffer();
    
    // Decode from source encoding
    const decoder = new TextDecoder(sourceEncoding);
    const text = decoder.decode(arrayBuffer);
    
    // Encode to target encoding
    const encoder = new TextEncoder();
    let encoded;
    
    if (targetEncoding === 'utf-8') {
      encoded = encoder.encode(text);
    } else if (targetEncoding === 'utf-16le') {
      encoded = new Uint8Array(text.length * 2);
      for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        encoded[i * 2] = code & 0xFF;
        encoded[i * 2 + 1] = (code >> 8) & 0xFF;
      }
    } else if (targetEncoding === 'utf-16be') {
      encoded = new Uint8Array(text.length * 2);
      for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        encoded[i * 2] = (code >> 8) & 0xFF;
        encoded[i * 2 + 1] = code & 0xFF;
      }
    } else {
      throw new Error(`Unsupported encoding: ${targetEncoding}`);
    }
    
    return new Blob([encoded], { type: 'text/plain' });
  } catch (error) {
    throw new Error(`Failed to convert encoding: ${error.message}`);
  }
}

/**
 * Detect text encoding
 */
export async function detectEncoding(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Check for BOM
    if (uint8Array.length >= 3) {
      // UTF-8 BOM
      if (uint8Array[0] === 0xEF && uint8Array[1] === 0xBB && uint8Array[2] === 0xBF) {
        return 'utf-8';
      }
    }
    
    if (uint8Array.length >= 2) {
      // UTF-16 LE BOM
      if (uint8Array[0] === 0xFF && uint8Array[1] === 0xFE) {
        return 'utf-16le';
      }
      // UTF-16 BE BOM
      if (uint8Array[0] === 0xFE && uint8Array[1] === 0xFF) {
        return 'utf-16be';
      }
    }
    
    // Default to UTF-8
    return 'utf-8';
  } catch (error) {
    return 'utf-8';
  }
}

/**
 * Convert line endings
 */
export async function convertLineEndings(file, targetFormat) {
  try {
    const text = await file.text();
    let converted;
    
    switch (targetFormat) {
      case 'lf':
        converted = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        break;
      case 'crlf':
        converted = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n');
        break;
      case 'cr':
        converted = text.replace(/\r\n/g, '\n').replace(/\n/g, '\r');
        break;
      default:
        throw new Error(`Unsupported line ending format: ${targetFormat}`);
    }
    
    return new Blob([converted], { type: 'text/plain' });
  } catch (error) {
    throw new Error(`Failed to convert line endings: ${error.message}`);
  }
}

/**
 * Remove BOM from file
 */
export async function removeBOM(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let startIndex = 0;
    
    // Check for UTF-8 BOM
    if (uint8Array.length >= 3 && 
        uint8Array[0] === 0xEF && 
        uint8Array[1] === 0xBB && 
        uint8Array[2] === 0xBF) {
      startIndex = 3;
    }
    // Check for UTF-16 BOM
    else if (uint8Array.length >= 2 && 
             ((uint8Array[0] === 0xFF && uint8Array[1] === 0xFE) ||
              (uint8Array[0] === 0xFE && uint8Array[1] === 0xFF))) {
      startIndex = 2;
    }
    
    const withoutBOM = uint8Array.slice(startIndex);
    return new Blob([withoutBOM], { type: 'text/plain' });
  } catch (error) {
    throw new Error(`Failed to remove BOM: ${error.message}`);
  }
}

/**
 * Count characters, words, and lines
 */
export async function analyzeText(file) {
  try {
    const text = await file.text();
    
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const lines = text.split('\n').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    return {
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      encoding: await detectEncoding(file),
      size: file.size,
      sizeKB: (file.size / 1024).toFixed(2)
    };
  } catch (error) {
    throw new Error(`Failed to analyze text: ${error.message}`);
  }
}

