import * as z from "zod/v4";

export const exerciseSchema = z.object({
  name: z.string().trim().min(1, "Exercise name is required."),
  bodyParts: z.array(z.string()).min(1, "Body part is required."),
  primaryMuscles: z.array(z.string()).min(1, "Primary muscle is required."),
  secondaryMuscles: z.array(z.string()).optional(),
  equipment: z.array(z.string()).min(1, "Equipment is required."),
  instructions: z.array(z.string()).optional(),
  userCreated: z.boolean(),
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
