import { useState, useRef } from 'react';
import { isFileSupported } from '../converters';

export default function FileUploader({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (isFileSupported(file.name)) {
        onFileSelect(file);
      } else {
        alert('File type not supported. Please upload a supported file.');
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const file = files[0];
      if (isFileSupported(file.name)) {
        onFileSelect(file);
      } else {
        alert('File type not supported. Please upload a supported file.');
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`file-uploader ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".docx,.md,.txt,.jpg,.jpeg,.png,.webp,.gif,.bmp,.heic,.heif"
      />
      
      <div className="upload-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      
      <h3>Drop your file here</h3>
      <p>or click to browse</p>
      
      <div className="supported-formats">
        <small>Supports: DOCX, MD, TXT, JPG, PNG, WEBP, GIF, HEIC</small>
      </div>
    </div>
  );
}

