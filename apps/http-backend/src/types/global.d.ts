import { User } from "@gtdraw/db";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
