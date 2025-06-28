import { createRoomSchema } from "@gtdraw/common/createRoom";
import { ControllerType } from "@gtdraw/common/types/index";
import { ApiResponse } from "@gtdraw/common/utils/ApiResponse";
import { asyncHandler } from "@gtdraw/common/utils/asyncHandler";
import { CustomError } from "@gtdraw/common/utils/CustomError";
import { prisma } from "@gtdraw/db";
import { Request, Response } from "express";

export const createRoom: ControllerType = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
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
