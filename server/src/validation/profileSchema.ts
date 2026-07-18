import * as z from "zod/v4";

export const experienceLevelSchema = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
]);

export const updateUserProfileSchema = z.object({
  heightCm: z
    .number()
    .positive("Height must be greater than zero.")
    .max(300, "Height must be 300 cm or less.")
    .nullable()
    .optional(),

  goalWeightKg: z
    .number()
    .positive("Goal weight must be greater than zero.")
    .max(500, "Goal weight must be 500 kg or less.")
    .nullable()
    .optional(),

  experienceLevel: experienceLevelSchema.nullable().optional(),
});

export const createWeightEntrySchema = z.object({
  weightKg: z
    .number()
    .positive("Weight must be greater than zero.")
    .max(500, "Weight must be 500 kg or less."),

  measuredAt: z.coerce.date().optional(),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export type CreateWeightEntryValues = z.infer<typeof createWeightEntrySchema>;
