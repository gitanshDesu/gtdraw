import { z } from "zod/v4";

export const resetRequestSchema = z.object({
  email: z.email().trim().lowercase(),
});

export type ResetRequestType = z.infer<typeof resetRequestSchema>;
