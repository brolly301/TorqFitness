import * as z from "zod";

export const exerciseSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required.")
    .max(60, "Name must not exceed 60 characters."),
  description: z
    .string()
    .min(5, "Description must contain more than 5 characters.")
    .max(1000, "Description must not exceed 1000 characters."),
  primaryMuscles: z
    .string()
    .min(5, "Primary muscles must contain more than 5 characters.")
    .max(1000, "Primary muscles must not exceed 1000 characters."),
  secondaryMuscles: z
    .string()
    .min(5, "Secondary muscles must contain more than 5 characters.")
    .max(1000, "Secondary muscles must not exceed 1000 characters."),
  bodyParts: z
    .string()
    .min(5, "Body parts must contain more than 5 characters.")
    .max(1000, "Body parts must not exceed 1000 characters."),
  equipment: z
    .string()
    .min(5, "Equipment must contain more than 5 characters.")
    .max(1000, "Equipment must not exceed 1000 characters."),
});

export type ExerciseSchema = z.infer<typeof exerciseSchema>;
