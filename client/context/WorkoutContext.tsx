import { Workout, WorkoutExercise } from "@/types/Global";
import { createContext, ReactNode, useContext, useState } from "react";
import * as crypto from "expo-crypto";

type WorkoutContextType = {
  workout: Workout;
  setWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  resetWorkout: () => void;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workout, setWorkout] = useState<Workout>({
    id: crypto.randomUUID(),
    name: "",
    description: "",
    startedAt: "",
    completedAt: "",
    duration: 0,
    exercises: [],
    notes: "",
  });

  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const resetWorkout = () => {
    setWorkout({
      id: crypto.randomUUID(),
      name: "",
      description: "",
      startedAt: "",
      completedAt: "",
      duration: 0,
      exercises: [],
      notes: "",
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        workout,
        setWorkout,
        workouts,
        setWorkouts,
        resetWorkout,
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
