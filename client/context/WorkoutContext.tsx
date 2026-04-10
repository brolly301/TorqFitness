import { Workout, WorkoutExercise } from "@/types/Global";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type WorkoutContextType = {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (workout: Workout) => void;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    getWorkouts();
  }, []);

  const getWorkouts = async () => {
    try {
      const stored = await AsyncStorage.getItem("workouts");

      if (!stored) return;

      setWorkouts(JSON.parse(stored));
    } catch (err) {
      console.log("Error loading workouts:", err);
    }
  };

  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => {
      const updatedWorkouts = [...prev, workout];
      AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts)).catch(
        (err) => console.log("Error saving workout:", err),
      );
      return updatedWorkouts;
    });
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => {
      const updatedWorkouts = prev.filter((workout) => workout.id !== id);
      AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts)).catch(
        (err) => console.log("Error deleting workout:", err),
      );
      return updatedWorkouts;
    });
  };

  const updateWorkout = (updatedWorkout: Workout) => {
    setWorkouts((prev) => {
      const updatedWorkouts = prev.map((workout) =>
        workout.id === updatedWorkout.id
          ? { ...workout, ...updatedWorkout }
          : workout,
      );
      AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts)).catch(
        (err) => console.log("Error updating workout:", err),
      );

      return updatedWorkouts;
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        deleteWorkout,
        updateWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);

  if (!context)
    throw new Error("useWorkoutContext must be inside WorkoutProvider");

  return context;
};
