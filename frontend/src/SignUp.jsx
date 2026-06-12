import { useState, useEffect } from "react";
import {
  signUp,
  verifyOtp,
  resendOtp,
} from "./api/auth.api";

export function SignUp({ setPage, setPendingEmail, showNotification }) {
  const [step, setStep] = useState("signup");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedEmail =
      sessionStorage.getItem("pendingEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      setStep("otp");
    }
  }, []);

  async function handleVerifyOtp(e) {
    e.preventDefault();

    try {
      const data = await verifyOtp(
        email,
        otp
      );

      if (data.success) {
        sessionStorage.removeItem(
          "pendingEmail"
        );

        showNotification(
          "Email verified successfully",
          "success"
        );

        setPage("signin");
      }
    } catch (error) {
      showNotification(
        error.message,
        "error"
      );
    }
  }

  async function handleResendOtp() {
    try {
      const data = await resendOtp(
        email
      );

      if (data.success) {
        showNotification(
          "OTP resent successfully",
          "success"
        );
      }
    } catch (error) {
      showNotification(
        error.message,
        "error"
      );
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await signUp(email, password);

      if (data.success) {
        sessionStorage.setItem(
          "pendingEmail",
          email
        );

        setPendingEmail(email);

        showNotification(
          "OTP sent successfully",
          "success"
        );

        setStep("otp");
      } else {
        showNotification("Sign up failed", "error");
      }
    } catch (error) {
      if (error.status === 409) {
        showNotification("Account already exists !!", "error");
      } else {
        showNotification(error.message || "Something went wrong", "error");
      }
      console.error(error);
    }
  }
  return (
    <div className="authPage">
      <div className="sign-box">
        <h2>Sign Up</h2>
        {step === "signup" ? (
          <form onSubmit={handleSubmit}>
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

            <button type="submit">
              Create Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button type="submit">
              Verify OTP
            </button>

            <p>
              Didn't receive OTP?
              <span
                className="authLink"
                onClick={handleResendOtp}
              >
                Resend OTP
              </span>
            </p>
          </form>
        )}

        <p>
          Already have an account?
          <span className="authLink" onClick={() => setPage("signin")}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
