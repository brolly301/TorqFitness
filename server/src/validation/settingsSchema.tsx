import * as z from "zod/v4";

export const contactSchema = z.object({
  email: z.string().min(1, "Routine name is required"),
  subject: z.string().optional(),
  message: z.string().optional(),
});
export const issueSchmea = z.object({
  email: z.string().min(1, "Routine name is required"),
  issue: z.string().optional(),
  message: z.string().optional(),
});
export const feedbackSchema = z.object({
  message: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
