type ExpiryType = `${number}${"s" | "m" | "h" | "d"}`;
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRY: ExpiryType;
      REFRESH_TOKEN_EXPIRY: ExpiryType;
      DATABASE_URL: string;
    }
  }
}

export {};
