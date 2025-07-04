import { z } from "zod/v4";

export const verifyEmailRequestSchema = z.object({
  email: z.email().trim().lowercase(),
});

export type verifyEmailRequestType = z.infer<typeof verifyEmailRequestSchema>;
