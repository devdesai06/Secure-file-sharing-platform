/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import axios from "axios";
import "./DropZone.css";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
export const DropZone = () => {
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(null);
  const [isUploaded, setUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${baseUrl}/share/file-upload`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (response?.status === 200) {
        const fileId = response.data.fileId;
        setUploadedFileId(fileId);
        console.log(response);
        setUploaded(true);
        toast.success("uploaded");
        generateLink(fileId);
      } else {
        toast.error("not uploaded");
      }

      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  const generateLink = async (fileId) => {
    if (!fileId) {
      console.log("Missing fileId");
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/share/${fileId}/file`, {
        params: { expiryTime: 500 },
        withCredentials: true,
      });

      if (response.status === 200) {
        const generatedLink = response.data.downloadUrl;
        setLink(generatedLink);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  return (
    <div className="dropzone-container">
      <Navbar />
      <div
        className={`dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          hidden
        />

        {file ? (
          <div className="file-preview">
            <p>{file.name}</p>
          </div>
        ) : (
          <p>Drag & Drop your file here or Click to Upload</p>
        )}
      </div>

      {file && !isUploaded && (
        <button className="upload-btn" onClick={handleUpload}>
          Upload File
        </button>
      )}
     {isUploaded && link && (
  <div className="result-card">
    <div className="result-header">
      <div className="status-dot" />
      <div>
        <h3>File Ready</h3>
        <p>Your secure share link has been generated.</p>
      </div>
    </div>

    <div className="result-body">
      <input
        type="text"
        value={link}
        readOnly
        className="result-input"
      />

      <div className="result-actions">
        <button
          className="btn-secondary"
          onClick={() => {
            navigator.clipboard.writeText(link);
            toast.success("Link copied");
          }}
        >
          Copy Link
        </button>

        <button
          className="btn-primary"
          onClick={() => window.open(link, "_blank")}
        >
          Open
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default DropZone;
