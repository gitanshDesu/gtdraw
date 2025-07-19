import express, {
  Express,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import cookieParser from "cookie-parser";
import { CustomError } from "@gtdraw/common";

const app: Express = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
//global error handler - should be at last (as no next is used)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(
    `Error Occurred and caught by custom error handler middleware:\n ${err}`
  );
  throw new CustomError(500, `Internal Server Error Occurred:\n ${err}`);
});
export default app;
