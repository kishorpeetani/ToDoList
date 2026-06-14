import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { TasksPage } from "./pages/TasksPage.jsx";

import { VerifyEmail } from "./pages/VerifyEmail.jsx";

import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

import { Notification } from "./components/Notification";
import { getMe } from "./api/auth.api.js";

function App() {
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const data = await getMe();

      if (data.success) {
        setIsLoggedin(true);
        setUser(data.user);
      } else {
        setIsLoggedin(false);
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setIsLoggedin(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function showNotification(message, type = "error") {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }

  if (loading) {
    return (
      <div className="loadingScreen">
        <div className="spinner"></div>
        <h2>Checking your session</h2>
      </div>
    );
  }
  return (
    <>
      {notification && (
        <Notification
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <Routes>
        <Route
          path="/signin"
          element={
            isLoggedIn ? (
              <Navigate to="/tasks" />
            ) : (
              <SignIn
                setIsLoggedIn={setIsLoggedin}
                setUser={setUser}
                showNotification={showNotification}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to="/tasks" />
            ) : (
              <SignUp showNotification={showNotification} />
            )
          }
        />

        <Route
          path="/verify-email"
          element={
            isLoggedIn ? (
              <Navigate to="/tasks" />
            ) : (
              <VerifyEmail showNotification={showNotification} />
            )
          }
        />

        <Route
          path="/tasks"
          element={
            isLoggedIn ? (
              <TasksPage
                user={user}
                showNotification={showNotification}
                setIsLoggedIn={setIsLoggedin}
                setUser={setUser}
              />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword showNotification={showNotification} />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword showNotification={showNotification} />}
        />

        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/tasks" : "/signin"} />}
        />

        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/tasks" : "/signin"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;
