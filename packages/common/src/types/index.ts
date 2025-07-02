import { NextFunction, Request, Response } from "express";

export type RequestHandler<T extends Request = Request> = (
  req: T,
  res: Response,
  next?: NextFunction
) => Promise<void>;

export type ControllerType<T extends Request = Request> = (
  req: T,
  res: Response,
  next?: NextFunction
) => void | Promise<void>;

export type MiddlewareType<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => void;

// types related to ws
export enum TypeFieldEnums {
  JOIN = "join_room",
  LEAVE = "leave_room",
  CHAT = "chat",
}

export type ChatMessageType = {
  type: TypeFieldEnums.CHAT;
  roomId: string;
  message: string;
};
