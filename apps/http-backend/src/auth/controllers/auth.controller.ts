import { Request, Response } from "express";
import {
  registerUserSchema,
  RegisterUserType,
} from "@gtdraw/common/registerUser";
import { loginUserSchema } from "@gtdraw/common/loginUser";
import { resetPasswordSchema } from "@gtdraw/common/resetPassword";
import { asyncHandler } from "@gtdraw/common/utils/asyncHandler";
import { CustomError } from "@gtdraw/common/utils/CustomError";
import { ApiResponse } from "@gtdraw/common/utils/ApiResponse";
import { ControllerType } from "@gtdraw/common/types/index";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@gtdraw/common/utils/generateTokens";
import { uploadToS3, getUrlFromS3 } from "@gtdraw/common/utils/S3";
import { hash, isPassword } from "@gtdraw/common/utils/password";
import { prisma } from "@gtdraw/db";
import path from "path";

export const registerUser: ControllerType = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { username, fullName, password, email }: RegisterUserType = req.body;

    const result = registerUserSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json(
          new CustomError(400, `Send Valid Inputs!\n ${result.error.message}`)
        );
      return;
    }
    // Check in db if user with username or email already exists, if yes return error and if, no create user and move forward

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      res.status(400).json(new CustomError(400, "User already exists!"));
      return;
    }
    //Hash Password before saving in DB.
    const hashedPass = await hash(password);
    const newUser = await prisma.user.create({
      data: {
        username,
        fullName,
        email,
        password: hashedPass,
      },
      select: {
        username: true,
        fullName: true,
        avatar: true,
      },
    });

    // Add logic for uploading avatar using S3, if avatar is sent (avatar is optional)
    const avatarFileName = req.file?.filename;
    if (avatarFileName) {
      const key = avatarFileName + path.extname(req.file?.originalname!);

      const response = await uploadToS3(
        key,
        req.file?.path!,
        req.file?.mimetype!
      );
      if (!response) {
        throw new CustomError(500, "Error Occurred While Uploading Avatar");
      }
      const avatarUrl = await getUrlFromS3(key);
      if (!avatarUrl) {
        throw new CustomError(
          500,
          "Error occurred while getting Pre-Signed URL"
        );
      }
      await prisma.user.update({
        where: {
          username,
        },
        data: {
          avatar: avatarUrl,
        },
      });
    }

    //TODO: Add logic for email verification

    // generate access and refresh token, update refresh token field.

    const accessToken = await generateAccessToken(newUser.username);
    const refreshToken = await generateRefreshToken(newUser.username);
    const options = {
      httpOnly: true,
      secure: true,
    };

    const updatenewUser = await prisma.user.update({
      where: {
        username,
      },
      data: {
        refreshToken,
      },
    });

    //set cookies and send response 201
    res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, newUser, "User Created Successfully!"));
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

    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [{ username }, { email }],
      },
      select: {
        username: true,
        fullName: true,
        avatar: true,
        password: true,
      },
    });

    if (!existingUser) {
      res.status(404).json(new CustomError(404, "User Doesn't Exist!"));
      return;
    }

    //Check if password sent by user is valid, if not return 400 else move on

    //TODO: Hash Passwords, compare hashed passwords
    if (password !== existingUser.password) {
      res.status(400).json(new CustomError(400, "Invalid Password!"));
      return;
    }

    //Create access and refresh tokens
    const accessToken = await generateAccessToken(existingUser.username);
    const refreshToken = await generateRefreshToken(existingUser.username);

    await prisma.user.update({
      where: {
        username: existingUser.username,
      },
      data: {
        refreshToken,
      },
    });
    const options = {
      httpOnly: true,
      secure: true,
    };

    //Set cookies and send response
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            username: existingUser.username,
            fullName: existingUser.fullName,
            avatar: existingUser.avatar,
          },
          "User Logged In Successfully!"
        )
      );
    return;
  }
);

export const resetPassword: ControllerType = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, oldPassword, newPassword, verifyNewPassword } = req.body;

    const result = resetPasswordSchema.safeParse(req.body);

    if (!result.success) {
      throw new CustomError(400, `Send Valid Inputs:\n ${result.error}`);
    }

    //verify that user logged in and the email sent has same email else send error
    if (req.user?.email !== email) {
      console.error(`User sent email and logged in user email doesn't match`);
      throw new CustomError(400, "Send valid Email!");
    }

    //TODO: Send send verification code mail to reset password on email and then proceed.

    // compare oldPassword with req.user.password
    //Use bcrypt to compare hashed password
    const isPass = await isPassword(oldPassword, req.user?.password!);
    if (!isPass) {
      throw new CustomError(400, "Send Valid Password!");
    }

    //confirm newPassword and verifyNewPassword are same
    if (newPassword !== verifyNewPassword) {
      throw new CustomError(400, "Confirm Password not same!");
    }

    // hash new password and update password field in db.
    const hashNewPass = await hash(newPassword);
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashNewPass,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Password Updated Successfully!"));
    return;
  }
);

export const logout: ControllerType = asyncHandler(
  async (req: Request, res: Response) => {
    //clear user cookies, set them to ""
    //set refreshToken undefined in userDB
    if (!req.user) {
      console.error(`req.user doesn't exist!`);
      throw new CustomError(401, "Unauthroized request!");
    }
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        refreshToken: undefined,
      },
    });
    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully!"));
  }
);
