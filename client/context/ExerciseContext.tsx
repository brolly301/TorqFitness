import { Exercise } from "@/types/Global";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import exercisesJSON from "../constants/exercises.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addUserExercise,
  archiveUserExercise,
  getUserExercises,
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
  const [exercises, setExercises] = useState<Exercise[]>(exercisesJSON);

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
    setExercises((prev) => {
      const updatedExercises = [...prev, exercise];
      AsyncStorage.setItem("exercises", JSON.stringify(updatedExercises)).catch(
        (err) => console.log("Error saving exercises:", err),
      );
      return updatedExercises;
    });

    const token = await AsyncStorage.getItem("token");

    if (!token) return;

    await addUserExercise(exercise, token);
  };

  const updateExercise = (updatedExercise: Exercise) => {
    setExercises((prev) => {
      const updatedExercises = prev.map((exercise) =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise,
      );

      AsyncStorage.setItem("exercises", JSON.stringify(updatedExercises)).catch(
        (err) => console.log("Error updating exercise:", err),
      );

      return updatedExercises;
    });
  };

  const archiveExercise = async (id: string) => {
    setExercises((prev) => {
      const updatedExercises = prev.map((exercise) =>
        exercise.id === id ? { ...exercise, archived: true } : exercise,
      );
      return updatedExercises;
    });

    await archiveUserExercise(authToken.token, id);
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
