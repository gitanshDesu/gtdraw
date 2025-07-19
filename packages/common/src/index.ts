import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export * from "./config/index";

export * from "./utils/index";
export * from "./zod/index";
export * from "./types/index";
