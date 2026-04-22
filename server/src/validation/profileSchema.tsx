import * as z from "zod/v4";
import { emailSchema, firstNameSchema, surnameSchema } from "./sharedSchemas";

export const profileSchema = z.object({
  firstName: firstNameSchema,
  surname: surnameSchema,
  email: emailSchema,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
