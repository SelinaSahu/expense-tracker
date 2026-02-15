// src/components/Settings.jsx
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Settings.css";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditForm({
      name: user?.name || "",
      email: user?.email || ""
    });
  };

  const handleSaveProfile = async () => {
    try {
      // Here you would typically make an API call to update the user profile
      console.log("Updating profile:", editForm);
      alert("Profile updated successfully! (This would connect to your backend API)");
      setIsEditing(false);
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: user?.name || "",
      email: user?.email || ""
    });
  };

  const handleChangePassword = () => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      const confirmPassword = prompt("Confirm new password:");
      if (newPassword === confirmPassword) {
        // Here you would typically make an API call to change password
        console.log("Changing password to:", newPassword);
        alert("Password changed successfully! (This would connect to your backend API)");
      } else {
        alert("Passwords don't match!");
      }
    }
  };

  const handleUpdateEmail = () => {
    const newEmail = prompt("Enter new email address:");
    if (newEmail) {
      // Here you would typically make an API call to update email
      console.log("Updating email to:", newEmail);
      alert("Email updated successfully! (This would connect to your backend API)");
    }
  };

  const handleExportData = () => {
    try {
      // Get data from localStorage
      const income = localStorage.getItem("income") || "0";
      const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
      
      // Create export data
      const exportData = {
        user: user,
        income: income,
        expenses: expenses,
        exportDate: new Date().toISOString()
      };

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expense_data_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      alert("Data exported successfully!");
    } catch (error) {
      alert("Failed to export data. Please try again.");
    }
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
    );
    
    if (confirmDelete) {
      const finalConfirm = window.confirm(
        "This is your final warning. All your data will be permanently deleted. Are you absolutely sure?"
      );
      
      if (finalConfirm) {
        try {
          // Here you would typically make an API call to delete the account
          console.log("Deleting account for user:", user?.email);
          
          // Clear local data
          localStorage.clear();
          logout();
          navigate("/signup");
          
          alert("Account deleted successfully.");
        } catch (error) {
          alert("Failed to delete account. Please try again.");
        }
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="settings-container">
      <h2 className="page-heading">Account Settings</h2>

      <div className="settings-section">
        <h4>User Information</h4>
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label>Email Address:</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                placeholder="Enter your email"
              />
            </div>
            <div className="edit-actions">
              <button className="settings-button primary" onClick={handleSaveProfile}>
                <span className="button-icon">💾</span>
                Save Changes
              </button>
              <button className="settings-button secondary" onClick={handleCancelEdit}>
                <span className="button-icon">❌</span>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="user-info-grid">
            <div className="info-item">
              <label>Full Name:</label>
              <span>{user?.name || "Not available"}</span>
            </div>
            <div className="info-item">
              <label>Email Address:</label>
              <span>{user?.email || "Not available"}</span>
            </div>
            <div className="info-item">
              <label>User ID:</label>
              <span>{user?._id || user?.id || "Not available"}</span>
            </div>
            <div className="info-item">
              <label>Account Created:</label>
              <span>{formatDate(user?.createdAt)}</span>
            </div>
            <div className="info-item">
              <label>Last Updated:</label>
              <span>{formatDate(user?.updatedAt)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h4>Account Actions</h4>
        <div className="action-buttons">
          <button className="settings-button primary" onClick={handleEditProfile}>
            <span className="button-icon">✏️</span>
            Edit Profile
          </button>
          <button className="settings-button secondary" onClick={handleChangePassword}>
            <span className="button-icon">🔒</span>
            Change Password
          </button>
          <button className="settings-button secondary" onClick={handleUpdateEmail}>
            <span className="button-icon">📧</span>
            Update Email
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h4>Data Management</h4>
        <div className="action-buttons">
          <button className="settings-button warning" onClick={handleExportData}>
            <span className="button-icon">📊</span>
            Export Data
          </button>
          <button className="settings-button danger" onClick={handleDeleteAccount}>
            <span className="button-icon">🗑️</span>
            Delete Account
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h4>Session Management</h4>
        <button className="logout-button" onClick={handleLogout}>
          <span className="button-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
