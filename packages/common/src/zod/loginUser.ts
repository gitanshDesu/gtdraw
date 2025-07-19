import { z } from "zod/v4";

export const loginUserSchema = z.object({
  username: z.string().min(2, "User Name field is required").trim(),
  email: z.email("Send Valid Email as input!").trim(),
  password: z
    .string()
    .trim()
    .min(6, "Password should be at least 6 characters long!")
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., !@#$%^&*)"
    ),
});

export type LoginUserType = z.infer<typeof loginUserSchema>;
