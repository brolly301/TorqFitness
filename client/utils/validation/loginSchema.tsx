import * as z from "zod/v4";
import { emailSchema, passwordSchema } from "./sharedSchemas";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
