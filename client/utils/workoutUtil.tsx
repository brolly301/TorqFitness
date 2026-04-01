import { WorkoutDraft } from "@/types/Global";
import * as crypto from "expo-crypto";

export const addSet = <T extends WorkoutDraft>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  exerciseId: string,
) => {
  setFormData((prev) => ({
    ...prev,
    exercises: prev.exercises.map((exercise) => {
      return exercise.id === exerciseId
        ? {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                id: crypto.randomUUID(),
                order: exercise.sets.length + 1,
                reps: 0,
                weight: null,
              },
            ],
          }
        : exercise;
    }),
  }));
};

export const updateSet = <T extends WorkoutDraft>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  exerciseId: string,
  setId: string,
  field: "reps" | "weight",
  value: number | null,
) => {
  setFormData((prev) => ({
    ...prev,
    exercises: prev.exercises.map((exercise) => {
      return exercise.id === exerciseId
        ? {
            ...exercise,
            sets: exercise.sets.map((set) => {
              return set.id === setId ? { ...set, [field]: value } : set;
            }),
          }
        : exercise;
    }),
  }));
};

export const removeExercise = <T extends WorkoutDraft>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  exerciseId: string,
) => {
  setFormData((prev) => ({
    ...prev,
    exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
  }));
};
