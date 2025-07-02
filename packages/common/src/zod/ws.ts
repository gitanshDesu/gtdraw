import { z } from "zod/v4";
import { TypeFieldEnums } from "../types";
export const parsedDataSchema = z.object({
  type: z.enum([
    TypeFieldEnums.JOIN,
    TypeFieldEnums.LEAVE,
    TypeFieldEnums.CHAT,
  ]),
  roomId: z.string("Room Id is required!"),
  message: z.string().optional(),
});

export type ParsedDataType = z.infer<typeof parsedDataSchema>;
