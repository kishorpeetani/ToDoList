import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { PORT, CLIENT_URL } from "./config/env.js";
import connectToDB from './database/db.js';
import tasksRouter from "./routes/tasks.routes.js";
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";


const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

app.set("trust proxy", 1);

app.use(helmet());

app.use(express.json());

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

app.use(cookieParser());

app.use("/auth", authLimiter);

app.use("/tasks", tasksRouter);

app.use("/auth", authRouter);

app.use(errorMiddleware);

app.listen(PORT, ()=>{
    console.log("Server running on port ",PORT);
    
    connectToDB();
});
