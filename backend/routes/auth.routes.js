import { Router } from "express"
import { signUp, signIn } from "../controllers/auth.controller.js"

const authRoutes = Router();

authRoutes.post("/sign-up", signUp);

authRoutes.post("/sign-In", signIn);

// authRoutes.post("/sign-up", signUp);

export default authRoutes;