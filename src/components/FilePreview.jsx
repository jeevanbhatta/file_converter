import { useState, useEffect } from 'react';
import { getFileExtension, getFileCategory, formatFileSize } from '../converters';

export default function FilePreview({ file }) {
  const [preview, setPreview] = useState(null);
  const [textContent, setTextContent] = useState('');
  const category = getFileCategory(file.name);
  const extension = getFileExtension(file.name);

  useEffect(() => {
    if (category === 'image') {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (category === 'document') {
      file.text().then(text => {
        setTextContent(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      });
    }
  }, [file, category]);

  return (
    <div className="file-preview">
      <div className="preview-header">
        <div className="file-icon">
          {category === 'image' ? '🖼️' : '📄'}
        </div>
        <div className="file-info">
          <h4>{file.name}</h4>
          <p>{formatFileSize(file.size)} • {extension.toUpperCase()}</p>
        </div>
      </div>

      <div className="preview-content">
        {category === 'image' && preview && (
          <img src={preview} alt="Preview" />
        )}
        {category === 'document' && textContent && (
          <pre>{textContent}</pre>
        )}
      </div>
    </div>
  );
}

