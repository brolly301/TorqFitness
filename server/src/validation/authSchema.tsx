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

export const signUpSchema = z.object({
  firstName: firstNameSchema,
  surname: surnameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const requestResetCodeSchema = z.object({
  email: emailSchema,
});

export const verifyResetCodeSchema = z.object({
  email: emailSchema,
  code: z.string().min(1, "Code is required."),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  firstName: firstNameSchema,
  surname: surnameSchema,
  email: emailSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type RequestResetCodeFormValues = z.infer<typeof requestResetCodeSchema>;
export type VerifyResetCodeFormValues = z.infer<typeof verifyResetCodeSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
