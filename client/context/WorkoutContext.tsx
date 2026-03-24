import { Workout, WorkoutExercise } from "@/types/Global";
import { createContext, ReactNode, useContext, useState } from "react";

type WorkoutContextType = {
  workoutExercises: WorkoutExercise[];
  setWorkoutExercises: React.Dispatch<React.SetStateAction<WorkoutExercise[]>>;
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  resetWorkoutExercises: () => void;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    [],
  );

  const resetWorkoutExercises = () => setWorkoutExercises([]);

  const [workouts, setWorkouts] = useState<Workout[]>([]);

  return (
    <WorkoutContext.Provider
      value={{
        resetWorkoutExercises,
        workoutExercises,
        setWorkoutExercises,
        workouts,
        setWorkouts,
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
