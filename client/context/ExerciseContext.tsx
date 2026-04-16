import { Exercise } from "@/types/Global";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addUserExercise,
  archiveUserExercise,
  getUserExercises,
  updateUserExercise,
} from "@/api/exercise";
import { useUserContext } from "./UserContext";

type ExerciseContextType = {
  exercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  updateExercise: (updatedExercise: Exercise) => void;
  archiveExercise: (exerciseId: string) => void;
};

const ExerciseContext = createContext<ExerciseContextType | null>(null);

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const { authToken } = useUserContext();

  useEffect(() => {
    getExercises();
  }, [authToken.token]);

  const getExercises = async () => {
    try {
      if (!authToken.token) return;

      const res = await getUserExercises(authToken.token);

      setExercises(res.exercises);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error loading exercises";
      console.log(message);
    }
  };
  const addExercise = async (exercise: Exercise) => {
    if (!authToken.token) return;

    const res = await addUserExercise(exercise, authToken.token);

    setExercises((prev) => {
      const updatedExercises = [...prev, res.exercise];
      return updatedExercises;
    });
  };

  const updateExercise = async (updatedExercise: Exercise) => {
    if (!authToken.token) return;

    const res = await updateUserExercise(updatedExercise, authToken.token);

    setExercises((prev) => {
      const updatedExercises = prev.map((exercise) =>
        exercise.id === res.exercise.id ? res.exercise : exercise,
      );
      return updatedExercises;
    });
  };

  const archiveExercise = async (id: string) => {
    if (!authToken.token) return;
    await archiveUserExercise(authToken.token, id);

    setExercises((prev) => {
      const updatedExercises = prev.map((exercise) =>
        exercise.id === id ? { ...exercise, archived: true } : exercise,
      );
      return updatedExercises;
    });
  };

  return (
    <ExerciseContext.Provider
      value={{ addExercise, archiveExercise, updateExercise, exercises }}
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
