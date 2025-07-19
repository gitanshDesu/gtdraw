import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "@gtdraw/db";
import { CustomError } from "./CustomError.js";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config/index.js";

export const generateAccessToken = async (username: string) => {
  try {
    const currUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    const token = jwt.sign(
      { id: currUser?.id, username: currUser?.username },
      ACCESS_TOKEN_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY! } as SignOptions
    );
    return token;
  } catch (error) {
    throw new CustomError(
      500,
      `Error Occurred while Generating Access Token!\n ${error}`
    );
  }
};

export const generateRefreshToken = async (username: string) => {
  try {
    const currUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    const token = jwt.sign({ id: currUser?.id }, REFRESH_TOKEN_SECRET!, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    } as SignOptions);
    return token;
  } catch (error) {
    throw new CustomError(
      500,
      `Error Occurred while Generating Refresh Token!\n ${error}`
    );
  }
};
