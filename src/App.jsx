// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SidebarLayout from "./components/SidebarLayout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
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
