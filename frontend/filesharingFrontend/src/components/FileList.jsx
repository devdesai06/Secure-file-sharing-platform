import React from 'react';
import { FileText, X, Image, Film } from 'lucide-react';
import './FileList.css';

const FileList = ({ files, removeFile }) => {
  if (files.length === 0) return null;

  // Helper to choose icon based on file type
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <Image size={24} />;
    if (['mp4', 'mov'].includes(ext)) return <Film size={24} />;
    return <FileText size={24} />;
  };

  return (
    <div className="file-list-container">
      <div className="list-header">
        <span>Attached Files</span>
        <span className="count-badge">{files.length}</span>
      </div>
      <ul className="file-list">
        {files.map((file, index) => (
          <li key={`${file.name}-${index}`} className="file-row">
            <div className="file-left">
              <div className="file-icon-box">
                {getFileIcon(file.name)}
              </div>
              <div className="file-meta">
                <span className="file-name" title={file.name}>{file.name}</span>
                <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
            <button className="delete-btn" onClick={() => removeFile(index)}>
              <X size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;