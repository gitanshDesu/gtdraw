import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../.env");
console.log("Config __dirname:", __dirname);
console.log("Looking for .env at:", envPath);
console.log("File exists:", require("fs").existsSync(envPath));

dotenv.config({
  path: envPath,
});

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;

export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
