import * as z from "zod/v4";

const routineSetSchema = z.object({
  order: z.number().int(),
  reps: z.number().int().min(0),
  weight: z.number().min(0).nullable(),
});

const routineExerciseSchema = z.object({
  exerciseId: z.string(),
  order: z.number().int(),
  sets: z.array(routineSetSchema).min(1, "At least one set is required"),
  notes: z.string().optional(),
});

export const routineSchema = z.object({
  name: z.string().trim().min(1, "Routine name is required"),
  notes: z.string().optional(),
  exercises: z
    .array(routineExerciseSchema)
    .min(1, "At least one exercise is required"),
});

export type RoutineFormValues = z.infer<typeof routineSchema>;
