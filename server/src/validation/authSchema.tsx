import * as z from "zod/v4";
import {
  emailSchema,
  passwordSchema,
  firstNameSchema,
  surnameSchema,
} from "./sharedSchemas";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const signUpSchema = z
  .object({
    firstName: firstNameSchema,
    surname: surnameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password.trim() === data.confirmPassword.trim(), {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  firstName: firstNameSchema,
  surname: surnameSchema,
  email: emailSchema,
});

export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password.trim() === data.confirmPassword.trim(), {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChnagePasswordFormValues = z.infer<typeof changePasswordSchema>;
