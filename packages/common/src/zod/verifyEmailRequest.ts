import { z } from "zod/v4";

export const verifyEmailRequestSchema = z.object({
  email: z.email(),
});

export type verifyEmailRequestType = z.infer<typeof verifyEmailRequestSchema>;
