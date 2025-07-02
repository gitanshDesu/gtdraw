declare global {
  namespace NodeJS {
    interface ProcessEnv {
      QUEUE_CONNECTION_URL: string;
      QUEUE_NAME: string;
    }
  }
}

export {};
