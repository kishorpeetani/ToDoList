import "./App.css";
import { useEffect, useState } from "react";
import { Nav } from './components/Nav';
import { NewTaskContainer } from "./components/NewTaskContainer";
import { TasksContainer } from "./components/TasksContainer";

function App() {
  const [ newTaskContaineropen, setnewTaskContainer ] = useState(false);
  const [tasks, setTasks] = useState(() => {
    try {
      const localTasks = localStorage.getItem("tasks");
      return localTasks ? JSON.parse(localTasks) : [];
    } catch (e) {
      console.error("Error loading tasks from localStorage:", e);
      return [];
    }
  });

  useEffect(()=>{
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [ tasks ]);

  return (
    <>
      <Nav 
        newTaskContaineropen={newTaskContaineropen} 
        setnewTaskContainer={setnewTaskContainer} 
      />
      {newTaskContaineropen && 
        ( <NewTaskContainer tasks={tasks} setTasks={setTasks} setnewTaskContainer={setnewTaskContainer}/> )
      }
      <TasksContainer tasks={tasks} setTasks={setTasks} />
    </>
  );
}

export default App;
