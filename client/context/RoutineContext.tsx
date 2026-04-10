import { Routine } from "@/types/Global";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RoutineContextType = {
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  updateRoutine: (routine: Routine) => void;
};

const RoutineContext = createContext<RoutineContextType | null>(null);

export const RoutineProvider = ({ children }: { children: ReactNode }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  useEffect(() => {
    getRoutines();
  }, []);

  const getRoutines = async () => {
    try {
      const stored = await AsyncStorage.getItem("routines");

      if (!stored) return;

      setRoutines(JSON.parse(stored));
    } catch (err) {
      console.log("Error loading routine:", err);
    }
  };

  const addRoutine = (routine: Routine) => {
    setRoutines((prev) => {
      const updatedRoutines = [...prev, routine];
      AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines)).catch(
        (err) => console.log("Error saving routine:", err),
      );
      return updatedRoutines;
    });
  };

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => {
      const updatedRoutines = prev.filter((routine) => routine.id !== id);
      AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines)).catch(
        (err) => console.log("Error deleting routine:", err),
      );
      return updatedRoutines;
    });
  };

  const updateRoutine = (updatedRoutine: Routine) => {
    setRoutines((prev) => {
      const updatedRoutines = prev.map((routine) =>
        routine.id === updatedRoutine.id
          ? { ...routine, ...updatedRoutine }
          : routine,
      );
      AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines)).catch(
        (err) => console.log("Error updating routine:", err),
      );

      return updatedRoutines;
    });
  };

  return (
    <RoutineContext.Provider
      value={{
        routines,
        addRoutine,
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
