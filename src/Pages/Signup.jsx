import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../css/signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/auth/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert("User already exists. Try logging in.");
        navigate("/login");
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Expenso</h1>
      <h2 className="page-heading">Create your account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br />
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
        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Log in here
        </span>
      </p>
    </div>
  );
}
