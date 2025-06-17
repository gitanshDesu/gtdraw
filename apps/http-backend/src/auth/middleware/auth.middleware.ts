import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

//TODO: Send middleware in an async handler
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    //TODO: Throw custom error
    res.status(401).json({ message: "unauthorized request" });
    next();
  }
  //TODO: verify using process.env.JWT_SECRET
  const decodedToken = jwt.verify(token, "secret") as JwtPayload;

  if (!decodedToken._id) {
    //TODO: Throw custom Error
    res.status(401).json({ message: "Invalid Access Token!" });
  }

  //find user using decodedToken?._id, if user exists do req.user else send 401 Invalid Access Token
  next();
};
