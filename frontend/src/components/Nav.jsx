import "../styles/Nav.css";
import { useState } from "react";

export function Nav({
  newTaskContaineropen,
  setnewTaskContainer,
  user,
  onSignOut,
}) {
  const [profileOpen, setProfileOpen] = useState(false);

  function openOrClose() {
    setnewTaskContainer(!newTaskContaineropen);
    setProfileOpen(false);
  }

  function toggleProfile() {
    setProfileOpen((current) => !current);
  }

  function handleSignOut() {
    setProfileOpen(false);
    onSignOut();
  }
  return (
    <nav>
      <div>ToDoList</div>
      <div className="navActions">
        <button onClick={openOrClose} className="addTaskButton">
          Add Task
        </button>
        <div className="profileWrapper">
          <button
            type="button"
            className="profileBtn"
            onClick={toggleProfile}
            aria-label="Open profile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="22"
              height="22"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
          {profileOpen && (
            <div className="profileMenu">
              <p>{user?.email ?? "Signed in user"}</p>
              <button
                type="button"
                className="signOutBtn"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
