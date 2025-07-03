import { z } from "zod/v4";

export const resetRequestSchema = z.object({
  email: z.email(),
});

export type ResetRequestType = z.infer<typeof resetRequestSchema>;
