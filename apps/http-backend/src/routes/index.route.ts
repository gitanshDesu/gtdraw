import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";

const router: Router = Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);

export { router as indexRouter };
