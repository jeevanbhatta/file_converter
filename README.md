# 🔄 File Converter

A fast, secure, and 100% client-side file conversion web app. Convert documents, images, and text files instantly in your browser without uploading anything to a server.

[![Deploy to GitHub Pages](https://github.com/jeevanbhatta/file_converter/actions/workflows/deploy.yml/badge.svg)](https://github.com/jeevanbhatta/file_converter/actions/workflows/deploy.yml)

## ✨ Features

### 📄 Document Conversions
- **DOCX ↔ Markdown**: Convert Word documents to Markdown and vice versa **with full formatting preservation**
- **Enhanced Formatting**: Bold, italic, headers, lists, code blocks, blockquotes, and more
- **TXT ↔ Markdown**: Convert plain text to Markdown format
- **TXT ↔ DOCX**: Convert between plain text and Word documents

### 🖼️ Image Conversions
- **Format Support**: Convert between JPG, PNG, WEBP, GIF, BMP, and **HEIC** (iPhone photos!)
- **HEIC Support**: Automatically converts iPhone photos to standard formats (requires internet connection)
- **Resize Images**: Set custom width and height
- **Quality Control**: Adjust image quality from 10% to 100%
- **Compression**: Optimize image file sizes

### 📝 Text Operations
- **Encoding Conversion**: Convert between UTF-8 and UTF-16
- **Line Ending Conversion**: Switch between LF, CRLF, and CR
- **Text Analysis**: View character, word, and line counts

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeevanbhatta/file_converter.git
   cd file_converter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/file_converter.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to **Pages** section
   - Set **Source** to "GitHub Actions"
   - The app will automatically deploy on every push to `main`

3. **Access your app**
   ```
   https://YOUR_USERNAME.github.io/file_converter/
   ```

### Option 2: Manual Deployment

```bash
npm run deploy
```

**Note:** Update the `base` option in `vite.config.js` to match your repository name:

```js
export default defineConfig({
  base: '/YOUR_REPO_NAME/',
  // ... rest of config
})
```

## 🛠️ Technology Stack

### Frontend Framework
- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool

### Conversion Libraries
- **mammoth**: DOCX to HTML conversion
- **docx**: Generate DOCX files
- **marked**: Markdown to HTML parser
- **turndown**: HTML to Markdown converter
- **browser-image-compression**: Client-side image optimization

### Styling
- **Vanilla CSS**: No framework needed, clean and minimal
- **CSS Grid & Flexbox**: Responsive layouts
- **CSS Variables**: Easy theming

## 📁 Project Structure

```
file_converter/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── src/
│   ├── components/
│   │   ├── FileUploader.jsx    # Drag & drop upload
│   │   ├── FilePreview.jsx     # File preview component
│   │   ├── ConversionPanel.jsx # Conversion options
│   │   ├── DownloadButton.jsx  # Download converted file
│   │   ├── Header.jsx          # App header
│   │   └── Footer.jsx          # App footer
│   ├── converters/
│   │   ├── document.js         # Document conversions
│   │   ├── image.js            # Image conversions
│   │   ├── text.js             # Text operations
│   │   └── index.js            # Main converter logic
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # Global styles
│   └── main.jsx                # App entry point
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🔒 Privacy & Security

- ✅ **100% Client-Side**: All conversions happen in your browser
- ✅ **No Uploads**: Your files never leave your device
- ✅ **No Server**: No backend, no database, no tracking
- ✅ **Open Source**: Fully transparent code
- ✅ **Works Offline**: Use the app without internet (after first load)

## 🎨 Supported Conversions

| From | To | Options |
|------|-----|---------|
| DOCX | MD, TXT | - |
| MD | DOCX, TXT | **Full formatting preserved** |
| TXT | MD, DOCX | - |
| JPG/JPEG | PNG, WEBP, GIF, BMP | Resize, Quality |
| PNG | JPG, WEBP, GIF, BMP | Resize, Quality |
| WEBP | JPG, PNG, GIF, BMP | Resize, Quality |
| GIF | JPG, PNG, WEBP, BMP | Resize, Quality |
| BMP | JPG, PNG, WEBP, GIF | Resize, Quality |
| **HEIC/HEIF** | **JPG, PNG, WEBP, GIF** | **Resize, Quality** |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions
- Add more conversion formats (PDF, CSV, JSON, XML)
- Implement OCR with Tesseract.js
- Add video conversion with ffmpeg.wasm
- Improve mobile responsiveness
- Add dark mode
- Support batch conversions

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information

## 💡 Feature Requests

Have an idea? Open an issue with the "enhancement" label!

## 🙏 Acknowledgments

Built with these amazing open-source libraries:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [mammoth.js](https://github.com/mwilliamson/mammoth.js)
- [docx](https://github.com/dolanmiu/docx)
- [marked](https://github.com/markedjs/marked)
- [turndown](https://github.com/mixmark-io/turndown)
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)
- [heic2any](https://github.com/alexcorvi/heic2any)

---

Made with ❤️ by [Jeevan Bhatta](https://github.com/jeevanbhatta)

⭐ Star this repo if you find it useful!

