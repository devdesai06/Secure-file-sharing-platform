/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
function Navbar() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${baseUrl}/app/is-auth`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Auth check failed", error);
    }
  };

  const logout = async () => {
    try {
      const data = await axios.post(`${baseUrl}/app/logout`, {
        withCredentials: true,
      });
      if (data) {
        toast.success("Logout successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error logging out");
    }
  };
  useEffect(() => {
    let isMounted = true; // Cleanup flag to prevent memory leaks

    const verify = async () => {
      await checkAuthStatus();
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-content">
        <div className="nav-brand">
          <span>DropDaddy</span>
        </div>

        <ul className="nav-menu">
          <li>
            <a href="/services" className="nav-link">
              Services
            </a>
          </li>
          {/* Only show 'My Project' or 'Dashboard' if logged in */}
          {isLoggedIn && (
            <li>
              <a href="/myfiles" className="nav-link">
                My files
              </a>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <a href="#about" className="nav-link">
                Account
              </a>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          {isLoggedIn ? (
            <button className="nav-btn-secondary2" onClick={logout}>Log Out</button>
          ) : (
            <>
              <Link className="nav-btn-secondary" to="/login">
                Log in
              </Link>
              <Link className="nav-btn-primary" to="/register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
