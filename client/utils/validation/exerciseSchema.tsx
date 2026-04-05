import * as z from "zod/v4";

const stringArrayField = (fieldName: string) =>
  z
    .array(
      z
        .string()
        .trim()
        .min(1, `${fieldName} items cannot be empty.`)
        .max(60, `${fieldName} items must not exceed 60 characters.`),
    )
    .min(1, `${fieldName} must contain at least 1 item.`);

export const exerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(60, "Name must not exceed 60 characters."),
  bodyParts: stringArrayField("Body parts"),
  primaryMuscles: stringArrayField("Primary muscles"),
  equipment: stringArrayField("Equipment"),
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
