import { Routine } from "@/types/Global";
import { createContext, ReactNode, useContext, useState } from "react";
import * as crypto from "expo-crypto";

type RoutineContextType = {
  routine: Routine;
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
  resetRoutine: () => void;
};

const RoutineContext = createContext<RoutineContextType | null>(null);

export const RoutineProvider = ({ children }: { children: ReactNode }) => {
  const [routine, setRoutine] = useState<Routine>({
    id: crypto.randomUUID(),
    name: "",
    description: "",
    exercises: [],
    notes: "",
  });

  const [routines, setRoutines] = useState<Routine[]>([]);

  const resetRoutine = () => {
    setRoutine({
      id: crypto.randomUUID(),
      name: "",
      description: "",
      exercises: [],
      notes: "",
    });
  };

  return (
    <RoutineContext.Provider
      value={{
        routine,
        resetRoutine,
        routines,
        setRoutine,
        setRoutines,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};

export const useRoutineContext = () => {
  const context = useContext(RoutineContext);

  if (!context)
    throw new Error("useRoutineContext must be inside RoutineProvider");

  return context;
};
