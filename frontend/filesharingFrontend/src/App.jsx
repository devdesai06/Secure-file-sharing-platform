import React, { useState } from 'react';
import DropZone from './components/DropZone';
import FileList from './components/FileList';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, uploading, success

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
    
    // Simulate upload
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setFiles([]);
        setStatus('idle');
      }, 1500); // Show success for 1.5s
    }, 2000);
  };

  return (
    <div className="main-wrapper">
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
                backgroundColor: status === 'success' ? '#10B981' : '', // Green on success
                transition: 'background-color 0.3s ease'
            }}
          >
            {status === 'uploading' && 'Encrypting & Uploading...'}
            {status === 'success' && 'Transfer Complete!'}
            {status === 'idle' && (
                <>
                    Start Transfer <ArrowRight size={18} />
                </>
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