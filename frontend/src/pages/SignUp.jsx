import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/auth.api";
import "../styles/Auth.css";

export function SignUp({ showNotification }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);

      const data = await signUp(email, password);

      if (data.success) {
        showNotification("OTP sent successfully", "success");

        sessionStorage.setItem("otpCooldownExpiresAt", Date.now() + 30000);

        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        showNotification("Sign up failed", "error");
      }
    } catch (error) {
      if (error.status === 409) {
        showNotification("Account already exists !!", "error");
      } else {
        showNotification(error.message, "error");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="authPage">
      <span className="app-title">ToDoList</span>
      <div className="sign-box">
        <h2>Sign Up</h2>
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

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Create Account"}
          </button>
        </form>
        <p>
          Already have an account?
          <span className="authLink" onClick={() => navigate("/signin")}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
