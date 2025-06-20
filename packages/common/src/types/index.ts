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
