import { createRoomSchema } from "@gtdraw/common/createRoom";
import { ControllerType } from "@gtdraw/common/types/index";
import { ApiResponse } from "@gtdraw/common/utils/ApiResponse";
import { asyncHandler } from "@gtdraw/common/utils/asyncHandler";
import { CustomError } from "@gtdraw/common/utils/CustomError";
import {
  deleteFromS3,
  getUrlFromS3,
  uploadToS3,
} from "@gtdraw/common/utils/S3";
import { prisma } from "@gtdraw/db";
import { Request, Response } from "express";
import path from "path";

export const updateAvatar: ControllerType = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.isVerified) {
      throw new CustomError(
        401,
        "User is not verified, please verify your email!"
      );
    }
    //1. Get new Avatar link from req.file (comes from multer)
    const avatarFileName = req.file?.filename;
    if (!avatarFileName) {
      throw new CustomError(400, "Avatar File is Missing!");
    }
    //2. Upload the avatar to cloudinary / S3
    const key = avatarFileName + path.extname(req.file?.originalname!);
    //2.1 Delete old image from S3
    const oldAvatarUrl = req.user?.avatar;
    const oldKey = oldAvatarUrl?.split("?")[0]?.split("/")[3]!;
    const response = await deleteFromS3(oldKey);
    if (!response) {
      throw new CustomError(500, "Error Occurred While Deleting Old Avatar!");
    }
    //2.2 Upload new avatar on S3 and get pre-signed URL
    const uploadResponse = await uploadToS3(
      key,
      req.file?.path!,
      req.file?.mimetype!
    );
    if (!uploadResponse) {
      throw new CustomError(500, "Error Occurred while uploading new Avatar!");
    }
    const newAvatarUrl = await getUrlFromS3(key);
    if (!newAvatarUrl) {
      throw new CustomError(500, "Error Occurred while getting Avatar URL!");
    }

    //TODO: Study about pre-signed S3 objects URLs or whatever is the right term. where we get already uploaded images on S3 link from client.

    //3. Update the avatar path in DB.
    await prisma.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        avatar: newAvatarUrl,
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, { newAvatarUrl }, "Avatar Updated Successfully!")
      );
    return;
  }
);

export const createRoom: ControllerType = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.isVerified) {
      throw new CustomError(
        401,
        "User is not verified, please verify your email!"
      );
    }
    const result = createRoomSchema.safeParse(req.body);
    if (!result.success) {
      //TODO: Throw Custom Error
      res
        .status(400)
        .json(
          new CustomError(400, `Send Valid Inputs!\n ${result.error.message}`)
        );
      return;
    }
    const { name } = result.data;
    //TODO: Slugify name
    const existingRoom = await prisma.room.findFirst({
      where: {
        AND: [{ slug: name }, { adminId: req.user?.id }],
      },
    });
    if (existingRoom) {
      res.status(400).json(new CustomError(400, "Room with name exists!"));
      return;
    }
    const newRoom = await prisma.room.create({
      data: {
        slug: name,
        adminId: req.user?.id!,
      },
    });
    //TODO: populate user info from users table and send instead of adminId.
    res
      .status(200)
      .json(new ApiResponse(201, newRoom, "Room Created Successfully!"));
    return;
  }
);

export const getChats: ControllerType = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?.isVerified) {
      throw new CustomError(
        401,
        "User is not verified, please verify your email!"
      );
    }
    const roomId = req.params;
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
      },
    });
    if (!room) {
      throw new CustomError(404, "Room Doesn't Exist!");
    }
    const allChats = await prisma.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        id: "desc", // this is the reason we make chat id a Number
      },
      take: 50,
      select: {
        message: true,
      },
    });
    const messages = allChats.map((chat) => chat.message);
    res
      .status(200)
      .json(new ApiResponse(200, messages, "All Chat messages retrieved!"));
    return;
  }
);
