import React from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="services-page">
      <div className="services-container">

        {/* Back Button */}
        <div className="top-bar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {/* Hero Section */}
        <div className="services-hero">
          <h1>Secure File Sharing, Simplified</h1>
          <p>
            DropDaddy provides secure, temporary file sharing with full control,
            privacy protection, and seamless access.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">

          <div className="service-card">
            <div className="service-icon">🔒</div>
            <h3>Secure Upload</h3>
            <p>
              Files are securely stored with unique identifiers and protected
              using authentication-based access.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">⏳</div>
            <h3>Temporary Access Links</h3>
            <p>
              Generate signed URLs that expire automatically, giving you full
              control over how long your files remain accessible.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">📁</div>
            <h3>File Management Dashboard</h3>
            <p>
              View, copy, open, and delete your uploaded files through a
              clean and intuitive dashboard interface.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">⚡</div>
            <h3>Fast Cloud Storage</h3>
            <p>
              Powered by high-performance object storage for reliable and
              scalable file delivery.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🔐</div>
            <h3>Access Control</h3>
            <p>
              Only file owners can generate or delete links, ensuring strong
              privacy boundaries.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">🌍</div>
            <h3>Anywhere Access</h3>
            <p>
              Share files instantly across devices and locations with secure,
              browser-based access.
            </p>
          </div>

        </div>

        {/* CTA Section */}
        <div className="services-cta">
          <h2>Start Sharing Smarter</h2>
          <button
            className="cta-btn"
            onClick={() => navigate("/")}
          >
            Upload Your First File
          </button>
        </div>

      </div>
    </div>
  );
};

export default Services;