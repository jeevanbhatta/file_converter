export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <p>
          🔒 All conversions happen in your browser. Your files never leave your device.
        </p>
        <p className="credits">
          Built with React • Open Source •{' '}
          <a 
            href="https://github.com/jeevanbhatta/file_converter" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}

