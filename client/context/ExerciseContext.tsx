import { createContext, ReactNode, useContext } from "react";

type ExerciseContextType = {};

const ExerciseContext = createContext<ExerciseContextType | null>(null);

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ExerciseContext.Provider value={{}}>{children}</ExerciseContext.Provider>
  );
};

export const useExerciseContext = () => {
  const context = useContext(ExerciseContext);

  if (!context)
    throw new Error("useExerciseContext must be inside ExerciseProvider");

  return context;
};
