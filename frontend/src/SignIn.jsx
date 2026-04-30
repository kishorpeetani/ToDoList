import { useState } from "react";
import { signIn } from "./api/auth.api.js";

export function SignIn({ setIsLoggedIn, setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await signIn(email, password);

      if (data.success) {
        setIsLoggedIn(true);
        if (data.data?.user?.email) {
          setUser({ email: data.data.user.email });
        }
      } else {
        alert(data.message || "Sign in failed");
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
      console.error(err);
    }
  }

  return (
    <div className="authPage">
      <div className="sign-box">
        <h2>Sign In</h2>
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
          <button type="submit">Continue</button>
        </form>

        <p>
          New User?
          <span className="authLink" onClick={() => setPage("signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
