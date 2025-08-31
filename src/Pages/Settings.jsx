// src/components/Settings.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/Settings.css";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>

      <div className="settings-section">
        <h4>User Info</h4>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.id}</p>
      </div>

      <div className="settings-section">
        <h4>Password</h4>
        <p>Want to reset your password?</p>
        <button className="settings-button">Reset Password</button>
      </div>

      <div className="settings-section">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
