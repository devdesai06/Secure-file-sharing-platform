/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyFiles.css";
import axios from "axios";
import { toast } from "react-toastify";
const MyFiles = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [files, setfiles] = useState([]);

  const handleView = async (fileId) => {
    try {
      const response = await axios.get(`${baseUrl}/share/${fileId}/file`, {
        params: { expiryTime: 300 },
        withCredentials: true,
      });

      const link = response.data.downloadUrl;
      window.open(link, "_blank");
    } catch (err) {
      toast.error("Cannot open file");
    }
  };

  const handleCopy = async (fileId) => {
    try {
      const response = await axios.get(`${baseUrl}/share/${fileId}/file`, {
        params: { expiryTime: 300 },
        withCredentials: true,
      });
      const link = response.data.downloadUrl;
      await navigator.clipboard.writeText(link);
      toast.success("Link copied");
    } catch (err) {
      toast.error("Cannot copy link");
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`${baseUrl}/share/deletefile/${fileId}`, {
        withCredentials: true,
      });

      // remove from UI instantly (optimistic update)
      setfiles((prev) => prev.filter((file) => file.fileId !== fileId));

      toast.success("File deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };
  useEffect(() => {
    const getmyfiles = async () => {
      try {
        const response = await axios.get(`${baseUrl}/share/getmyfiles`, {
          withCredentials: true,
        });
        setfiles(response.data.files);
      } catch (err) {
        const errorMsg = err.response?.data?.error || "Cannot get files";
        toast.error(errorMsg);
      }
    };
    getmyfiles();
  }, [baseUrl]);
  return (
    <div className="files-page">
      <div className="files-container">
        {/* Top Bar */}
        <div className="top-bar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {/* Page Header */}
        <div className="files-header">
          <div>
            <h1>My Files</h1>
            <p>Manage and monitor your uploaded files</p>
          </div>
        </div>

        {/* Files Card */}
        <div className="files-card">
          <div className="files-table-header">
            <span>Name</span>
            <span>Size</span>
            <span>Uploaded</span>
            <span>Type</span>
            <span>Actions</span>
          </div>
          {files.length === 0 ? (
            <div className="empty-state">
              <h3>No files yet</h3>
              <p>Upload your first file to start sharing.</p>
            </div>
          ) : (
            files.map((file) => {
              const formattedSize =
                file.size < 1024 * 1024
                  ? (file.size / 1024).toFixed(1) + " KB"
                  : (file.size / (1024 * 1024)).toFixed(2) + " MB";

              const formattedDate = new Date(
                file.uploadTime,
              ).toLocaleDateString();

              const fileType =
                file.mimetype?.split("/")[1]?.toUpperCase() || "FILE";

              return (
                <div key={file.fileId} className="files-row">
                  <div className="file-name">
                    <div className="file-icon">📄</div>
                    <span className="file-name-text" title={file.originalName}>
                      {file.originalName}
                    </span>
                  </div>

                  <span>{formattedSize}</span>
                  <span>{formattedDate}</span>
                  <span className="file-type">{fileType}</span>

                  <div className="file-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleView(file.fileId)}
                    >
                      View
                    </button>

                    <button
                      className="action-btn"
                      onClick={() => handleCopy(file.fileId)}
                    >
                      Copy Link
                    </button>

                    <button
                      className="action-danger"
                      onClick={() => handleDelete(file.fileId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFiles;
