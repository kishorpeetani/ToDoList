import { Router } from "express"
import { getMe, signUp, signIn, signOut } from "../controllers/auth.controller.js"
import { authorize } from "../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.get("/me", authorize, getMe);

authRoutes.post("/sign-up", signUp);

authRoutes.post("/sign-in", signIn);

authRoutes.post("/sign-out", signOut);

export default authRoutes;
