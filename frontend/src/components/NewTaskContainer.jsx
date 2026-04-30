import { useEffect, useState } from "react";
import "../styles/NewTaskContainer.css";
import { createTask, updateTask } from "../api/task.api.js";

export function NewTaskContainer({
  tasks,
  setTasks,
  setnewTaskContainer,
  fetchTasks,
  editingTask,
  setEditingTask,
  showNotification,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask]);

  function saveTitle(event) {
    setTitle(event.target.value);
  }

  function saveDescription(event) {
    setDescription(event.target.value);
  }

  function closeForm() {
    setnewTaskContainer(false);
    setEditingTask(null);
  }

  async function addNewTask(event) {
    event.preventDefault();

    if (editingTask) {
      const taskId = editingTask.id || editingTask._id;
      const updatedTasks = tasks.map((task) =>
        task.id === taskId || task._id === taskId
          ? { ...task, title, description }
          : task
      );

      if (editingTask._id) {
        try {
          await updateTask(taskId, title, description);
          // Re-fetch tasks to get proper sorting with updated task at top
          fetchTasks();
          showNotification("Task updated successfully", "success");
        } catch (error) {
          console.error("Failed to update task", error);
          setTasks(updatedTasks);
          showNotification(error.message || "Failed to update task", "error");
        }
      } else {
        setTasks(updatedTasks);
      }

      setEditingTask(null);
      setnewTaskContainer(false);
      return;
    }

    try {
      await createTask(title, description);
      setTitle("");
      setDescription("");
      setnewTaskContainer(false);
      fetchTasks();
      showNotification("Task created successfully", "success");
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Something went wrong", "error");
    }
  }

  return (
    <>
      <div className="newTask">
        <form className="newTaskContainer" onSubmit={addNewTask}>
          <div className="header">
            <p>{editingTask ? "Edit Task" : "New Task"}</p>

            <button type="button" className="closeBtn" onClick={closeForm}>
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder="Title"
            onChange={saveTitle}
            value={title}
            required
          />

          <textarea
            placeholder="Description.."
            rows={8}
            onChange={saveDescription}
            value={description}
            required
          />

          <button type="submit" className="addTaskBtn">
            {editingTask ? "Save Changes" : "Add Task"}
          </button>
        </form>
      </div>

      <div className="closer" onClick={closeForm} />
    </>
  );
}
