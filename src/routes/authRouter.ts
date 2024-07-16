import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth";
import { authCheck } from "../midleware/auth";
import { getMe } from "../controllers/users";

const authRouter = Router();

authRouter.post("/sign-up", createUser);
authRouter.post("/sign-in", loginUser);
authRouter.get("/me", authCheck, getMe);
export default authRouter;
