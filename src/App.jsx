// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import SidebarLayout from "./components/SidebarLayout";
import Dashboard from "./Pages/Dashboard";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";
import { AuthProvider } from "./Context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <SidebarLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
