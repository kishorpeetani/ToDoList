import express from "express";
import cors from "cors";
import { PORT } from "./config/env.js";
import connectToDB from './database/db.js';
import tasksRouter from "./routes/tasks.routes.js";
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors({
    origin: "https://to-do-list-iota-hazel-87.vercel.app/",
    credentials: true
}));
app.use(cookieParser());

app.use("/tasks", tasksRouter);

app.use("/auth", authRouter);

app.listen(PORT, ()=>{
    console.log("Server running on port ",PORT);
    
    connectToDB();
});