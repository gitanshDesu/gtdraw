import { Request, Response } from "express";
import { registerUserSchema } from "@gtdraw/common/registerUser";
import { loginUserSchema } from "@gtdraw/common/loginUser";
import { asyncHandler } from "@gtdraw/common/utils/asyncHandler";
import { CustomError } from "@gtdraw/common/utils/CustomError";
import { ApiResponse } from "@gtdraw/common/utils/ApiResponse";
import { ControllerType } from "@gtdraw/common/types/index";

export const registerUser: ControllerType = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, fullName, password, email } = req.body;
    //TODO: Add input validation for req.body using zod.
    const result = registerUserSchema.safeParse(req.body);
    if (!result.success) {
      //TODO: Add custom error
      res
        .status(400)
        .json(
          new CustomError(400, `Send Valid Inputs!\n ${result.error.message}`)
        );
      return;
    }
    // Check in db if user with username or email already exists, if yes return error and if, no create user and move forward

    //TODO: Add logic for uploading avatar using S3, if avatar is sent (avatar is optional)

    //TODO: Add logic for email verification

    //set avatar field for new created User,move on

    // generate access and refresh token

    //set cookies and send response 201
    res.status(201).json();
    return;
  }
);

export const loginUser: ControllerType = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const result = loginUserSchema.safeParse(req.body);
    if (!result.success) {
      //TODO: Add custom error
      res
        .status(400)
        .json(
          new CustomError(400, `Send Valid Inputs!\n ${result.error.message}`)
        );
      return;
    }
    // Check if user with username && email exists, if no return 404 else continue

    //Check if password sent by user is valid, if not return 400 else move on

    //Create access and refresh tokens

    //Set cookies and send response
    res.status(200).json();
    return;
  }
);
