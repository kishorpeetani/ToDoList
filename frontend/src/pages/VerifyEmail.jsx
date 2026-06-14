import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyOtp, resendOtp } from "../api/auth.api";
import "../styles/Auth.css";

export function VerifyEmail({ showNotification }) {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

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

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  async function handleVerifyOtp(e) {
    e.preventDefault();

    if (!otp.trim()) {
      showNotification("OTP is required", "error");
      return;
    }

    if (otp.length !== 6) {
      showNotification("OTP must be 6 digits", "error");
      return;
    }

    try {
      setIsVerifying(true);

      const data = await verifyOtp(email, otp);

      if (data.success) {
        showNotification("Email verified successfully", "success");

        navigate("/signin");
      }
    } catch (error) {
      showNotification(
        error.data?.code === "USER_MESSAGE"
          ? error.message
          : "Something went wrong",
        "error"
      );
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResendOtp() {
    try {
      setIsResending(true);

      const data = await resendOtp(email);

      if (data.success) {
        showNotification("OTP resent successfully", "success");

        const expiresAt = Date.now() + 30000;

        sessionStorage.setItem("otpCooldownExpiresAt", expiresAt);

        setCooldown(30);
      }
    } catch (error) {
      showNotification(
        error.data?.code === "USER_MESSAGE"
          ? error.message
          : "Something went wrong",
        "error"
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="authPage">
      <span className="app-title">ToDoList</span>
      <div className="sign-box">
        <h2>Verify Email</h2>

        <p>{email}</p>

        <form noValidate onSubmit={handleVerifyOtp}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
          />

          <button disabled={isVerifying}>
            {isVerifying ? (
              <>
                <span className="buttonSpinner"></span>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
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
