import { z } from "zod/v4";

export const registerUserSchema = z.object({
  username: z.string("User Name field is required").trim(),
  fullName: z.string("Full Name field is required!").trim(),
  email: z.email("Send Valid Email As Input").trim().lowercase(),
  password: z
    .string()
    .trim()
    .min(6, "Password should be at least 6 characters long!")
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/),
});

export type RegisterUserType = z.infer<typeof registerUserSchema>;
