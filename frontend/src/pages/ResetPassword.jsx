import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/auth.api";
import "../styles/Auth.css";

export function ResetPassword({ showNotification }) {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [isResetting, setIsResetting] = useState(false);

  const [isResending, setIsResending] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    const updateCooldown = () => {
      const expiresAt = sessionStorage.getItem("otpCooldownExpiresAt");

      if (!expiresAt) {
        setCooldown(0);
        return;
      }

      const remaining = Math.max(
        0,
        Math.ceil((Number(expiresAt) - Date.now()) / 1000)
      );

      setCooldown(remaining);

      if (remaining === 0) {
        sessionStorage.removeItem("otpCooldownExpiresAt");
      }
    };

    updateCooldown();

    const interval = setInterval(updateCooldown, 1000);

    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!otp.trim()) {
      showNotification("OTP is required", "error");
      return;
    }

    if (otp.length !== 6) {
      showNotification("OTP must be 6 digits", "error");
      return;
    }

    if (!newPassword.trim()) {
      showNotification("Password is required", "error");
      return;
    }

    if (newPassword.length < 6) {
      showNotification("Password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      setIsResetting(true);

      const data = await resetPassword(email, otp, newPassword);

      if (data.success) {
        showNotification("Password reset successful", "success");

        sessionStorage.removeItem("otpCooldownExpiresAt");

        navigate("/signin");
      }
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsResetting(false);
    }
  }

  async function handleResendOtp() {
    try {
      setIsResending(true);

      const data = await forgotPassword(email);

      if (data.success) {
        const expiresAt = Date.now() + 30000;

        sessionStorage.setItem("otpCooldownExpiresAt", expiresAt);

        setCooldown(30);

        showNotification("OTP resent successfully", "success");
      }
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="authPage">
      <span className="app-title">ToDoList</span>

      <div className="sign-box">
        <h2>Reset Password</h2>

        <p>{email}</p>

        <form noValidate onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={isResetting}>
            {isResetting ? "Resetting..." : "Reset Password"}
          </button>

          <p>
            Didn't receive OTP?
            <span
              className={`authLink ${
                cooldown > 0 || isResending ? "disabledLink" : ""
              }`}
              onClick={
                cooldown > 0 || isResending ? undefined : handleResendOtp
              }
            >
              {isResending
                ? "Sending..."
                : cooldown > 0
                ? `Resend OTP (${cooldown}s)`
                : "Resend OTP"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
