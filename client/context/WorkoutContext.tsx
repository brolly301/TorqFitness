import { Workout, WorkoutExercise } from "@/types/Global";
import { createContext, ReactNode, useContext, useState } from "react";

type WorkoutContextType = {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  deleteWorkout: (id: string) => void;
  updateWorkout: (workout: Workout) => void;
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
  };

  const updateWorkout = (updatedWorkout: Workout) => {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === updatedWorkout.id
          ? { ...workout, ...updatedWorkout }
          : workout,
      ),
    );
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        setWorkouts,
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
