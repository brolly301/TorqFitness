import * as z from "zod/v4";

export const workoutSchema = z.object({
  name: z
    .string("Name is required.")
    .nonempty("Name is required.")
    .max(60, "Name must not exceed 60 characters."),
  description: z
    .string("Description is required.")
    .min(5, "Message must contain more than 5 characters.")
    .max(1000, "Message must not exceed 1000 characters."),
});

export type WorkoutSchema = z.infer<typeof workoutSchema>;
