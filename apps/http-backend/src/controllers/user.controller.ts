import { createRoomSchema } from "@gtdraw/common/createRoom";
import { ControllerType } from "@gtdraw/common/types/index";
import { asyncHandler } from "@gtdraw/common/utils/asyncHandler";
import { CustomError } from "@gtdraw/common/utils/CustomError";
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
    res.status(200).json();
    return;
  }
);
