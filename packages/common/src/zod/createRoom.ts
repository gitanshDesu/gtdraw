import { z } from "zod/v4";

export const createRoomSchema = z.object({
  name: z.string("Name field is required!").min(3).max(20),
});

export type CreateRoomType = z.infer<typeof createRoomSchema>;
