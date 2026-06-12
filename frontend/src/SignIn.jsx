import { useState } from "react";
import { signIn } from "./api/auth.api.js";

export function SignIn({ setIsLoggedIn, setUser, setPage, setPendingEmail, showNotification }) {
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
        showNotification("Signed in successfully", "success");
      } else {
        showNotification(data.message || "Sign in failed", "error");
      }
    } catch (error) {

      if (error.status === 403) {
        sessionStorage.setItem(
          "pendingEmail",
          email
        );

        setPendingEmail(email);

        showNotification(
          "Please verify your email",
          "error"
        );

        setPage("signup");
      } else if (error.status === 401) {
        showNotification("Invalid Credentials !!", "error");
      } else if (error.status === 404) {
        showNotification("User not Found !!", "error");
      } else {
        showNotification(error.message || "Something went wrong", "error");
      }
      console.error(error);
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
