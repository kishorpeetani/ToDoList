import '../styles/Nav.css';
import { NewTaskContainer } from './NewTaskContainer';

export function Nav({ newTaskContaineropen, setnewTaskContainer }){
    function openOrClose(){
        setnewTaskContainer(!newTaskContaineropen);
    }
    return(
      <nav>
        <div>ToDoList</div>
        <button onClick={openOrClose}>
          Add Task
        </button>
      </nav>
    );
}