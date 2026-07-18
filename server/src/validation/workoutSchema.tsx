import * as z from "zod/v4";

export const workoutSetSchema = z.object({
  order: z.number().int(),
  reps: z.number().int().min(0),
  weight: z.number().min(0).nullable(),
});
export const workoutExerciseSchema = z.object({
  exerciseId: z.string(),
  order: z.number().int(),
  sets: z.array(workoutSetSchema),
  notes: z.string().optional(),
});

export const workoutSchema = z.object({
  routineId: z.string().nullable().optional(),
  name: z.string().min(1, "Workout name is required"),
  notes: z.string().optional(),
  startedAt: z.coerce.date("Started date are required."),
  completedAt: z.coerce.date("Completed date is required."),
  duration: z.number().int().min(1, "Duration  be at least 1 second"),
  exercises: z.array(workoutExerciseSchema).optional(),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;
