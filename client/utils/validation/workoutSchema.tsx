import * as z from "zod/v4";

export const workoutSchema = z.object({
  name: z
    .string("Name is required.")
    .nonempty("Name is required.")
    .max(60, "Name must not exceed 60 characters."),
});

export type WorkoutSchema = z.infer<typeof workoutSchema>;
