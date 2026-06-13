import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api/auth.api.js";
import "../styles/Auth.css";

export function SignIn({ setIsLoggedIn, setUser, showNotification }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      showNotification("Email is required", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showNotification("Enter valid email address", "error");
      return;
    }

    if (!password.trim()) {
      showNotification("Password is required", "error");
      return;
    }

    try {
      const data = await signIn(email, password);

      if (data.success) {
        setIsLoggedIn(true);
        if (data.data?.user?.email) {
          setUser({ email: data.data.user.email });
        }
        showNotification("Signed in successfully", "success");
      } else {
        showNotification(data.message || "Sign in failed", "error");
      }
    } catch (error) {
      if (error.data?.code === "EMAIL_NOT_VERIFIED") {
        showNotification("Please verify your email", "error");

        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      } else if (error.status === 401) {
        showNotification("Invalid Credentials !!", "error");
      } else if (error.status === 404) {
        showNotification("User not Found !!", "error");
      } else {
        showNotification("Something went wrong", "error");
      }
      console.error(error);
    }
  }

  return (
    <div className="authPage">
      <span className="app-title">ToDoList</span>
      <div className="sign-box">
        <h2>Sign In</h2>
        <form noValidate onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Continue</button>
        </form>

        <p>
          <span
            className="authLink"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </p>

        <p>
          New User?
          <span className="authLink" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
