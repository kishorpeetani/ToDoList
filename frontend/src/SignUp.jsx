import { useState } from "react";
import { signUp } from "./api/auth.api.js";

export function SignUp({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await signUp(email, password);

      if (data.success) {
        alert("Account created successfully");
        setPage("signin");
      } else {
        alert(data.message || "Sign up failed");
      }
    } catch (error) {
      alert(error.message || "Something went wrong");
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
