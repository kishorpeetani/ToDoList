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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;

    setnewTaskContainer(false);
    setEditingTask(null);
  }

  async function addNewTask(event) {
    event.preventDefault();

    // prevent double click submission
    if (isSubmitting) return;

    if(!title.trim()){
      showNotification("Title is required", "error");
      return;
    }

    if(!description.trim()){
      showNotification("Description is required", "error");
      return;
    }

    if (title.trim().length > 100) {
      showNotification("Title cannot exceed 100 characters", "error");
      return;
    }

    if (description.trim().length > 1500) {
      showNotification("Description cannot exceed 1500 characters", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // -------------------------
      // EDIT TASK
      // -------------------------
      if (editingTask) {
        const taskId = editingTask.id || editingTask._id;

        const updatedTasks = tasks.map((task) =>
          task.id === taskId || task._id === taskId
            ? { ...task, title, description }
            : task
        );

        if (editingTask._id) {
          await updateTask(taskId, title, description);

          // fetch again for correct updatedAt sorting
          fetchTasks();

          showNotification("Task updated successfully", "success");
        } else {
          setTasks(updatedTasks);
        }

        setEditingTask(null);
        setnewTaskContainer(false);
        return;
      }

      // -------------------------
      // CREATE TASK
      // -------------------------
      await createTask(title, description);

      setTitle("");
      setDescription("");
      setnewTaskContainer(false);

      fetchTasks();

      showNotification("Task created successfully", "success");
    } catch (error) {
      console.error(error);

      showNotification(error.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="newTask">
        <form noValidate className="newTaskContainer" onSubmit={addNewTask}>
          <div className="header">
            <p>{editingTask ? "Edit Task" : "New Task"}</p>

            <button
              type="button"
              className="closeBtn"
              onClick={closeForm}
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder="Title"
            onChange={saveTitle}
            value={title}
            required
            disabled={isSubmitting}
            maxLength={100}
          />
          <p>{title.length}/100</p>

          <textarea
            placeholder="Description.."
            rows={8}
            onChange={saveDescription}
            value={description}
            required
            disabled={isSubmitting}
            maxLength={1500}
          />
          <p>{description.length}/1500</p>

          <button type="submit" className="addTaskBtn" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : editingTask
              ? "Save Changes"
              : "Add Task"}
          </button>
        </form>
      </div>

      <div className="closer" onClick={closeForm} />
    </>
  );
}
