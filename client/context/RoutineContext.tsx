import { createContext, ReactNode, useContext } from "react";

type RoutineContextType = {};

const RoutineContext = createContext<RoutineContextType | null>(null);

export const RoutineProvider = ({ children }: { children: ReactNode }) => {
  return (
    <RoutineContext.Provider value={{}}>{children}</RoutineContext.Provider>
  );
};

export const useRoutineContext = () => {
  const context = useContext(RoutineContext);

  if (!context)
    throw new Error("useRoutineContext must be inside RoutineProvider");

  return context;
};
