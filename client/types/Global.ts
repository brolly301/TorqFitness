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
  date: string;
  startTime: string;
  endTime?: string;
  exercises: WorkoutExercise[];
  notes?: string;
};

export type WorkoutExercise = {
  exerciseId: string;
  sets: PerformedSet[];
  notes?: string;
};

export type PerformedSet = {
  reps: number;
  weight?: number;
};

export type Setting = {
  id: string;
  name: string;
  icon: ReactNode;
};
