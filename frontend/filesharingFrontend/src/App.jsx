import React, { useState } from 'react';
import AuthPage from './components/AuthPage'; 
import DropZone from './components/DropZone';
import FileList from './components/FileList';
import { Sparkles, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';
import './App.css';

function App() {
  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // --- APP STATE ---
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');

  // If NOT authenticated, show the Login/Register Slider
  if (!isAuthenticated) {
    return <AuthPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // If Authenticated, show the Main App
  const handleFileSelect = (newFiles) => {
    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(newFiles)]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setStatus('uploading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setFiles([]);
        setStatus('idle');
      }, 1500);
    }, 2000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setFiles([]);
  };

  return (
    <div className="main-wrapper">
      
      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="logout-btn"
        title="Logout"
      >
        <LogOut size={20} />
      </button>

      {/* Main SaaS Card */}
      <div className="saas-card">
        <header className="card-header">
          <div className="brand-pill">
            <Sparkles size={14} fill="currentColor" />
            <span>BoltShare Pro</span>
          </div>
          <h1>File Transfer</h1>
          <p>Securely share huge files with end-to-end encryption.</p>
        </header>

        <div className="card-body">
          <DropZone onFileSelect={handleFileSelect} />
          <FileList files={files} removeFile={removeFile} />
        </div>

        <div className="card-footer">
          <button 
            className="btn-primary" 
            onClick={handleUpload}
            disabled={files.length === 0 || status === 'uploading'}
            style={{
                backgroundColor: status === 'success' ? '#10B981' : '',
            }}
          >
            {status === 'uploading' && 'Encrypting & Uploading...'}
            {status === 'success' && 'Transfer Complete!'}
            {status === 'idle' && (
                <>Start Transfer <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </div>
      
      <p className="footer-note">
        <ShieldCheck size={14} style={{ display:'inline', marginRight: 5, verticalAlign: 'middle' }}/>
        Files are permanently deleted after 7 days
      </p>
    </div>
  );
}

export default App;