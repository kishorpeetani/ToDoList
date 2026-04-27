import { Router } from "express";
import { authorize } from "../middleware/auth.middleware";

const userRouter = Router();

//for admin

//get user data
// userRouter.get("/:id", authorize, isAdmin, getUserAndTasks);

// userRouter.post("/:id", authorize, isAdmin, )

// userRouter.get("/", authorize, isAdmin, getAllUsers);