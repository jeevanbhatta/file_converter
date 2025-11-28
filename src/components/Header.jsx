export default function Header() {
  return (
    <header className="app-header">
      <div className="container">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
            <rect fill="#4F46E5" width="100" height="100" rx="20"/>
            <path d="M30 35h15v30h-15z" fill="white"/>
            <path d="M55 45h15v20h-15z" fill="white"/>
            <path d="M47 50l8-5v10z" fill="white"/>
          </svg>
          <h1>File Converter</h1>
        </div>
        <p className="tagline">Convert files instantly in your browser</p>
      </div>
    </header>
  );
}

