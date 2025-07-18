import { Router } from "express";
import { verifyUser } from "../auth/middleware/auth.middleware";
import {
  createRoom,
  getChats,
  updateAvatar,
} from "../controllers/user.controller";
import { upload } from "../auth/middleware/multer.middleware";

const router: Router = Router();

router.route("/create-room").post(verifyUser, createRoom);
router
  .route("/update-avatar")
  .post(verifyUser, upload.single("avatar"), updateAvatar);

router.route("/chats").get(verifyUser, getChats);

export { router as userRouter };
