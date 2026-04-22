import '../styles/TasksContainer.css';
import { Tasks } from './Tasks.jsx';

export function TasksContainer({ tasks, setTasks }){
    return(
        <div className="tasksContainer" id='tasksContainer'>
            { tasks.length == 0 ? 
                (<div className="noTasks" id="noTasks">
                    No Tasks Yet..
                </div>) :
                ( <Tasks tasks={tasks} setTasks={setTasks} /> )
            }
        </div>
    );
}