import { Exercise } from "@/types/Global";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import exercisesJSON from "../constants/exercises.json";
import { ExerciseFormValues } from "@/utils/validation/exerciseSchema";

type UpdateExerciseInput = ExerciseFormValues & { id: string };

type ExerciseContextType = {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  updateExercise: (updatedExercise: UpdateExerciseInput) => void;
  archiveExercise: (exerciseId: string) => void;
};

const ExerciseContext = createContext<ExerciseContextType | null>(null);

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>(exercisesJSON);

  const updateExercise = (updatedExercise: UpdateExerciseInput) => {
    setExercises((prev) => {
      return prev.map((exercise) =>
        exercise.id === updatedExercise.id
          ? { ...exercise, ...updatedExercise }
          : exercise,
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
