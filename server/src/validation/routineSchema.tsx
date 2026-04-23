import * as z from "zod/v4";
import { workoutExerciseSchema } from "./workoutSchema";

export const routineSchema = z.object({
  name: z.string().min(1, "Routine name is required"),
  notes: z.string().optional(),
  exercises: z.array(workoutExerciseSchema),
});

export type RoutineFormValues = z.infer<typeof routineSchema>;
