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
  updateUserWorkout,
} from "@/api/workout";
import { useUserContext } from "./UserContext";
import { toggleToast } from "@/utils/toggleToast";

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

    const payload = {
      name: workout.name,
      notes: workout.notes,
      startedAt: workout.startedAt,
      completedAt: workout.completedAt,
      duration: workout.duration,
      exercises: workout.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        order: ex.order,
        notes: ex.notes,
        sets: ex.sets.map((set) => ({
          order: set.order,
          reps: set.reps,
          weight: set.weight,
        })),
      })),
    };

    const res = await addUserWorkout(payload, authToken.token);

    setWorkouts((prev) => {
      const updatedWorkouts = [...prev, res.workout];
      return updatedWorkouts;
    });

    setTimeout(() => {
      toggleToast({
        type: "success",
        text1: "Workout added",
        text2: `Successfully created ${res.workout.name}.`,
      });
    }, 800);
  };

  const deleteWorkout = async (id: string) => {
    setWorkouts((prev) => {
      const updatedWorkouts = prev.filter((workout) => workout.id !== id);
      return updatedWorkouts;
    });

    await deleteUserWorkout(authToken.token, id);

    setTimeout(() => {
      toggleToast({
        type: "success",
        text1: "Workout deleted",
        text2: `Successfully deleted workout.`,
      });
    }, 800);
  };

  const updateWorkout = async (updatedWorkout: Workout) => {
    if (!authToken.token) return;

    const res = await updateUserWorkout(updatedWorkout, authToken.token);

    setWorkouts((prev) => {
      const updatedWorkouts = prev.map((workout) =>
        workout.id === res.workout.id
          ? { ...workout, ...res.workout }
          : workout,
      );
      return updatedWorkouts;
    });

    setTimeout(() => {
      toggleToast({
        type: "success",
        text1: "Workout saved",
        text2: `Successfully saved ${res.workout.name}.`,
      });
    }, 800);
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
