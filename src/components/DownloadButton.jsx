import { getFileExtension } from '../converters';

export default function DownloadButton({ convertedFile, originalFileName, targetFormat }) {
  const handleDownload = () => {
    const url = URL.createObjectURL(convertedFile);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate new filename
    const baseName = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
    link.download = `${baseName}.${targetFormat}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="download-section">
      <div className="success-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      
      <h3>Conversion Complete!</h3>
      
      <button className="download-btn" onClick={handleDownload}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download File
      </button>
    </div>
  );
}

