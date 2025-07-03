import { z } from "zod/v4";

export const resetPasswordSchema = z.object({
  email: z.email("Send Valid Email As Input").trim(),
  oldPassword: z
    .string()
    .trim()
    .min(6, "Password should be at least 6 characters long!")
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/),
  newPassword: z
    .string()
    .trim()
    .min(6, "Password should be at least 6 characters long!")
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/),
  verifyNewPassword: z
    .string()
    .trim()
    .min(6, "Password should be at least 6 characters long!")
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/),
  verificationCode: z.string().min(8),
});

export type resetPasswordType = z.infer<typeof resetPasswordSchema>;
