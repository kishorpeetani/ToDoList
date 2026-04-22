import { useState } from "react";
import "../styles/NewTaskContainer.css";

export function NewTaskContainer({ tasks, setTasks, setnewTaskContainer }) {
  
  function saveTitle(event){
    setTitle(event.target.value);
  }
  const [ title, setTitle ] = useState("");

  function saveDescription(event){
    setDescription(event.target.value);
  }
  const [ description, setDescription ] = useState("");

  console.log(title);
  console.log(description);

  function addNewTask(event){
    event.preventDefault();
    const newTasks = [
      ...tasks,
      {
        title: title,
        description: description,
        id: Math.random().toString(36).substring(2, 9),
      }
    ];
    setTasks( newTasks );
    setTitle("");
    setDescription("");
    setnewTaskContainer(false);
  }

  return (
    <>
      <div className="newTask">
        <form className="newTaskContainer" onSubmit={addNewTask}>
          <div className="header">
            <p>New Task</p>
            <button type="button" className="closeBtn"
              onClick={() => {
                setnewTaskContainer(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="currentColor"><path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z"/></svg>
            </button>
          </div>
          <input type="text" placeholder="Title" onChange={saveTitle} value={title} required/>
          <textarea name="" id="" placeholder="Description.." rows={8} onChange={saveDescription} value={description} required/>
          <button type="submit" className="addTaskBtn">Add Task</button>
        </form>
      </div>
      <div
        className="closer"
        onClick={() => {
          setnewTaskContainer(false);
        }}
      >
      </div>
    </>
  );
}
