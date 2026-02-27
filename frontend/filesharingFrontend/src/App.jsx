import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import DropZone from "./components/DropZone";
import MyFiles from "./components/myFiles";
import Services from "./components/Services";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="page-content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="services" element={<Services />} />
            <Route path="/myfiles" element={<MyFiles />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<DropZone />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={2000} theme="dark" />
        </div>
      </div>
    </Router>
  );
}

export default App;
