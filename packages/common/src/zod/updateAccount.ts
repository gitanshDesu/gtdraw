import { z } from "zod/v4";

export const updateAccountSchema = z.object({
  username: z.string().min(2, "username field is required!"),
  fullName: z.string().min(2, "Full Name field is required!"),
});

export type updateAccountType = z.infer<typeof updateAccountSchema>;
