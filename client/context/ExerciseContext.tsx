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
};

const ExerciseContext = createContext<ExerciseContextType | null>(null);

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    setExercises(exercisesJSON);
  }, []);

  return (
    <ExerciseContext.Provider value={{ exercises, setExercises }}>
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
