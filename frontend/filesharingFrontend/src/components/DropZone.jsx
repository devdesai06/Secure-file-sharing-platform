import React, { useRef, useState } from 'react';
import { UploadCloud, FileUp } from 'lucide-react';
import './DropZone.css';

const DropZone = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length > 0) {
      onFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div
      className={`drop-zone ${isDragOver ? 'active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        hidden
        onChange={(e) => onFileSelect(e.target.files)}
      />
      
      <div className="icon-badge">
        {isDragOver ? <FileUp size={32} /> : <UploadCloud size={32} />}
      </div>
      
      <div className="drop-text">
        <h3>Click to upload or drag and drop</h3>
        <p>SVG, PNG, JPG or GIF (max. 800x400px)</p>
      </div>
    </div>
  );
};

export default DropZone;