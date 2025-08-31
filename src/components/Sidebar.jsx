import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Sidebar.css";

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">MyApp</h2>
      <nav className="sidebar-nav">
        <Link to="/" className={pathname === "/dashboard" ? "active" : ""}>Dashboard</Link>
        <Link to="/reports" className={pathname === "/reports" ? "active" : ""}>Reports</Link>
        <Link to="/settings" className={pathname === "/settings" ? "active" : ""}>Settings</Link>
      </nav>
    </div>
  );
}
