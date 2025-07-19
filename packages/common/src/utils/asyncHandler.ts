import { NextFunction, Request, Response } from "express";
import { MiddlewareType, RequestHandler } from "../config/commonTypes";

export const asyncHandler = <T extends Request = Request>(
  fn: RequestHandler<T>
) => {
  return (req: T, res: Response, next?: NextFunction) =>
    Promise.resolve(fn(req as T, res)).catch((err) => next!(err));
};

export const middlewareHandler = <T extends Request = Request>(
  middleware: MiddlewareType<T>
) => {
  return (req: T, res: Response, next: NextFunction) =>
    Promise.resolve(middleware(req as T, res, next)).catch((err) => next(err));
};
