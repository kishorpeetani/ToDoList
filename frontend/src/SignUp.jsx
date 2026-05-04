import { useState } from "react";
import { signUp } from "./api/auth.api.js";

export function SignUp({ setPage, showNotification }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await signUp(email, password);

      if (data.success) {
        showNotification("Account created successfully", "success");
        setPage("signin");
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
          <button type="submit">Create Account</button>
        </form>

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
