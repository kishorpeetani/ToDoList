import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { NewTaskContainer } from "../components/NewTaskContainer";
import { TasksContainer } from "../components/TasksContainer";
import { signOut } from "../api/auth.api.js";
import { getTasks } from "../api/task.api";

export function TasksPage({ user, showNotification, setIsLoggedIn, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [newTaskContaineropen, setnewTaskContainer] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setTasks([]);
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

  return (
    <div className="task-page-container">
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
    </div>
  );
}
