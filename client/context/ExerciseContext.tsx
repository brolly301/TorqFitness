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
import { addUserExercise } from "@/api/exercise";

type ExerciseContextType = {
  exercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  updateExercise: (updatedExercise: Exercise) => void;
  archiveExercise: (exerciseId: string) => void;
};

const ExerciseContext = createContext<ExerciseContextType | null>(null);

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<Exercise[]>(exercisesJSON);

  useEffect(() => {
    getExercises();
  }, []);

  const getExercises = async () => {
    try {
      const stored = await AsyncStorage.getItem("exercises");

      if (!stored) {
        await AsyncStorage.setItem("exercises", JSON.stringify(exercisesJSON));

        setExercises(exercisesJSON);
        return;
      }

      setExercises(JSON.parse(stored));
    } catch (err) {
      console.log("Error loading exercises:", err);
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

  const archiveExercise = (exerciseId: string) => {
    setExercises((prev) => {
      const updatedExercises = prev.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, archived: true } : exercise,
      );

      AsyncStorage.setItem("exercises", JSON.stringify(updatedExercises)).catch(
        (err) => console.log("Error archiving exercise:", err),
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
