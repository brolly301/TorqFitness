import { ReactNode } from "react";

export type Exercise = {
  id: string;
  name: string;
  gifUrl: string;
  bodyParts: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  instructions: string[];
};

export type Workout = {
  id: string;
  name: string;
  description?: string;
  startedAt: string | null;
  completedAt: string | null;
  duration: number;
  exercises: WorkoutExercise[];
  notes?: string;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  order: number;
  sets: PerformedSet[];
  notes?: string;
};

export type PerformedSet = {
  id: string;
  order: number;
  reps: number;
  weight?: number | null;
};

export type Routine = {
  id: string;
  name: string;
  description?: string;
  exercises: RoutineExercise[];
  notes?: string;
};

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  order: number;
  sets: RoutineSet[];
  notes?: string;
};

export type RoutineSet = {
  id: string;
  order: number;
  reps: number;
  weight?: number | null;
};

export type Setting = {
  id: string;
  name: string;
  icon: ReactNode;
};
