import { Workout } from "@/types/Global";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addUserWorkout,
  deleteUserWorkout,
  getUserWorkouts,
} from "@/api/workout";
import { useUserContext } from "./UserContext";

type WorkoutContextType = {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  updateWorkout: (workout: Workout) => void;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const { authToken } = useUserContext();

  useEffect(() => {
    getWorkouts();
  }, [authToken.token]);

  const getWorkouts = async () => {
    try {
      if (!authToken.token) return;

      const res = await getUserWorkouts(authToken.token);

      setWorkouts(res.workouts);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error loading workouts";
      console.log(message);
    }
  };

  const addWorkout = async (workout: Workout) => {
    if (!authToken.token) return;

    const res = await addUserWorkout(workout, authToken.token);

    setWorkouts((prev) => {
      const updatedWorkouts = [...prev, res.workout];
      return updatedWorkouts;
    });
  };

  const deleteWorkout = async (id: string) => {
    setWorkouts((prev) => {
      const updatedWorkouts = prev.filter((workout) => workout.id !== id);
      return updatedWorkouts;
    });

    await deleteUserWorkout(authToken.token, id);
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
