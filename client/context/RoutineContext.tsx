import { Routine } from "@/types/Global";
import { createContext, ReactNode, useContext, useState } from "react";
import * as crypto from "expo-crypto";

type RoutineContextType = {
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
  deleteRoutine: (id: string) => void;
  updateRoutine: (routine: Routine) => void;
};

const RoutineContext = createContext<RoutineContextType | null>(null);

export const RoutineProvider = ({ children }: { children: ReactNode }) => {
  const [routine, setRoutine] = useState<Routine>({
    id: crypto.randomUUID(),
    name: "",
    exercises: [],
    notes: "",
  });

  const [routines, setRoutines] = useState<Routine[]>([]);

  const resetRoutine = () => {
    setRoutine({
      id: crypto.randomUUID(),
      name: "",
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
        routines,
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
