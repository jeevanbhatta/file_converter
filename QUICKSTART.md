# 🚀 Quick Start Guide

## Understanding the Error You Saw

The error `"Expected a JavaScript module script but the server responded with a MIME type of 'text/jsx'"` occurs when you try to open `index.html` **directly in your browser** (with `file://` protocol).

**Why this happens:**
- Browsers cannot execute `.jsx` files directly
- JSX needs to be transformed to regular JavaScript first
- Vite's dev server performs this transformation automatically
- Opening the HTML file directly bypasses Vite's transformation

## ✅ Correct Way to Run the App

### Step 1: Install Dependencies (One-time setup)

```bash
cd /Users/jeevanbhatta/Projects/file_converter
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 3: Open in Browser

**✅ DO THIS:** Open your browser and go to:
```
http://localhost:5173
```

**❌ DON'T DO THIS:** Open the file directly:
```
file:///Users/jeevanbhatta/Projects/file_converter/index.html  ❌ WRONG!
```

## 🎯 Your App is Now Running!

The development server is currently running at:
- **Local URL:** http://localhost:5173
- **Press Ctrl+C** in the terminal to stop the server

## 🧪 Testing the App

1. Open http://localhost:5173 in your browser
2. Drag and drop a file (or click to browse)
3. Select output format
4. Click "Convert File"
5. Download your converted file

### Test Files

Try these conversions:
- Create a `.txt` file → Convert to `.md` or `.docx`
- Create a `.md` file → Convert to `.docx` or `.txt`
- Use any `.jpg` or `.png` image → Convert to other formats

## 🛠️ Development Commands

```bash
# Start dev server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 🔥 Hot Module Replacement (HMR)

While the dev server is running:
- Edit any `.jsx`, `.js`, or `.css` file
- Save the file
- Your browser will automatically update!
- No need to refresh the page

## 📱 Test on Mobile Device

1. Start the dev server with network exposure:
   ```bash
   npm run dev -- --host
   ```

2. Find your computer's IP address:
   ```bash
   # On Mac/Linux
   ifconfig | grep "inet "
   
   # On Windows
   ipconfig
   ```

3. Open on your phone:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```
   Example: `http://192.168.1.100:5173`

## 🚨 Troubleshooting

### Port 5173 Already in Use

If you see "Port 5173 is already in use":

```bash
# Kill the process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Changes Not Reflecting

```bash
# Hard refresh in browser
# Mac: Cmd + Shift + R
# Windows/Linux: Ctrl + Shift + R

# Or restart dev server
# Press Ctrl + C, then run npm run dev again
```

### Cannot Access on Network

Make sure your firewall allows connections on port 5173:

```bash
# Mac: Check Firewall settings in System Preferences
# Windows: Check Windows Defender Firewall
# Linux: Check iptables or ufw
```

## 🎨 Making Changes

### Modify UI

Edit files in `src/components/`:
- `FileUploader.jsx` - Upload interface
- `ConversionPanel.jsx` - Conversion options
- `DownloadButton.jsx` - Download interface

### Modify Styles

Edit `src/App.css`:
- Change colors in CSS variables (`:root`)
- Modify component styles
- Add new animations

### Add New Conversions

Edit files in `src/converters/`:
- `document.js` - Document conversions
- `image.js` - Image conversions
- `text.js` - Text operations

## 📦 Building for Production

```bash
# Create production build
npm run build

# Output will be in ./dist folder
# Files are minified and optimized
# Ready to deploy!
```

## 🌐 Deploying to GitHub Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy:
```bash
# Option 1: Automatic (GitHub Actions)
git push origin main
# Wait for GitHub Actions to deploy

# Option 2: Manual
npm run deploy
```

## 💡 Pro Tips

1. **Keep dev server running** while coding for instant feedback
2. **Use browser DevTools** (F12) to debug issues
3. **Check Console** for error messages
4. **Test in multiple browsers** (Chrome, Firefox, Safari)
5. **Use React DevTools** browser extension for debugging components

## 🆘 Still Having Issues?

1. Make sure Node.js version is 18 or higher:
   ```bash
   node --version
   ```

2. Clear browser cache and reload

3. Check the terminal for error messages

4. Open browser console (F12) for JavaScript errors

5. Create an issue on GitHub with:
   - Error message
   - Browser and OS
   - Steps to reproduce

---

Happy coding! 🎉

**Next Steps:**
- ✅ App is running at http://localhost:5173
- 📖 Read README.md for features
- 🚀 Read DEPLOYMENT.md to deploy
- 🔧 Start customizing the code!

