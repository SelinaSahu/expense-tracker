import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export default function Sidebarlayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <div 
        style={{ 
          marginLeft: isSidebarCollapsed ? "60px" : "200px", 
          padding: "20px", 
          width: "100%",
          transition: "margin-left 0.3s ease"
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
