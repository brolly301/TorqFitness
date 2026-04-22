import * as z from "zod/v4";
import { passwordSchema } from "./sharedSchemas";

export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password.trim() === data.confirmPassword.trim(), {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChnagePasswordFormValues = z.infer<typeof changePasswordSchema>;
