import { Router } from "express";
import {
  loginUser,
  logout,
  registerUser,
  resetPassword,
  resetRequest,
  verifyEmail,
  verifyEmailRequest,
} from "../auth/controllers/auth.controller";
import { upload } from "../auth/middleware/multer.middleware";
import { verifyUser } from "../auth/middleware/auth.middleware";

const router: Router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/request-reset").post(verifyUser, resetRequest);
router.route("/reset-password").patch(verifyUser, resetPassword);
router.route("/request-verify-email").post(verifyUser, verifyEmailRequest);
router.route("/verify-email").post(verifyUser, verifyEmail);
router.route("/logout").post(verifyUser, logout);
export { router as authRouter };
