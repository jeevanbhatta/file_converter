# Changelog

## [1.1.0] - 2025-11-28

### Added

#### HEIC Image Support
- Full HEIC/HEIF support for iPhone photos
- Automatically converts HEIC to standard formats (JPG, PNG, WEBP, GIF)
- Uses heic2any library for client-side conversion
- Supports both single and multi-frame HEIC images

#### Enhanced Markdown to DOCX Formatting
- Complete rewrite of MD → DOCX converter
- Text formatting: Bold, italic, strikethrough, underline, inline code
- Headers (H1-H6) with proper Word heading styles
- Lists: Unordered, ordered, and nested with proper indentation
- Code blocks with monospace font and gray background
- Blockquotes with left border styling
- Links with blue underline formatting
- Proper spacing throughout document

### Technical Changes
- Added heic2any@0.0.4 dependency
- Enhanced htmlToDocxParagraphs() function
- Updated all converter modules

## [1.0.0] - 2025-11-28

### Initial Release
- Document conversions: DOCX ↔ MD ↔ TXT
- Image conversions: JPG, PNG, WEBP, GIF, BMP
- 100% client-side processing
- Modern React + Vite architecture
- GitHub Pages deployment ready
