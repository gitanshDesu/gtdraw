import { MiddlewareType } from "@gtdraw/common/types/index";
import { middlewareHandler } from "@gtdraw/common/utils/asyncHandler";
import { CustomError } from "@gtdraw/common/utils/CustomError";
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
    const decodedToken = jwt.verify(token, "secret") as JwtPayload;

    if (!decodedToken._id) {
      res.status(401).json(new CustomError(401, "Invalid Access Token!"));
      return next();
    }

    //find user using decodedToken?._id, if user exists do req.user else send 401 Invalid Access Token
    return next();
  }
);
