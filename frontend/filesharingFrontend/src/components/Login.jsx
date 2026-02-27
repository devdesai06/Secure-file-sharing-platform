import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AuthPage.css";
import { toast } from "react-toastify";
export const LoginPage = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseUrl}/app/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true },
      );
      console.log(response);
      if (response) {
        toast.success("Login successful !!");
        navigate("/");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Login failed. Check your connection.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>

        <p className="toggle-text">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
