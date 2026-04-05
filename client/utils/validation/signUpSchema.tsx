import * as z from "zod/v4";
import {
  emailSchema,
  firstNameSchema,
  passwordSchema,
  surnameSchema,
} from "./sharedSchemas";

export const signUpSchema = z
  .object({
    firstName: firstNameSchema,
    surname: surnameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
