# HEIC Conversion Alternatives

## Current Implementation (Option 1)

We're using `heic2any` which loads WASM files from a CDN. This works but requires internet connection.

## Alternative Approaches

### Option 2: Bundle WASM Files Locally

To avoid CDN dependency, you can bundle the WASM files:

1. **Copy WASM files to public folder:**
```bash
mkdir -p public/wasm
cp node_modules/heic2any/dist/*.wasm public/wasm/
```

2. **Configure heic2any to use local WASM:**
```javascript
// This requires a custom build of heic2any or forking the library
```

**Note:** heic2any v0.0.4 doesn't support custom WASM paths easily.

### Option 3: Use Alternative Library - heic-decode

```bash
npm install heic-decode
```

```javascript
import decode from 'heic-decode';

async function convertHeicIfNeeded(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (ext === 'heic' || ext === 'heif') {
    const arrayBuffer = await file.arrayBuffer();
    const { width, height, data } = await decode({ buffer: arrayBuffer });
    
    // Convert to canvas and then to blob
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(data);
    ctx.putImageData(imageData, 0, 0);
    
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
          type: 'image/jpeg'
        }));
      }, 'image/jpeg', 0.95);
    });
  }
  
  return file;
}
```

### Option 4: Server-Side API

Create a simple Node.js API using `sharp`:

```bash
npm install express sharp multer
```

```javascript
const express = require('express');
const sharp = require('sharp');
const multer = require('multer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/convert-heic', upload.single('file'), async (req, res) => {
  try {
    const jpegBuffer = await sharp(req.file.buffer)
      .jpeg({ quality: 95 })
      .toBuffer();
    
    res.set('Content-Type', 'image/jpeg');
    res.send(jpegBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

### Option 5: Serverless Function (Vercel/Netlify)

Deploy a serverless function for HEIC conversion:

**`api/convert-heic.js` (Vercel):**
```javascript
import sharp from 'sharp';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const jpegBuffer = await sharp(req.body)
      .jpeg({ quality: 95 })
      .toBuffer();
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(jpegBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Recommendation

**For now:** Stick with Option 1 (current implementation with heic2any + CDN)
- Most users have internet connection
- Maintains "100% client-side" philosophy for most operations
- Good error messages guide users if it fails

**For the future:** Consider Option 5 (Serverless) if WASM issues persist
- Maintains privacy (ephemeral function execution)
- More reliable than client-side WASM
- No infrastructure management needed
- Free tier available on Vercel/Netlify

## Testing the Current Implementation

1. Start dev server: `npm run dev`
2. Upload a HEIC file
3. Check browser console for any errors
4. The conversion should work if you have internet connection

If you see "Failed to convert HEIC: fetch error", it means the WASM files couldn't be loaded from CDN.

