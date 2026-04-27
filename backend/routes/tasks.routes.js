import { Router } from "express"
import { authorize } from "../middleware/auth.middleware.js";
import { getUserTasks, addTask, updateTask, deleteTask } from "../controllers/tasks.controller.js";

const tasksRouter = Router();

// get user tasks
tasksRouter.get("/", authorize, getUserTasks);

// add new task
tasksRouter.post("/", authorize, addTask);

// update the task
tasksRouter.put("/:id", authorize, updateTask);

//delete the task
tasksRouter.delete("/:id", authorize, deleteTask);

export default tasksRouter;