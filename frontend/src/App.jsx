import "./App.css";
import { useEffect, useState } from "react";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { Nav } from "./components/Nav";
import { NewTaskContainer } from "./components/NewTaskContainer";
import { TasksContainer } from "./components/TasksContainer";
import { Notification } from "./components/Notification";
import { getMe, signOut } from "./api/auth.api.js";
import { getTasks } from "./api/task.api.js";

function App() {
  const [pendingEmail, setPendingEmail] = useState(
    sessionStorage.getItem("pendingEmail") || ""
  );
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [user, setUser] = useState(null);

  const [page, setPage] = useState("signin");

  const [newTaskContaineropen, setnewTaskContainer] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

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

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setIsLoggedin(false);
      setUser(null);
      setTasks([]);
      setPage("signin");
    }
  }

  async function fetchTasks() {
    try {
      setTasksLoading(true);

      const data = await getTasks();

      if (data.success) {
        setTasks(data.data);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setTasksLoading(false);
    }
  }

  function handleEditTask(task) {
    setEditingTask(task);
    setnewTaskContainer(true);
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
        <h2>Checking your session...</h2>
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
      {!isLoggedIn ? (
        page === "signin" ? (
          <SignIn
            setIsLoggedIn={setIsLoggedin}
            setUser={setUser}
            setPage={setPage}
            setPendingEmail={setPendingEmail}
            showNotification={showNotification}
          />
        ) : (
          <SignUp setPage={setPage} setPendingEmail={setPendingEmail} showNotification={showNotification} />
        )
      ) : (
        <>
          <Nav
            newTaskContaineropen={newTaskContaineropen}
            setnewTaskContainer={setnewTaskContainer}
            user={user}
            onSignOut={handleSignOut}
          />
          {newTaskContaineropen && (
            <NewTaskContainer
              tasks={tasks}
              setTasks={setTasks}
              setnewTaskContainer={setnewTaskContainer}
              fetchTasks={fetchTasks}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              showNotification={showNotification}
            />
          )}
          <TasksContainer
            tasks={tasks}
            setTasks={setTasks}
            tasksLoading={tasksLoading}
            onEditTask={handleEditTask}
            showNotification={showNotification}
          />
        </>
      )}
    </>
  );
}

export default App;
