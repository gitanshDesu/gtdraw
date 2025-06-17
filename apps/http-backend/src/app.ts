import express, { Express, urlencoded } from "express";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
export default app;
