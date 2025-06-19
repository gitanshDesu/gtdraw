import { Router } from "express";
import { verifyUser } from "../auth/middleware/auth.middleware";
import { createRoom } from "../controllers/user.controller";

const router: Router = Router();

router.route("/create-room").post(verifyUser, createRoom);

export { router as userRouter };
