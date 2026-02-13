import { createContext, ReactNode, useContext } from "react";

type WorkoutContextType = {};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WorkoutContext.Provider value={{}}>{children}</WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);

  if (!context)
    throw new Error("useWorkoutContext must be inside WorkoutProvider");

  return context;
};
