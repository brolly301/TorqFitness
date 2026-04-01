import { Routine } from "@/types/Global";
import { createContext, ReactNode, useContext, useState } from "react";
import * as crypto from "expo-crypto";

type RoutineContextType = {
  routine: Routine;
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
  resetRoutine: () => void;
  deleteRoutine: (id: string) => void;
  updateRoutine: (routine: Routine) => void;
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

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((routine) => routine.id !== id));
  };

  const updateRoutine = (updatedRoutine: Routine) => {
    setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === updatedRoutine.id
          ? { ...routine, ...updateRoutine }
          : routine,
      ),
    );
  };

  return (
    <RoutineContext.Provider
      value={{
        routine,
        resetRoutine,
        routines,
        setRoutine,
        setRoutines,
        deleteRoutine,
        updateRoutine,
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
