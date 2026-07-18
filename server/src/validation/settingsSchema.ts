import * as z from "zod/v4";

export const contactSchema = z.object({
  email: z.email("Please enter a valid email address"),
  subject: z.string().trim().min(1, "Subject is required").max(100),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export const issueSchema = z.object({
  email: z.email("Please enter a valid email address"),
  issue: z.string().trim().min(1, "Issue is required").max(100),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export const feedbackSchema = z.object({
  message: z.string().trim().min(1, "Feedback is required").max(2000),
});

export const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
});
