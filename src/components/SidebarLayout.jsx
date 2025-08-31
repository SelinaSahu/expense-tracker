import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar"; // named import since Sidebar uses `export function Sidebar`

export default function Sidebarlayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "200px", padding: "20px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}
