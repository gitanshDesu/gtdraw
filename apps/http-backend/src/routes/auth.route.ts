import { Router } from "express";
import { loginUser, registerUser } from "../auth/controllers/auth.controller";

const router: Router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
export { router as authRouter };
