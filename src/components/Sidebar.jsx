import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "../css/Sidebar.css";

export function Sidebar({ isCollapsed, onToggle }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          {isCollapsed ? (
            <div className="logo-icon">💰</div>
          ) : (
            <h2>Expenso</h2>
          )}
        </div>
        {user && !isCollapsed && (
          <p className="user-greeting">Hello {user.name}!</p>
        )}
      </div>
      
      <button className="sidebar-toggle" onClick={onToggle}>
        <span></span>
      </button>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className={pathname === "/dashboard" ? "active" : ""}>
          {isCollapsed ? '📊' : 'Dashboard'}
        </Link>
        <Link to="/reports" className={pathname === "/reports" ? "active" : ""}>
          {isCollapsed ? '📈' : 'Reports'}
        </Link>
        <Link to="/settings" className={pathname === "/settings" ? "active" : ""}>
          {isCollapsed ? '⚙️' : 'Settings'}
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          {isCollapsed ? '🚪' : 'Logout'}
        </button>
      </div>
    </div>
  );
}
