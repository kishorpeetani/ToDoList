import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";
import "../styles/Auth.css";

export function ForgotPassword({ showNotification }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      showNotification("Email is required", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showNotification("Enter a valid email address", "error");
      return;
    }

    try {
      setIsSending(true);

      const data = await forgotPassword(email);

      if (data.success) {
        sessionStorage.setItem("otpCooldownExpiresAt", Date.now() + 30000);

        showNotification("OTP sent successfully", "success");

        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      if (error.data?.code === "EMAIL_NOT_VERIFIED") {
        showNotification("Please verify your email first", "error");

        navigate(`/verify-email?email=${encodeURIComponent(email)}`);

        return;
      }
      showNotification(
        error.data?.code === "USER_MESSAGE"
          ? error.message
          : "Something went wrong",
        "error"
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="authPage">
      <span className="app-title">ToDoList</span>

      <div className="sign-box">
        <h2>Forgot Password</h2>

        <form noValidate onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={isSending}>
            {isSending ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p>
          Remember your password?
          <span className="authLink" onClick={() => navigate("/signin")}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
