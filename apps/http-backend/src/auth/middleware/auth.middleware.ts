import { ACCESS_TOKEN_SECRET } from "@gtdraw/common";
import { MiddlewareType } from "@gtdraw/common";
import { middlewareHandler } from "@gtdraw/common";
import { CustomError } from "@gtdraw/common";
import { prisma } from "@gtdraw/db";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyUser: MiddlewareType = middlewareHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json(new CustomError(401, "Unauthorized Request!"));
      return next();
    }
    //TODO: verify using process.env.JWT_SECRET
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET!) as JwtPayload;

    if (!decodedToken.id) {
      res.status(401).json(new CustomError(401, "Invalid Access Token!"));
      return next();
    }

    //find user using decodedToken?._id, if user exists do req.user else send 401 Invalid Access Token
    const currentUser = await prisma.user.findFirst({
      where: { id: decodedToken?.id },
    });
    req.user = currentUser!;
    return next();
  }
);
