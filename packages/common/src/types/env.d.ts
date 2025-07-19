import jwt from "jsonwebtoken";
type ExpiryType = `${number}${"s" | "m" | "h" | "d"}`;
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: jwt.Secret;
      REFRESH_TOKEN_SECRET: jwt.Secret;
      ACCESS_TOKEN_EXPIRY: ExpiryType;
      REFRESH_TOKEN_EXPIRY: ExpiryType;
      DATABASE_URL: string;
      ACCESS_KEY: string;
      SECRET_ACCESS_KEY: string;
      BUCKET_REGION: string;
      BUCKET_NAME: string;
      RESEND_API_KEY: string;
      RESEND_MAIL: string;
    }
  }
}

export {};
