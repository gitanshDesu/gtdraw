import { createRoomSchema } from "@gtdraw/common/createRoom";
import { Request, Response } from "express";
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const result = createRoomSchema.safeParse(req.body);
    if (!result.success) {
      //TODO: Throw Custom Error
      res.status(400).json();
      return;
    }
  } catch (error) {
    console.log("Error Occurred while Creating Room:\n", error);
  }
};
