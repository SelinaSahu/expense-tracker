import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react";
import axios from "axios";
import "../css/login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      login(res.data.user);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("User not found. Redirecting to signup...");
        navigate("/signup");
      } else {
        alert("An error occurred during login.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Expenso</h1>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        <button type="submit">Login</button>
      </form>

      <p>
        New user?{" "}
        <span
          onClick={() => navigate("/signup")}
          style={{ color: "blue", cursor: "pointer", fontWeight: "bold" }}
        >
          Sign up here
        </span>
      </p>
    </div>
  );
}
