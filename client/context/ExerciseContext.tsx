import { Exercise } from "@/types/Global";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import exercisesJSON from "../constants/exercises.json";

type ExerciseContextType = {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  updateExercise: (updatedExercise: Exercise) => void;
  archiveExercise: (exerciseId: string) => void;
};

const ExerciseContext = createContext<ExerciseContextType | null>(null);

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>(exercisesJSON);

  const updateExercise = (updatedExercise: Exercise) => {
    setExercises((prev) => {
      return prev.map((exercise) =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise,
      );
    });
  };

  const archiveExercise = (exerciseId: string) => {
    setExercises((prev) => {
      return prev.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, archived: true } : exercise,
      );
    });
  };

  return (
    <ExerciseContext.Provider
      value={{ archiveExercise, updateExercise, exercises, setExercises }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExerciseContext = () => {
  const context = useContext(ExerciseContext);

  if (!context)
    throw new Error("useExerciseContext must be inside ExerciseProvider");

  return context;
};
