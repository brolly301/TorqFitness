import * as z from "zod/v4";

export const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required."),
  bodyParts: z.array(z.string()),
  primaryMuscles: z.array(z.string()),
  secondaryMuscles: z.array(z.string()).optional(),
  equipment: z.array(z.string()),
  instructions: z.array(z.string()).optional(),
  userCreated: z.boolean(),
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
