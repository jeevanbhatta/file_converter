import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUploader from './components/FileUploader';
import FilePreview from './components/FilePreview';
import ConversionPanel from './components/ConversionPanel';
import DownloadButton from './components/DownloadButton';
import { convertFile } from './converters';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setConvertedFile(null);
    setTargetFormat('');
    setError(null);
    setProgress(0);
  };

  const handleConvert = async (format, options = {}) => {
    setIsConverting(true);
    setError(null);
    setProgress(10);
    setTargetFormat(format);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const result = await convertFile(selectedFile, format, options);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setConvertedFile(result);
        setIsConverting(false);
      }, 300);
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err.message || 'Conversion failed. Please try again.');
      setIsConverting(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setConvertedFile(null);
    setTargetFormat('');
    setError(null);
    setProgress(0);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {!selectedFile && (
            <FileUploader onFileSelect={handleFileSelect} />
          )}

          {selectedFile && !convertedFile && (
            <div className="conversion-container">
              <div className="left-panel">
                <FilePreview file={selectedFile} />
                <button className="reset-btn" onClick={handleReset}>
                  Choose Different File
                </button>
              </div>
              
              <div className="right-panel">
                <ConversionPanel
                  file={selectedFile}
                  onConvert={handleConvert}
                  isConverting={isConverting}
                  progress={progress}
                />
                
                {error && (
                  <div className="error-message">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {convertedFile && (
            <div className="success-container">
              <DownloadButton
                convertedFile={convertedFile}
                originalFileName={selectedFile.name}
                targetFormat={targetFormat}
              />
              
              <button className="reset-btn secondary" onClick={handleReset}>
                Convert Another File
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

