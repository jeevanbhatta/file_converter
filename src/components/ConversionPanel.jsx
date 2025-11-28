import { useState } from 'react';
import { getSupportedConversions, getFileCategory } from '../converters';

export default function ConversionPanel({ 
  file, 
  onConvert, 
  isConverting, 
  progress 
}) {
  const [targetFormat, setTargetFormat] = useState('');
  const [imageOptions, setImageOptions] = useState({
    maxWidth: '',
    maxHeight: '',
    quality: 0.92
  });

  const supportedFormats = getSupportedConversions(file.name);
  const category = getFileCategory(file.name);
  const isImage = category === 'image';

  const handleConvert = () => {
    if (!targetFormat) {
      alert('Please select a target format');
      return;
    }

    const options = isImage ? {
      maxWidth: imageOptions.maxWidth ? parseInt(imageOptions.maxWidth) : null,
      maxHeight: imageOptions.maxHeight ? parseInt(imageOptions.maxHeight) : null,
      quality: parseFloat(imageOptions.quality)
    } : {};

    onConvert(targetFormat, options);
  };

  return (
    <div className="conversion-panel">
      <h3>Convert to:</h3>
      
      <div className="format-selector">
        {supportedFormats.map(format => (
          <button
            key={format}
            className={`format-btn ${targetFormat === format ? 'active' : ''}`}
            onClick={() => setTargetFormat(format)}
            disabled={isConverting}
          >
            .{format.toUpperCase()}
          </button>
        ))}
      </div>

      {isImage && targetFormat && (
        <div className="image-options">
          <h4>Image Options (optional)</h4>
          
          <div className="option-group">
            <label>
              Max Width (px):
              <input
                type="number"
                value={imageOptions.maxWidth}
                onChange={(e) => setImageOptions(prev => ({ 
                  ...prev, 
                  maxWidth: e.target.value 
                }))}
                placeholder="Auto"
                disabled={isConverting}
              />
            </label>
            
            <label>
              Max Height (px):
              <input
                type="number"
                value={imageOptions.maxHeight}
                onChange={(e) => setImageOptions(prev => ({ 
                  ...prev, 
                  maxHeight: e.target.value 
                }))}
                placeholder="Auto"
                disabled={isConverting}
              />
            </label>
          </div>

          <label>
            Quality: {Math.round(imageOptions.quality * 100)}%
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={imageOptions.quality}
              onChange={(e) => setImageOptions(prev => ({ 
                ...prev, 
                quality: parseFloat(e.target.value) 
              }))}
              disabled={isConverting}
            />
          </label>
        </div>
      )}

      {isConverting && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        className="convert-btn"
        onClick={handleConvert}
        disabled={!targetFormat || isConverting}
      >
        {isConverting ? 'Converting...' : 'Convert File'}
      </button>
    </div>
  );
}

