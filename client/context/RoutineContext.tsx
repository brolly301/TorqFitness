import { Routine } from "@/types/Global";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addUserRoutine,
  deleteUserRoutine,
  getUserRoutines,
} from "@/api/routines";
import { useUserContext } from "./UserContext";

type RoutineContextType = {
  routines: Routine[];
  addRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  updateRoutine: (routine: Routine) => void;
};

const RoutineContext = createContext<RoutineContextType | null>(null);

export const RoutineProvider = ({ children }: { children: ReactNode }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const { authToken } = useUserContext();

  useEffect(() => {
    getRoutines();
  }, [authToken.token]);

  const getRoutines = async () => {
    try {
      if (!authToken.token) return;

      const res = await getUserRoutines(authToken.token);

      setRoutines(res.routines);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error loading routines";
      console.log(message);
    }
  };

  const addRoutine = async (routine: Routine) => {
    setRoutines((prev) => {
      const updatedRoutines = [...prev, routine];
      AsyncStorage.setItem("routines", JSON.stringify(updatedRoutines)).catch(
        (err) => console.log("Error saving routine:", err),
      );
      return updatedRoutines;
    });

    const token = await AsyncStorage.getItem("token");

    if (!token) return;

    await addUserRoutine(routine, token);
  };

  const deleteRoutine = async (id: string) => {
    setRoutines((prev) => {
      const updatedRoutines = prev.filter((routine) => routine.id !== id);
      return updatedRoutines;
    });

    await deleteUserRoutine(authToken.token, id);
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
